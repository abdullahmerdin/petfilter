import type { AdminApiContext } from "@shopify/shopify-app-react-router/server";
import type { FilterRule } from "@prisma/client";
import prisma from "../../db.server";
import { evaluatePetAgainstRule } from "../matching/matching";
import { getResponseCache, CacheTier, CacheKeys } from "../../lib/response-cache";

// === TYPES ===

export interface BestMatchProduct {
  productId: string;
  handle: string;
  title: string;
  image: string | null;
  price: string;
  compareAtPrice: string | null;
  score: number;
  maxScore: number;
  scorePercent: number;
  matchedCriteria: string[];
  petType: string | null;
}

export interface BestMatchesResult {
  matches: BestMatchProduct[];
  total: number;
  currentPetType: string | null;
  badgeEnabled: boolean;
}

// === HELPERS ===

/** Count how many criteria are applicable for a given pet (determines maxScore). */
function countApplicableCriteria(pet: {
  petType: string | null;
  breed: string | null;
  size: string | null;
  ageGroup: string | null;
  dietaryNeeds: string | null;
  temperament: string | null;
  color: string | null;
  weight: string | null;
}): number {
  let count = 0;
  if (pet.petType) count++;
  if (pet.breed) count++;
  if (pet.size) count++;
  if (pet.ageGroup) count++;
  if (pet.dietaryNeeds) count++;
  if (pet.temperament) count++;
  if (pet.color) count++;
  if (pet.weight) count++;
  return count;
}

const APPLICABLE_FIELDS: (keyof FilterRule)[] = [
  "petType",
  "breedFilter",
  "sizeFilter",
  "ageFilter",
  "dietFilter",
  "temperamentFilter",
  "colorFilter",
  "weightMin",
  "weightMax",
  "vaccinated",
  "neutered",
];

/** Build a FilterRule object from the current pet's attributes (dynamic rule). */
function buildRuleFromPet(pet: {
  petType: string | null;
  breed: string | null;
  size: string | null;
  ageGroup: string | null;
  dietaryNeeds: string | null;
  temperament: string | null;
  color: string | null;
  weight: string | null;
  vaccinated: boolean;
  neutered: boolean;
}): FilterRule {
  const parsedWeight = pet.weight ? parseFloat(pet.weight) : null;
  return {
    id: "",
    shop: "",
    name: "",
    description: null,
    petType: pet.petType,
    breedFilter: pet.breed,
    sizeFilter: pet.size,
    ageFilter: pet.ageGroup,
    dietFilter: pet.dietaryNeeds,
    temperamentFilter: pet.temperament,
    colorFilter: pet.color,
    weightMin: parsedWeight !== null && !isNaN(parsedWeight) ? parsedWeight - 10 : null,
    weightMax: parsedWeight !== null && !isNaN(parsedWeight) ? parsedWeight + 10 : null,
    vaccinated: null,  // Only match if other pet matches current pet's vaccinated status equivalently
    neutered: null,
    isActive: true,
    priority: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// === SHOPIFY GRAPHQL: batch product lookup ===

interface ShopifyProductNode {
  id: string;
  title: string;
  handle: string;
  images: { nodes: Array<{ url: string }> };
  variants: { nodes: Array<{ price: string; compareAtPrice: string | null }> };
}

async function fetchProductsByIds(
  admin: AdminApiContext,
  gids: string[],
): Promise<Map<string, ShopifyProductNode>> {
  const response = await admin.graphql(
    `#graphql
    query GetProducts($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
          id
          title
          handle
          images(first: 1) { nodes { url } }
          variants(first: 1) { nodes { price, compareAtPrice } }
        }
      }
    }`,
    { variables: { ids: gids } },
  );
  const json = await response.json();
  const nodes: ShopifyProductNode[] = json?.data?.nodes ?? [];
  const map = new Map<string, ShopifyProductNode>();
  for (const node of nodes) {
    if (node?.id) map.set(node.id, node);
  }
  return map;
}

// === MAIN FUNCTION ===

export async function getStorefrontBadgeData(shop: string, productId: string) {
  const [settings, pet] = await Promise.all([
    prisma.shopSettings.findUnique({ where: { shop } }),
    prisma.petProfile.findUnique({ where: { productId } }),
  ]);
  if (!settings?.badgeEnabled || !pet) return null;
  return { badgeColor: settings.badgeColor, badgeText: settings.badgeText, petType: pet.petType };
}

export async function getCompatibleBadgeData(shop: string, productId: string) {
  const [settings, currentPet] = await Promise.all([
    prisma.shopSettings.findUnique({ where: { shop } }),
    prisma.petProfile.findUnique({ where: { productId } }),
  ]);
  if (!currentPet || !settings) return null;
  const compatiblePets = await prisma.petProfile.findMany({
    where: { shop, petType: currentPet.petType, id: { not: currentPet.id } },
    take: 5,
  });
  return { buttonLabel: settings.buttonLabel, compatibleCount: compatiblePets.length };
}

/**
 * Get best-matching products for the current product's pet profile.
 * Returns null if badge is disabled or current pet not found (caller should return 204).
 */
export async function getBestMatchesData(
  shop: string,
  productId: string,
  admin: AdminApiContext,
): Promise<BestMatchesResult | null> {
  const cache = getResponseCache();

  return cache.getOrCompute(
    CacheKeys.bestMatches(shop, productId),
    async () => {
      // 1. Check badge enabled + fetch current pet
      const [settings, currentPet] = await Promise.all([
        prisma.shopSettings.findUnique({ where: { shop } }),
        prisma.petProfile.findUnique({ where: { productId } }),
      ]);

      if (!settings?.badgeEnabled || !currentPet) return null;

      // 2. Build dynamic rule from current pet
      const rule = buildRuleFromPet(currentPet);
      const maxScore = countApplicableCriteria(currentPet);

      // 3. Find all OTHER pet profiles for this shop
      const allPets = await prisma.petProfile.findMany({
        where: { shop, id: { not: currentPet.id } },
      });

      if (allPets.length === 0) {
        return { matches: [], total: 0, currentPetType: currentPet.petType, badgeEnabled: true };
      }

      // 4. Evaluate and sort
      const results = allPets
        .map((p) => evaluatePetAgainstRule(p, rule))
        .filter((r) => r.score >= 1)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);

      if (results.length === 0) {
        return { matches: [], total: 0, currentPetType: currentPet.petType, badgeEnabled: true };
      }

      // 5. Batch fetch Shopify product data for all matched profiles
      const gids = results.map((r) => r.profile.productId);
      const productMap = await fetchProductsByIds(admin, gids);

      // 6. Build response
      const matches: BestMatchProduct[] = results.map((r) => {
        const product = productMap.get(r.profile.productId);
        const variant = product?.variants?.nodes?.[0];
        const scorePercent = maxScore > 0 ? Math.round((r.score / maxScore) * 100) : 0;

        return {
          productId: r.profile.productId,
          handle: product?.handle ?? r.profile.productHandle ?? "",
          title: product?.title ?? r.profile.productTitle ?? "Unknown Product",
          image: product?.images?.nodes?.[0]?.url ?? null,
          price: variant?.price ?? "",
          compareAtPrice: variant?.compareAtPrice ?? null,
          score: r.score,
          maxScore,
          scorePercent,
          matchedCriteria: r.matchedCriteria,
          petType: r.profile.petType,
        };
      });

      return {
        matches,
        total: matches.length,
        currentPetType: currentPet.petType,
        badgeEnabled: true,
      };
    },
    CacheTier.LONG,
    { revalidate: true },
  );
}

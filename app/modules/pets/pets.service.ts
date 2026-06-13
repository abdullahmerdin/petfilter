import type { AdminApiContext } from "@shopify/shopify-app-react-router/server";
import type { PetProfile } from "@prisma/client";
import prisma from "../../db.server";
import { canCreatePetProfile } from "../../lib/plan-limits.server";

const PAGE_SIZE = 20;

export async function listPets(admin: AdminApiContext, shop: string, after: string | null = null) {
  const response = await admin.graphql(`#graphql
    query ListProductsWithMetafields($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        edges {
          node {
            id
            title
            handle
            status
            metafields(namespace: "pet_filter", first: 10) {
              edges {
                node { key value }
              }
            }
          }
          cursor
        }
        pageInfo { hasNextPage endCursor }
      }
    }`,
    { variables: { first: PAGE_SIZE + 1, after } }
  );
  const json = await response.json();
  const profiles = await prisma.petProfile.findMany({ where: { shop } });
  const rawEdges = json.data.products.edges || [];
  const displayEdges = rawEdges.slice(0, PAGE_SIZE);
  const hasNext = rawEdges.length > PAGE_SIZE;
  const endCursor = displayEdges.length > 0 ? displayEdges[displayEdges.length - 1].cursor : null;

  return {
    products: { edges: displayEdges, pageInfo: { hasNextPage: hasNext, endCursor } },
    profiles,
    hasNext,
    endCursor,
  };
}

export async function updatePetMetafields(
  admin: AdminApiContext, productId: string,
  metafields: Array<{ key: string; value: string }>
) {
  const response = await admin.graphql(`#graphql
    mutation SetMetafields($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { id key value }
        userErrors { field message }
      }
    }`, {
    variables: {
      metafields: metafields.map(m => ({
        ownerId: productId, namespace: "pet_filter",
        key: m.key, value: m.value, type: "single_line_text_field",
      })),
    },
  });
  return response.json();
}

export async function savePetProfile(shop: string, productId: string, data: Partial<PetProfile>) {
  // Check plan limit before creating new profile (upsert allows updates)
  const existing = await prisma.petProfile.findUnique({ where: { productId } });
  if (!existing) {
    const limitCheck = await canCreatePetProfile(shop);
    if (!limitCheck.allowed) {
      throw new Error(`LIMIT_REACHED:Pet profiles (${limitCheck.current}/${limitCheck.limit}). Upgrade to Pro for unlimited.`);
    }
  }
  await prisma.petProfile.upsert({
    where: { productId },
    update: { ...data, shop },
    create: { ...data, shop, productId },
  });
}

export async function getPetProfile(productId: string) {
  return prisma.petProfile.findUnique({ where: { productId } });
}

export async function deletePetProfile(productId: string) {
  await prisma.petProfile.deleteMany({ where: { productId } });
}

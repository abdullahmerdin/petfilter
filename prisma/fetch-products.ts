// Fetch real products from Shopify store and create pet profiles
// Run with: npx tsx prisma/fetch-products.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const shop = "paws-for-good-2.myshopify.com";

async function getAccessToken() {
  const session = await prisma.session.findFirst({
    where: { shop },
    orderBy: { id: "desc" },
  });
  if (!session) throw new Error("No session found for shop " + shop);
  return session.accessToken;
}

async function shopifyGraphql(query: string, variables: any = {}, token: string) {
  const url = `https://${shop}/admin/api/2026-01/graphql.json`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

const petTypes = ["dog", "cat", "dog", "bird", "cat", "dog", "fish", "small_pet", "dog", "cat"];
const breeds = ["Labrador", "Persian", "Beagle", "Cockatiel", "Siamese", "Poodle", "Betta", "Hamster", "Golden Retriever", "Maine Coon"];
const sizes = ["large", "medium", "small", "small", "medium", "medium", "small", "small", "large", "large"];
const ageGroups = ["adult", "adult", "baby", "adult", "senior", "adult", "adult", "baby", "baby", "adult"];
const temperaments = ["friendly", "calm", "energetic", "calm", "friendly", "energetic", "calm", "friendly", "energetic", "calm"];
const colors = ["golden", "white", "brown", "gray", "cream", "black", "blue", "brown", "golden", "orange"];
const weights = ["28", "4", "12", "0.1", "5", "22", "0.01", "0.15", "32", "7"];
const diets = ["Premium kibble", "Wet food only", "Puppy formula", "Seed mix", "Senior formula", "Grain-free", "Flakes", "Pellets + veggies", "Puppy formula", "Senior formula"];

function pick(arr: string[], idx: number) { return arr[idx % arr.length]; }

async function fetchAllProducts(token: string) {
  let allProducts: any[] = [];
  let cursor: string | null = null;
  let hasNext = true;

  while (hasNext) {
    const data = await shopifyGraphql(`
      query ($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          edges {
            node { id title handle status }
            cursor
          }
          pageInfo { hasNextPage endCursor }
        }
      }
    `, { first: 50, after: cursor }, token);

    const edges = data.products.edges;
    allProducts = allProducts.concat(edges.map((e: any) => e.node));
    hasNext = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;
  }

  return allProducts;
}

async function main() {
  console.log("Fetching access token...");
  const token = await getAccessToken();

  console.log("Fetching products from Shopify...");
  const products = await fetchAllProducts(token);
  console.log(`Found ${products.length} products`);

  // Only profile products that don't already have a profile
  const existingProfiles = await prisma.petProfile.findMany({
    where: { shop },
    select: { productId: true },
  });
  const existingIds = new Set(existingProfiles.map(p => p.productId));

  const newProducts = products.filter(p => !existingIds.has(p.id));
  console.log(`${newProducts.length} products without profiles`);

  for (let i = 0; i < newProducts.length; i++) {
    const p = newProducts[i];
    const profile = {
      shop,
      productId: p.id,
      productHandle: p.handle,
      petType: pick(petTypes, i),
      breed: pick(breeds, i),
      size: pick(sizes, i),
      ageGroup: pick(ageGroups, i),
      temperament: pick(temperaments, i),
      color: pick(colors, i),
      weight: pick(weights, i),
      dietaryNeeds: pick(diets, i),
      vaccinated: i % 3 !== 0,
      neutered: i % 2 === 0,
    };
    await prisma.petProfile.upsert({
      where: { productId: p.id },
      update: profile,
      create: profile,
    });
    console.log(`  + ${p.title} → ${profile.petType} (${profile.breed})`);
  }

  const total = await prisma.petProfile.count({ where: { shop } });
  console.log(`\nDone! ${total} pet profiles created.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

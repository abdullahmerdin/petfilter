import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const shop = process.env.SHOP || process.argv[2] || "paws-for-good-2.myshopify.com";

const rules = [
  {
    name: "Small Apartment Dogs",
    description: "Perfect for apartment living — small, low-energy dogs",
    petType: "dog",
    sizeFilter: "small",
    temperamentFilter: "calm",
    weightMin: 2,
    weightMax: 12,
    isActive: true,
    priority: 1,
  },
  {
    name: "Active Outdoor Dogs",
    description: "Dogs that love hiking, running, and outdoor adventures",
    petType: "dog",
    sizeFilter: "large",
    temperamentFilter: "energetic",
    weightMin: 15,
    isActive: true,
    priority: 2,
  },
  {
    name: "Family Friendly Cats",
    description: "Gentle cats good with children and other pets",
    petType: "cat",
    temperamentFilter: "friendly",
    vaccinated: true,
    isActive: true,
    priority: 3,
  },
  {
    name: "Senior Lap Cats",
    description: "Calm senior cats looking for a quiet home",
    petType: "cat",
    ageFilter: "senior",
    temperamentFilter: "calm",
    isActive: true,
    priority: 4,
  },
  {
    name: "Starter Birds",
    description: "Beginner-friendly birds for first-time owners",
    petType: "bird",
    sizeFilter: "small",
    isActive: true,
    priority: 5,
  },
  {
    name: "Low Maintenance Fish",
    description: "Hardy fish species for easy aquarium setups",
    petType: "fish",
    temperamentFilter: "calm",
    isActive: true,
    priority: 6,
  },
  {
    name: "Hypoallergenic Pets",
    description: "Pets suitable for allergy sufferers",
    petType: "dog",
    breedFilter: "poodle",
    isActive: true,
    priority: 7,
  },
  {
    name: "Puppy Playmates",
    description: "Energetic puppies that need a playmate",
    petType: "dog",
    ageFilter: "baby",
    temperamentFilter: "energetic",
    isActive: true,
    priority: 8,
  },
  {
    name: "Small Pet Starter",
    description: "Easy-care small pets for beginners",
    petType: "small_pet",
    sizeFilter: "small",
    isActive: true,
    priority: 9,
  },
  {
    name: "Inactive: Old Dogs",
    description: "Draft rule for senior dogs (currently disabled)",
    petType: "dog",
    ageFilter: "senior",
    isActive: false,
    priority: 10,
  },
];

async function seed() {
  console.log("Seeding filter rules...");
  for (const rule of rules) {
    const existing = await prisma.filterRule.findFirst({
      where: { shop, name: rule.name },
    });
    if (!existing) {
      await prisma.filterRule.create({ data: { ...rule, shop } });
      console.log(`  + ${rule.name}`);
    } else {
      console.log(`  = ${rule.name} (exists)`);
    }
  }

  // Try to fetch real products from Shopify and create profiles
  console.log("\nChecking for existing pet profiles...");
  const existingProfiles = await prisma.petProfile.count({ where: { shop } });
  console.log(`  ${existingProfiles} existing profiles`);

  if (existingProfiles === 0) {
    // Use placeholder profiles based on common Shopify product IDs
    // These will be linked when products are fetched from the store
    console.log("\nNo existing profiles found. Use the Products page to add profiles to products.");
    console.log("You can also install the app on the store and sync products first.");
  }

  const rulesCount = await prisma.filterRule.count({ where: { shop } });
  console.log(`\nDone! ${rulesCount} filter rules ready.`);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

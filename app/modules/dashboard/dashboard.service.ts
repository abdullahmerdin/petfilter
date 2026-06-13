import prisma from "../../db.server";

export async function getDashboardStats(shop: string) {
  const [totalPets, totalRules, activeRules] = await Promise.all([
    prisma.petProfile.count({ where: { shop } }),
    prisma.filterRule.count({ where: { shop } }),
    prisma.filterRule.count({ where: { shop, isActive: true } }),
  ]);
  const settings = await prisma.shopSettings.findUnique({ where: { shop } });
  // totalMatches: we track from the matching log when that's built — for now 0
  return { totalPets, totalRules, activeRules, totalMatches: 0, settings };
}

export async function getRecentPets(shop: string, limit = 5) {
  return prisma.petProfile.findMany({ where: { shop }, orderBy: { createdAt: "desc" }, take: limit });
}

export async function getRecentRules(shop: string, limit = 5) {
  return prisma.filterRule.findMany({ where: { shop }, orderBy: { updatedAt: "desc" }, take: limit });
}

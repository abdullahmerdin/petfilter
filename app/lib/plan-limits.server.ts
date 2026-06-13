import prisma from "../db.server";
import { FREE_PET_LIMIT, FREE_RULE_LIMIT } from "./plan-limits";
import type { PlanTier } from "./plan-limits";

export async function getPlanTier(shop: string): Promise<PlanTier> {
  const settings = await prisma.shopSettings.findUnique({ where: { shop } });
  if (!settings) return "free";
  if (settings.billingPlan === "pro") return "pro";

  if (settings.billingPlan === "trial" && settings.trialEndsAt) {
    if (settings.trialEndsAt.getTime() > Date.now()) return "trial";
    return "free";
  }

  return "free";
}

export async function canCreatePetProfile(shop: string): Promise<{ allowed: boolean; current: number; limit: number }> {
  const tier = await getPlanTier(shop);
  if (tier === "pro") return { allowed: true, current: 0, limit: Infinity };

  const count = await prisma.petProfile.count({ where: { shop } });
  return { allowed: count < FREE_PET_LIMIT, current: count, limit: FREE_PET_LIMIT };
}

export async function canCreateFilterRule(shop: string): Promise<{ allowed: boolean; current: number; limit: number }> {
  const tier = await getPlanTier(shop);
  if (tier === "pro") return { allowed: true, current: 0, limit: Infinity };

  const count = await prisma.filterRule.count({ where: { shop } });
  return { allowed: count < FREE_RULE_LIMIT, current: count, limit: FREE_RULE_LIMIT };
}

export async function getPlanLimits(shop: string): Promise<{
  tier: PlanTier;
  pets: { current: number; limit: number };
  rules: { current: number; limit: number };
}> {
  const tier = await getPlanTier(shop);
  const [petsCount, rulesCount] = await Promise.all([
    prisma.petProfile.count({ where: { shop } }),
    prisma.filterRule.count({ where: { shop } }),
  ]);

  return {
    tier,
    pets: {
      current: petsCount,
      limit: tier === "pro" ? Infinity : FREE_PET_LIMIT,
    },
    rules: {
      current: rulesCount,
      limit: tier === "pro" ? Infinity : FREE_RULE_LIMIT,
    },
  };
}

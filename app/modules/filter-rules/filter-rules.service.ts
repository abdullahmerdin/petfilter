import prisma from "../../db.server";
import type { FilterRule } from "@prisma/client";
import { canCreateFilterRule } from "../../lib/plan-limits.server";

export async function listRules(shop: string) {
  return prisma.filterRule.findMany({ where: { shop }, orderBy: { priority: "asc" } });
}

export async function listRulesPaginated(shop: string, skip = 0, take = 20) {
  const [rules, total] = await Promise.all([
    prisma.filterRule.findMany({ where: { shop }, orderBy: { priority: "asc" }, skip, take: take + 1 }),
    prisma.filterRule.count({ where: { shop } }),
  ]);
  const hasNext = rules.length > take;
  return { rules: rules.slice(0, take), total, hasNext, skip };
}

export async function getRule(shop: string, id: string) {
  return prisma.filterRule.findUnique({ where: { id } });
}

export async function createRule(shop: string, data: Partial<FilterRule>) {
  const limitCheck = await canCreateFilterRule(shop);
  if (!limitCheck.allowed) {
    throw new Error(`LIMIT_REACHED:Filter rules (${limitCheck.current}/${limitCheck.limit}). Upgrade to Pro for unlimited.`);
  }
  return prisma.filterRule.create({ data: { ...data, shop } });
}

export async function updateRule(shop: string, id: string, data: Partial<FilterRule>) {
  return prisma.filterRule.update({ where: { id }, data });
}

export async function deleteRule(shop: string, id: string) {
  return prisma.filterRule.delete({ where: { id } });
}

export async function batchUpdateRules(shop: string, rules: Array<{ id: string; data: any }>) {
  const results = [];
  for (const rule of rules) {
    results.push(await prisma.filterRule.update({ where: { id: rule.id }, data: rule.data }));
  }
  return results;
}

export async function batchDeleteRules(shop: string, ids: string[]) {
  return prisma.filterRule.deleteMany({ where: { shop, id: { in: ids } } });
}

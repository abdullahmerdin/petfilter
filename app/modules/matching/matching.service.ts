import prisma from "../../db.server";
import { findCompatiblePets } from "./matching";

// === GET COMPATIBLE PETS WITH RULE ===
export async function getCompatiblePetsWithRule(shop: string, ruleId: string, minScore = 10) {
  const rule = await prisma.filterRule.findUnique({ where: { id: ruleId } });
  if (!rule) throw new Error("Rule not found");
  const pets = await prisma.petProfile.findMany({ where: { shop } });
  return findCompatiblePets(pets, rule, minScore);
}

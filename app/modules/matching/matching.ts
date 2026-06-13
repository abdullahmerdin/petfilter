import type { PetProfile, FilterRule } from "@prisma/client";

export interface MatchResult {
  profile: PetProfile; score: number; matchedCriteria: string[];
}

const CRITERION_LABELS: Record<string, string> = {
  pet_type: "Pet Type",
  breed: "Breed",
  size: "Size",
  age: "Age Group",
  diet: "Diet",
  temperament: "Temperament",
  color: "Color",
  weight_min: "Min Weight",
  weight_max: "Max Weight",
  vaccinated: "Vaccinated",
  neutered: "Neutered",
};

// === EVALUATE PET AGAINST RULE ===
export function evaluatePetAgainstRule(pet: PetProfile, rule: FilterRule): MatchResult {
  const matchedCriteria: string[] = [];
  let score = 0;
  if (rule.petType && pet.petType === rule.petType) { score += 1; matchedCriteria.push("pet_type"); }
  if (rule.breedFilter && pet.breed?.toLowerCase().includes(rule.breedFilter.toLowerCase())) { score += 1; matchedCriteria.push("breed"); }
  if (rule.sizeFilter && pet.size === rule.sizeFilter) { score += 1; matchedCriteria.push("size"); }
  if (rule.ageFilter && pet.ageGroup === rule.ageFilter) { score += 1; matchedCriteria.push("age"); }
  if (rule.dietFilter && pet.dietaryNeeds?.toLowerCase().includes(rule.dietFilter.toLowerCase())) { score += 1; matchedCriteria.push("diet"); }
  if (rule.temperamentFilter && pet.temperament === rule.temperamentFilter) { score += 1; matchedCriteria.push("temperament"); }
  if (rule.colorFilter && pet.color === rule.colorFilter) { score += 1; matchedCriteria.push("color"); }
  if (rule.weightMin != null && pet.weight) { const w = parseFloat(pet.weight); if (!isNaN(w) && w >= rule.weightMin) { score += 1; matchedCriteria.push("weight_min"); } }
  if (rule.weightMax != null && pet.weight) { const w = parseFloat(pet.weight); if (!isNaN(w) && w <= rule.weightMax) { score += 1; matchedCriteria.push("weight_max"); } }
  if (rule.vaccinated != null && pet.vaccinated === rule.vaccinated) { score += 1; matchedCriteria.push("vaccinated"); }
  if (rule.neutered != null && pet.neutered === rule.neutered) { score += 1; matchedCriteria.push("neutered"); }
  const cleanCriteria = matchedCriteria.map(k => CRITERION_LABELS[k] || k);
  return { profile: pet, score, matchedCriteria: cleanCriteria };
}

// === FIND COMPATIBLE PETS ===
export function findCompatiblePets(pets: PetProfile[], rule: FilterRule, minScore = 1): MatchResult[] {
  return pets.map(p => evaluatePetAgainstRule(p, rule)).filter(r => r.score >= minScore).sort((a, b) => b.score - a.score);
}

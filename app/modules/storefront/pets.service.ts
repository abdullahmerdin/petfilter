import prisma from "../../db.server";

export interface PetInput {
  name: string;
  petType: string;
  breed?: string;
  age?: string;
  weight?: string;
  color?: string;
  vaccinated?: boolean;
  neutered?: boolean;
  setActive?: boolean;
}

export async function getCustomerPets(shop: string, customerId: string) {
  return prisma.customerPet.findMany({
    where: { shop, customerId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getActivePet(shop: string, customerId: string) {
  return prisma.customerPet.findFirst({
    where: { shop, customerId, isActive: true },
  });
}

export async function createPet(shop: string, customerId: string, input: PetInput) {
  const { setActive, ...data } = input;

  // If setting as active, deactivate others first
  if (setActive) {
    await prisma.customerPet.updateMany({
      where: { shop, customerId, isActive: true },
      data: { isActive: false },
    });
  }

  // Check if this is the first pet -> auto-make active
  const existingCount = await prisma.customerPet.count({
    where: { shop, customerId },
  });

  return prisma.customerPet.create({
    data: {
      shop,
      customerId,
      ...data,
      isActive: existingCount === 0 ? true : (setActive ?? false),
    },
  });
}

export async function updatePet(shop: string, customerId: string, petId: string, input: Partial<PetInput>) {
  const { setActive, ...data } = input;

  if (setActive) {
    await prisma.customerPet.updateMany({
      where: { shop, customerId, isActive: true },
      data: { isActive: false },
    });
  }

  return prisma.customerPet.update({
    where: { id: petId },
    data: {
      ...data,
      ...(setActive !== undefined ? { isActive: setActive } : {}),
    },
  });
}

export async function deletePet(shop: string, customerId: string, petId: string) {
  const pet = await prisma.customerPet.findFirst({
    where: { id: petId, shop, customerId },
  });
  if (!pet) return null;

  await prisma.customerPet.delete({ where: { id: petId } });

  // If deleted pet was active, set another as active
  if (pet.isActive) {
    const nextPet = await prisma.customerPet.findFirst({
      where: { shop, customerId },
      orderBy: { createdAt: "desc" },
    });
    if (nextPet) {
      await prisma.customerPet.update({
        where: { id: nextPet.id },
        data: { isActive: true },
      });
    }
  }

  return pet;
}

export async function setActivePet(shop: string, customerId: string, petId: string) {
  await prisma.customerPet.updateMany({
    where: { shop, customerId, isActive: true },
    data: { isActive: false },
  });

  return prisma.customerPet.update({
    where: { id: petId },
    data: { isActive: true },
  });
}

// User Agreement

export async function hasAgreed(shop: string, customerId: string) {
  const agreement = await prisma.customerAgreement.findUnique({
    where: { shop_customerId: { shop, customerId } },
  });
  return !!agreement;
}

export async function agreeToTerms(shop: string, customerId: string) {
  const existing = await prisma.customerAgreement.findUnique({
    where: { shop_customerId: { shop, customerId } },
  });
  if (existing) return existing;

  return prisma.customerAgreement.create({
    data: { shop, customerId },
  });
}

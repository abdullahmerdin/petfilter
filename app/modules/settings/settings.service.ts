import prisma from "../../db.server";

export async function getSettings(shop: string) {
  let settings = await prisma.shopSettings.findUnique({ where: { shop } });
  if (!settings) settings = await prisma.shopSettings.create({ data: { shop } });
  return settings;
}

export async function updateSettings(shop: string, data: any) {
  return prisma.shopSettings.upsert({ where: { shop }, update: data, create: { shop, ...data } });
}

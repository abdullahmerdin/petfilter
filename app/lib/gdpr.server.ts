import prisma from "../db.server";

export async function handleDataRequest(shop: string, customerId?: string, email?: string, phone?: string) {
  await prisma.gdprRequest.create({
    data: { shop, customerId, email, phone, topic: "customers/data_request", payload: JSON.stringify({}) },
  });
}

export async function handleCustomerRedact(shop: string, customerId?: string, email?: string, phone?: string) {
  await prisma.gdprRequest.create({
    data: { shop, customerId, email, phone, topic: "customers/redact", payload: JSON.stringify({}) },
  });
}

export async function handleShopRedact(shop: string) {
  await prisma.gdprRequest.create({
    data: { shop, topic: "shop/redact", payload: JSON.stringify({}) },
  });
  await prisma.shopSettings.deleteMany({ where: { shop } });
}

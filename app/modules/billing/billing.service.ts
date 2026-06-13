import type { AdminApiContext } from "@shopify/shopify-app-react-router/server";
import prisma from "../../db.server";
import { getThrottledGraphQLClient, getCostProfiler } from "../../lib";
import { getResponseCache, CacheTier, CacheKeys } from "../../lib/response-cache";

const gql = getThrottledGraphQLClient();
const profiler = getCostProfiler();
const cache = getResponseCache();

const TRIAL_DAYS = 14;

// In-memory pending charge store (dev only — single instance)
const pendingCharges = new Map<string, { shop: string; chargeId: string; timestamp: number }>();

export async function getBillingUrl(admin: AdminApiContext, shop: string, origin?: string) {
  const returnUrl = `${origin || process.env.SHOPIFY_APP_URL}/app/billing/callback`;
  const { json: rawJson, cost } = await gql.mutate<{
    data: {
      appPurchaseOneTimeCreate: {
        appPurchaseOneTime: { id: string; name: string; price: { amount: string; currencyCode: string } } | null;
        confirmationUrl: string;
        userErrors: Array<{ field: string; message: string }>;
      };
    };
  }>(admin, `#graphql
    mutation CreateBilling($name: String!, $price: MoneyInput!, $returnUrl: URL!, $test: Boolean) {
      appPurchaseOneTimeCreate(name: $name, price: $price, returnUrl: $returnUrl, test: $test) {
        appPurchaseOneTime { id name price { amount currencyCode } }
        confirmationUrl
        userErrors { field message }
      }
    }`, {
    name: "PetFilter Pro",
    price: { amount: 9.99, currencyCode: "USD" },
    returnUrl,
    test: true,
  });

  if (cost) {
    profiler.record("CreateBilling", cost.requestedQueryCost, cost.actualQueryCost, shop);
  }

  const result = rawJson?.data?.appPurchaseOneTimeCreate;
  if (result?.userErrors?.length) {
    console.error("[Billing] userErrors:", JSON.stringify(result.userErrors));
  }

  // Store pending charge so callback can look up shop by charge_id
  if (result?.appPurchaseOneTime?.id) {
    const chargeId = result.appPurchaseOneTime.id.split("/").pop();
    if (chargeId) {
      pendingCharges.set(chargeId, { shop, chargeId, timestamp: Date.now() });
      setTimeout(() => pendingCharges.delete(chargeId), 30 * 60 * 1000); // cleanup after 30min
      console.log("[Billing] Stored pending charge:", { shop, chargeId });
    }
  }

  console.log("[Billing] confirmationUrl:", result?.confirmationUrl, "appPurchaseOneTime:", result?.appPurchaseOneTime?.id);

  return result?.confirmationUrl || null;
}

// Look up shop from pending charge — used by callback when shop param is missing
export function getPendingShop(chargeId: string): string | undefined {
  const entry = pendingCharges.get(chargeId);
  return entry?.shop;
}

export async function checkSubscription(shop: string) {
  return cache.getOrCompute(
    CacheKeys.shopSettings(shop),
    async () => {
      const settings = await prisma.shopSettings.findUnique({ where: { shop } });
      if (!settings) return { isTrialing: false, isSubscribed: false, daysLeft: 0 };
      if (settings.billingPlan === "pro" && settings.subscriptionId) {
        return { isTrialing: false, isSubscribed: true, daysLeft: null };
      }
      if (settings.trialEndsAt) {
        const daysLeft = Math.max(0, Math.ceil((settings.trialEndsAt.getTime() - Date.now()) / 86400000));
        return { isTrialing: true, isSubscribed: false, daysLeft };
      }
      return { isTrialing: false, isSubscribed: false, daysLeft: 0 };
    },
    CacheTier.LONG,
    { revalidate: true },
  );
}

export async function startTrial(shop: string) {
  const trialEndsAt = new Date(Date.now() + TRIAL_DAYS * 86400000);
  await prisma.shopSettings.upsert({
    where: { shop },
    update: { trialEndsAt, billingPlan: "trial" },
    create: { shop, trialEndsAt, billingPlan: "trial" },
  });
  // Invalidate cached subscription
  cache.invalidate(CacheKeys.shopSettings(shop));
}

export async function activatePro(shop: string, subscriptionId: string) {
  await prisma.shopSettings.upsert({
    where: { shop },
    update: { billingPlan: "pro", subscriptionId, trialEndsAt: null },
    create: { shop, billingPlan: "pro", subscriptionId },
  });
  // Invalidate cached subscription
  cache.invalidate(CacheKeys.shopSettings(shop));
}

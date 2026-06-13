import crypto from "crypto";
import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { unauthenticated } from "../shopify.server";
import { activatePro, getPendingShop } from "../modules/billing";
import { getCostProfiler } from "../lib";

function getStoreSlug(shop: string): string {
  return shop.replace(/\.myshopify\.com$/, "");
}

function adminUrl(shop: string, path: string): string {
  return `https://admin.shopify.com/store/${getStoreSlug(shop)}/apps/petfilter${path}`;
}

function verifyHmac(params: URLSearchParams, secret: string): boolean {
  const hmac = params.get("hmac");
  if (!hmac) return false;

  const sorted = Array.from(params.entries())
    .filter(([k]) => k !== "hmac" && k !== "sign")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  const expected = crypto
    .createHmac("sha256", secret)
    .update(sorted)
    .digest("hex");

  // Length mismatch short-circuit before timingSafeEqual
  if (expected.length !== hmac.length) {
    console.error("[billing-callback] HMAC length mismatch");
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(hmac));
}

function normalizeChargeId(chargeId: string): string {
  if (chargeId.startsWith("gid://")) return chargeId;
  return `gid://shopify/AppPurchaseOneTime/${chargeId}`;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const tStart = Date.now();
  const url = new URL(request.url);
  const params = url.searchParams;

  const chargeId = params.get("charge_id");
  let shop = params.get("shop");
  console.log("[billing-callback] Full params:", Object.fromEntries(params.entries()));

  // If shop missing, look up from pending store
  if (!shop && chargeId) {
    shop = getPendingShop(chargeId) || null;
    console.log("[billing-callback] Resolved shop from pending:", shop);
  }

  // === PHASE 1: Basic param validation (~0ms) ===
  if (!chargeId || !shop) {
    console.error("[billing-callback] Missing required params", { chargeId: !!chargeId, shop: !!shop });
    const errUrl = shop ? adminUrl(shop, `/app/billing?error=missing_params`) : "/app/billing?error=missing_params";
    return redirect(errUrl);
  }

  // === PHASE 2: HMAC verification (~1ms) ===
  // Skip HMAC for old-style ApplicationCharge redirects (charge_id only, no hmac param)
  const hasHmac = params.has("hmac");
  const secret = process.env.SHOPIFY_API_SECRET || "";
  if (hasHmac && !verifyHmac(params, secret)) {
    console.error("[billing-callback] HMAC verification failed", { shop, chargeId });
    const errUrl = adminUrl(shop, "/app/billing?error=hmac_invalid");
    return redirect(errUrl);
  }
  if (!hasHmac) {
    console.log("[billing-callback] Skipping HMAC (old-style ApplicationCharge, no hmac param)");
  }
  const tHmac = Date.now();

  // === PHASE 3: Unauthenticated admin session + GraphQL (< 500ms) ===
  let admin;
  try {
    const ctx = await unauthenticated.admin(shop);
    admin = ctx.admin;
  } catch (sessionErr) {
    console.error("[billing-callback] Session init failed", { shop, chargeId, error: String(sessionErr) });
    return redirect("/app/billing?error=session_failed");
  }
  const gid = normalizeChargeId(chargeId);
  const tAdmin = Date.now();

  let json: any;
  try {
    const response = await admin.graphql(`#graphql
      query VerifyPurchase($id: ID!) {
        node(id: $id) {
          ... on AppPurchaseOneTime {
            id
            status
            name
          }
        }
      }`, {
      variables: { id: gid },
    });
    const text = await response.text();
    json = JSON.parse(text);
  } catch (gqlErr) {
    console.error("[billing-callback] GraphQL request failed", { shop, chargeId, gid, error: String(gqlErr) });
    return redirect("/app/billing?error=graphql_failed");
  }
  const tGraphql = Date.now();

  // Check for GraphQL response errors (e.g. access denied, invalid ID format)
  if (json.errors) {
    const messages = (json.errors as Array<{ message: string }>).map((e) => e.message).join("; ");
    console.error("[billing-callback] GraphQL response errors", { shop, chargeId, gid, errors: messages });
    return redirect("/app/billing?error=graphql_error");
  }

  const cost = json?.extensions?.cost as {
    requestedQueryCost: number;
    actualQueryCost: number | null;
    throttleStatus: { maximumAvailable: number; currentlyAvailable: number; restoreRate: number };
  } | undefined;

  // Record cost profile
  if (cost) {
    const profiler = getCostProfiler();
    profiler.record("VerifyPurchase(callback)", cost.requestedQueryCost, cost.actualQueryCost, shop);
  }

  const purchase = json.data?.node as { id: string; status: string; name: string } | null;

  if (!purchase) {
    console.error("[billing-callback] Purchase not found", { shop, chargeId, gid });
    return redirect("/app/billing?error=purchase_not_found");
  }

  if (purchase.status !== "ACTIVE") {
    console.error("[billing-callback] Purchase not active", { shop, chargeId, status: purchase.status });
    return redirect(`/app/billing?error=purchase_${purchase.status.toLowerCase()}`);
  }

  // === PHASE 4: Activate Pro plan (DB write, < 50ms) ===
  try {
    await activatePro(shop, chargeId);
  } catch (dbErr) {
    console.error("[billing-callback] DB activation failed", { shop, chargeId, error: String(dbErr) });
    return redirect("/app/billing?error=activation_failed");
  }
  const tEnd = Date.now();

  // Profile report
  console.log("[billing-callback] Latency profile", {
    shop,
    chargeId,
    total: tEnd - tStart,
    hmacVerify: tHmac - tStart,
    sessionInit: tAdmin - tHmac,
    graphqlQuery: tGraphql - tAdmin,
    dbWrite: tEnd - tGraphql,
    graphqlCost: cost
      ? `${cost.actualQueryCost ?? cost.requestedQueryCost}pts (${cost.throttleStatus.currentlyAvailable}/${cost.throttleStatus.maximumAvailable} avail)`
      : "unknown",
  });

  // Admin URL'sine redirect — embedded app içinde kalmak için
  return redirect(adminUrl(shop, "/app/billing?success=pro_activated"));
};

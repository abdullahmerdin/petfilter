import type { LoaderFunctionArgs } from "react-router";
import { authenticate, unauthenticated } from "../shopify.server";
import { getBestMatchesData } from "../modules/storefront/index";

// Rate limiter: simple in-memory sliding window per shop
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 30;        // requests per window
const RATE_LIMIT_WINDOW = 60_000; // 1 minute

function checkRateLimit(shop: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(shop);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(shop, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT_MAX;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.public.appProxy(request);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit check
  if (!checkRateLimit(session.shop)) {
    return Response.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const url = new URL(request.url);
  const productId = url.searchParams.get("productId") ?? url.searchParams.get("id");

  if (!productId) {
    return Response.json({ error: "Missing productId" }, { status: 400 });
  }

  // Create an unauthenticated admin context for Shopify GraphQL queries
  let admin;
  try {
    const ctx = await unauthenticated.admin(session.shop);
    admin = ctx.admin;
  } catch {
    return Response.json({ error: "Session not found" }, { status: 401 });
  }

  const data = await getBestMatchesData(session.shop, productId, admin);

  // Common cache headers for proxy responses
  const cacheHeaders: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, max-age=120, stale-while-revalidate=300",
    "Vary": "Origin",
  };

  // 204: badge disabled, pet not found, or no compatible pets
  if (!data) {
    return new Response(null, { status: 204, headers: cacheHeaders });
  }

  return Response.json(data, {
    status: 200,
    headers: cacheHeaders,
  });
};

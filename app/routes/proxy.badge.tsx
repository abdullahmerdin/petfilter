import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { getStorefrontBadgeData } from "../modules/storefront/index";
import { getPetEmoji } from "../shared/pet-emojis";
import { getResponseCache, CacheTier, CacheKeys } from "../lib/response-cache";

const cache = getResponseCache();

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.public.appProxy(request);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const productId = url.searchParams.get("productId") ?? url.searchParams.get("id");

  if (!productId) {
    return new Response("Missing productId", { status: 400 });
  }

  const data = await cache.getOrCompute(
    CacheKeys.badgeData(session.shop, productId),
    () => getStorefrontBadgeData(session.shop, productId),
    CacheTier.MEDIUM,
    { revalidate: true },
  );

  if (!data) {
    return new Response(null, { status: 204 });
  }

  const emoji = getPetEmoji(data.petType);
  const escapedBadgeText = data.badgeText.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/&/g, "&amp;");
  const html = `<span style="display:inline-flex;align-items:center;gap:4px;padding:2px 10px;border-radius:9999px;font-size:13px;font-weight:600;line-height:1.6;color:#fff;background:${data.badgeColor}">${emoji} ${escapedBadgeText}</span>`;

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
};

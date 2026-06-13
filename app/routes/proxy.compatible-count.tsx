import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { getCompatibleBadgeData } from "../modules/storefront/index";
import { getResponseCache, CacheTier, CacheKeys } from "../lib/response-cache";

const cache = getResponseCache();

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.public.appProxy(request);

  if (!session) {
    return Response.json({ compatibleCount: 0, buttonLabel: "" }, { status: 401 });
  }

  const url = new URL(request.url);
  const productId = url.searchParams.get("productId") ?? url.searchParams.get("id");

  if (!productId) {
    return Response.json({ compatibleCount: 0, buttonLabel: "" }, { status: 400 });
  }

  const data = await cache.getOrCompute(
    CacheKeys.compatibleBadge(session.shop, productId),
    () => getCompatibleBadgeData(session.shop, productId),
    CacheTier.MEDIUM,
    { revalidate: true },
  );

  if (!data) {
    return Response.json({ compatibleCount: 0, buttonLabel: "" }, { status: 200 });
  }

  return Response.json(
    { compatibleCount: data.compatibleCount, buttonLabel: data.buttonLabel },
    { status: 200 },
  );
};

import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { handleDataRequest, handleCustomerRedact, handleShopRedact } from "../lib/gdpr.server";
import { validateWebhookRequest } from "../utils/webhook-validate.server";
import { WebhookProfiler } from "../utils/webhook-profiler.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const profiler = new WebhookProfiler("gdpr", { topic: "mixed" });

  // Defense-in-depth: HMAC validation BEFORE SDK authenticate.webhook()
  const hmacError = await validateWebhookRequest(request, profiler);
  if (hmacError) return hmacError;

  profiler.mark("authenticate");
  const { shop, topic, payload } = await authenticate.webhook(request);

  const data = payload as any;
  profiler.mark("handler");
  if (topic === "customers/data_request") await handleDataRequest(shop, data?.customer_id?.toString(), data?.email, data?.phone);
  else if (topic === "customers/redact") await handleCustomerRedact(shop, data?.customer_id?.toString(), data?.email, data?.phone);
  else if (topic === "shop/redact") await handleShopRedact(shop);

  profiler.mark("done");
  profiler.report();
  return new Response();
};

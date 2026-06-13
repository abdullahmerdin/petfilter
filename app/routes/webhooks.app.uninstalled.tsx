import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { validateWebhookRequest } from "../utils/webhook-validate.server";
import { WebhookProfiler } from "../utils/webhook-profiler.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const profiler = new WebhookProfiler("uninstalled");

  // Defense-in-depth: HMAC validation BEFORE SDK authenticate.webhook()
  const hmacError = await validateWebhookRequest(request, profiler);
  if (hmacError) return hmacError;

  profiler.mark("authenticate");
  const { shop, session, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  profiler.mark("handler");
  // Webhook requests can trigger multiple times and after an app has already been uninstalled.
  // If this webhook already ran, the session may have been deleted previously.
  if (session) {
    await db.session.deleteMany({ where: { shop } });
  }

  profiler.mark("done");
  profiler.report();
  return new Response();
};

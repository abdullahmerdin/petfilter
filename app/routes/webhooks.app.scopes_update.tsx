import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { validateWebhookRequest } from "../utils/webhook-validate.server";
import { WebhookProfiler } from "../utils/webhook-profiler.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const profiler = new WebhookProfiler("scopes_update");

  // Defense-in-depth: HMAC validation BEFORE SDK authenticate.webhook()
  const hmacError = await validateWebhookRequest(request, profiler);
  if (hmacError) return hmacError;

  profiler.mark("authenticate");
  const { payload, session, topic, shop } = await authenticate.webhook(request);
  console.log(`Received ${topic} webhook for ${shop}`);

  profiler.mark("handler");
  const current = payload.current as string[];
  if (session) {
    await db.session.update({
      where: {
        id: session.id,
      },
      data: {
        scope: current.toString(),
      },
    });
  }

  profiler.mark("done");
  profiler.report();
  return new Response();
};

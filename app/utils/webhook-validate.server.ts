import type { ActionFunctionArgs } from "react-router";
import { WebhookSignatureValidator } from "./WebhookSignatureValidator";
import { WebhookProfiler } from "./webhook-profiler.server";

/**
 * Per-route webhook HMAC validation helper.
 *
 * Call at the top of any webhook action handler BEFORE authenticate.webhook():
 *
 *   const hmacError = await validateWebhookRequest(request);
 *   if (hmacError) return hmacError;
 *   const { shop, topic, payload } = await authenticate.webhook(request);
 *
 * @returns null if valid, or a 401 Response if invalid
 */
export async function validateWebhookRequest(
  request: ActionFunctionArgs["request"],
  profiler?: WebhookProfiler,
): Promise<Response | null> {
  // Clone the request so we can read the raw body without consuming the original
  const rawBody = await request.clone().text();

  if (profiler) profiler.mark("validate-hmac");

  if (!WebhookSignatureValidator.verify(rawBody, request.headers)) {
    return new Response("Unauthorized", {
      status: 401,
      statusText: "HMAC signature verification failed",
    });
  }

  return null;
}

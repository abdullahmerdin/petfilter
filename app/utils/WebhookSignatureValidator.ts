import * as crypto from "crypto";
import { webhookValidationCache } from "./webhook-profiler.server";

const HMAC_HEADER = "x-shopify-hmac-sha256";

// SHA-256 HMAC in base64 is always 44 characters
const EXPECTED_HMAC_LENGTH = 44 as const;

/**
 * Validates Shopify webhook HMAC signatures using timing-safe comparison.
 *
 * Defense-in-depth: runs BEFORE the Shopify SDK's authenticate.webhook()
 * to catch invalid signatures early with a clear audit trail.
 *
 * Performance:
 *   - Uses Node.js native crypto.createHmac() (sync, C++ binding) which is
 *     faster than the SDK's Web Crypto API (async, SubtleCrypto).
 *   - Caches validation results per HMAC header value so that Shopify retries
 *     (identical body + HMAC) skip recomputation.
 *   - Length-mismatch short-circuit avoids timingSafeEqual on clearly invalid
 *     signatures (HMAC length is fixed at 44 chars for SHA-256 base64).
 *
 * Usage:
 *   const rawBody = await request.clone().text();
 *   if (!WebhookSignatureValidator.verify(rawBody, request.headers)) {
 *     return new Response("Unauthorized", { status: 401 });
 *   }
 */
export class WebhookSignatureValidator {
  /**
   * Verify the HMAC-SHA256 signature on a Shopify webhook request.
   *
   * @param rawBody - The raw request body as a string (get from request.clone().text())
   * @param headers - The request headers (Request.headers or a Headers instance)
   * @param apiSecret - The Shopify API secret key (defaults to SHOPIFY_API_SECRET env var)
   * @returns true if the signature is valid, false otherwise
   */
  static verify(
    rawBody: string,
    headers: Headers,
    apiSecret: string = process.env.SHOPIFY_API_SECRET || "",
  ): boolean {
    // ── Guard: no secret configured ──────────────────────────────────────
    if (!apiSecret) {
      console.error("[HMAC FAIL] SHOPIFY_API_SECRET is not configured");
      return false;
    }

    // ── Guard: missing HMAC header ───────────────────────────────────────
    const providedHmac = headers.get(HMAC_HEADER);
    if (!providedHmac) {
      console.error("[HMAC FAIL] Missing X-Shopify-Hmac-SHA256 header");
      return false;
    }

    // ── Cache check: avoid recomputation on Shopify retries ──────────────
    const cacheKey = providedHmac;
    const cached = webhookValidationCache.get(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    // ── Compute expected HMAC-SHA256 of the raw body ─────────────────────
    const computedHmac = crypto
      .createHmac("sha256", apiSecret)
      .update(rawBody, "utf8")
      .digest("base64");

    // ── Length-mismatch short-circuit ─────────────────────────────────────
    // This is a very minor timing leak (attacker learns HMAC length), but
    // SHA-256 base64 HMACs are always 44 characters, so no useful
    // information is revealed. This optimization avoids unnecessary work
    // on clearly invalid signatures.
    if (computedHmac.length !== providedHmac.length) {
      console.error(
        `[HMAC FAIL] Length mismatch: expected ${computedHmac.length}, got ${providedHmac.length}`,
      );
      webhookValidationCache.set(cacheKey, false);
      return false;
    }

    // ── Timing-safe comparison ───────────────────────────────────────────
    // crypto.timingSafeEqual is a native C++ implementation that does a
    // constant-time comparison. Both buffers MUST be the same length
    // (guaranteed by the check above).
    const isValid = crypto.timingSafeEqual(
      Buffer.from(computedHmac, "utf8"),
      Buffer.from(providedHmac, "utf8"),
    );

    if (!isValid) {
      console.error("[HMAC FAIL] Signature mismatch");
    }

    // Cache both valid and invalid results so retries are instant
    webhookValidationCache.set(cacheKey, isValid);

    return isValid;
  }
}

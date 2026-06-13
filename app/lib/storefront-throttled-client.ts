// === STOREFRONT THROTTLED GRAPHQL CLIENT ===
// Wraps the Shopify Storefront API with leaky-bucket throttling.
// Storefront API rate limits differ from Admin API:
//   - Leaky bucket: 50 pts/sec restore rate
//   - Burst capacity: 200 points
//   - Max query cost: 200 points (enforced by API)
//
// See: https://shopify.dev/docs/storefront-api/guides/rate-limits

const STOREFRONT_MAX_BURST = 200;
const STOREFRONT_RESTORE_RATE = 50; // points per second
const STOREFRONT_SAFETY_THRESHOLD = 50; // 25% of burst cap — cushion before throttle

interface BucketState {
  current: number;
  max: number;
  restoreRate: number;
  lastRefillMs: number;
}

interface StorefrontCostInfo {
  requestedQueryCost: number;
  actualQueryCost: number | null;
  throttleStatus: {
    maximumAvailable: number;
    currentlyAvailable: number;
    restoreRate: number;
  };
}

export interface StorefrontThrottledClientConfig {
  safetyThreshold?: number;
  enableLogging?: boolean;
}

export class StorefrontThrottledClient {
  private buckets: Map<string, BucketState> = new Map();
  private safetyThreshold: number;
  private enableLogging: boolean;

  constructor(config: StorefrontThrottledClientConfig = {}) {
    this.safetyThreshold = config.safetyThreshold ?? STOREFRONT_SAFETY_THRESHOLD;
    this.enableLogging = config.enableLogging ?? process.env.NODE_ENV !== "production";
  }

  /**
   * Execute a Storefront GraphQL query with leaky-bucket throttle awareness.
   * Uses Shopify's Storefront API v2026-04 endpoint.
   */
  async query<T = any>(
    shop: string,
    storefrontAccessToken: string,
    query: string,
    variables?: Record<string, any>,
  ): Promise<{ data: T; cost: StorefrontCostInfo | null }> {
    const bucket = this.getOrInitBucket(shop);
    await this.waitForCapacity(bucket);

    const startTime = Date.now();
    const response = await fetch(
      `https://${shop}/api/2026-04/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
        },
        body: JSON.stringify({ query, variables }),
      },
    );

    const text = await response.text();
    const elapsed = Date.now() - startTime;

    // Parse cost from response extensions (same shape as Admin API)
    let cost: StorefrontCostInfo | null = null;
    try {
      const parsed = JSON.parse(text);
      if (parsed?.extensions?.cost) {
        cost = parsed.extensions.cost;
        if (cost) {
          this.updateBucketFromApi(bucket, cost);
        }
      }
    } catch {
      // Response may not be parseable
    }

    if (this.enableLogging) {
      const costMsg = cost
        ? `cost=${cost.actualQueryCost ?? cost.requestedQueryCost}pts avail=${cost.throttleStatus.currentlyAvailable}/${cost.throttleStatus.maximumAvailable}`
        : "cost=unknown";
      console.log(`[StorefrontThrottled] ${elapsed}ms ${costMsg} shop=${shop.split(".")[0]}`);
    }

    return { data: JSON.parse(text) as T, cost };
  }

  // === PRIVATE ===

  private getOrInitBucket(shop: string): BucketState {
    if (!this.buckets.has(shop)) {
      this.buckets.set(shop, {
        current: STOREFRONT_MAX_BURST,
        max: STOREFRONT_MAX_BURST,
        restoreRate: STOREFRONT_RESTORE_RATE,
        lastRefillMs: Date.now(),
      });
    }
    return this.buckets.get(shop)!;
  }

  /** Refill bucket based on elapsed time since last operation. */
  private refillBucket(bucket: BucketState): void {
    const now = Date.now();
    const elapsedSec = (now - bucket.lastRefillMs) / 1000;
    if (elapsedSec > 0) {
      const refill = Math.floor(elapsedSec * bucket.restoreRate);
      if (refill > 0) {
        bucket.current = Math.min(bucket.max, bucket.current + refill);
        bucket.lastRefillMs = now;
      }
    }
  }

  /** Update bucket state from API-reported throttle status. */
  private updateBucketFromApi(bucket: BucketState, cost: StorefrontCostInfo): void {
    if (cost?.throttleStatus) {
      bucket.current = cost.throttleStatus.currentlyAvailable;
      bucket.max = cost.throttleStatus.maximumAvailable;
      bucket.restoreRate = cost.throttleStatus.restoreRate;
      bucket.lastRefillMs = Date.now();
    }
  }

  /**
   * Wait until the bucket has enough capacity to make a safe request.
   * Leaky-bucket formula:
   *   T_sleep(ms) = ((SafetyThreshold - CurrentBucket) / RestoreRate) × 1000
   */
  private async waitForCapacity(bucket: BucketState): Promise<void> {
    this.refillBucket(bucket);

    if (bucket.current < this.safetyThreshold) {
      const needed = this.safetyThreshold - bucket.current;
      const waitMs = Math.ceil((needed / bucket.restoreRate) * 1000);

      if (this.enableLogging) {
        console.log(
          `[StorefrontThrottled] Throttling: bucket=${bucket.current}, threshold=${this.safetyThreshold}, waiting=${waitMs}ms`,
        );
      }

      await new Promise((resolve) => setTimeout(resolve, waitMs));
      this.refillBucket(bucket);
    }
  }
}

// === SINGLETON ===
let instance: StorefrontThrottledClient | null = null;

export function getStorefrontThrottledClient(
  config?: StorefrontThrottledClientConfig,
): StorefrontThrottledClient {
  if (!instance) {
    instance = new StorefrontThrottledClient(config);
  }
  return instance;
}

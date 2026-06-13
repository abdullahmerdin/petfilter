import type { AdminApiContext } from "@shopify/shopify-app-react-router/server";

// === COST TRACKING ===
interface CostState {
  currentlyAvailable: number;
  maximumAvailable: number;
  restoreRate: number;
  lastRequestedAt: number;
  safetyThreshold: number;
}

interface QueryCost {
  requestedQueryCost: number;
  actualQueryCost: number | null;
  throttleStatus: {
    maximumAvailable: number;
    currentlyAvailable: number;
    restoreRate: number;
  };
}

// === THROTTLED GRAPHQL CLIENT ===
// Wraps AdminApiContext.graphql() with rate-limit-aware queue management.
// Uses the Shopify GraphQL cost formula to calculate throttle wait times:
//   T_sleep(ms) = ((SafetyThreshold - CurrentlyAvailable) / RestoreRate) × 1000
//
// Safety threshold: 200 points (default).
// Max query cost: 1000 points (hard enforcement).
//
// See: https://shopify.dev/docs/api/usage/limits

const DEFAULT_SAFETY_THRESHOLD = 200;
const MAX_QUERY_COST = 1000;

export interface ThrottledGraphQLClientConfig {
  safetyThreshold?: number;
  enableLogging?: boolean;
}

export class ThrottledGraphQLClient {
  private costStore: Map<string, CostState> = new Map();
  private queue: Array<{
    resolve: () => void;
    reject: (err: Error) => void;
  }> = [];
  private processing = false;
  private safetyThreshold: number;
  private enableLogging: boolean;

  constructor(config: ThrottledGraphQLClientConfig = {}) {
    this.safetyThreshold = config.safetyThreshold ?? DEFAULT_SAFETY_THRESHOLD;
    this.enableLogging = config.enableLogging ?? process.env.NODE_ENV !== "production";
  }

  /** Execute a GraphQL query with cost-aware throttle management. */
  async query<T = any>(
    admin: AdminApiContext,
    query: string,
    variables?: Record<string, any>,
  ): Promise<{ json: T; cost: QueryCost | null }> {
    await this.waitInQueue();

    const shop = this.getShopIdentifier(admin);
    await this.applyThrottleWait(shop);

    const startTime = Date.now();
    const response = await admin.graphql(query, { variables });
    const text = await response.text();

    // Parse cost from response
    let cost: QueryCost | null = null;
    try {
      const parsed = JSON.parse(text);
      if (parsed?.extensions?.cost) {
        cost = parsed.extensions.cost;
        this.updateCostState(shop, cost as QueryCost);
      }
    } catch {
      // Response may not be parseable
    }

    if (this.enableLogging) {
      const elapsed = Date.now() - startTime;
      const costMsg = cost
        ? `cost=${cost.actualQueryCost ?? cost.requestedQueryCost}pts avail=${cost.throttleStatus.currentlyAvailable}/${cost.throttleStatus.maximumAvailable}`
        : "cost=unknown";
      console.log(`[ThrottledGraphQL] ${elapsed}ms ${costMsg}`);
    }

    return { json: JSON.parse(text) as T, cost };
  }

  /** Execute a mutation — same as query but shorthand. */
  async mutate<T = any>(
    admin: AdminApiContext,
    mutation: string,
    variables?: Record<string, any>,
  ): Promise<{ json: T; cost: QueryCost | null }> {
    return this.query<T>(admin, mutation, variables);
  }

  // === PRIVATE ===

  private getShopIdentifier(admin: AdminApiContext): string {
    try {
      return (admin as any)?.session?.shop ?? "default";
    } catch {
      return "default";
    }
  }

  private getCostState(shop: string): CostState {
    if (!this.costStore.has(shop)) {
      this.costStore.set(shop, {
        currentlyAvailable: 1000,
        maximumAvailable: 1000,
        restoreRate: 50,
        lastRequestedAt: Date.now(),
        safetyThreshold: this.safetyThreshold,
      });
    }
    return this.costStore.get(shop)!;
  }

  private updateCostState(shop: string, cost: QueryCost) {
    const state = this.getCostState(shop);
    state.currentlyAvailable = cost.throttleStatus.currentlyAvailable;
    state.maximumAvailable = cost.throttleStatus.maximumAvailable;
    state.restoreRate = cost.throttleStatus.restoreRate;
    state.lastRequestedAt = Date.now();
  }

  /**
   * Calculate throttle wait using the official Shopify formula:
   *   T_sleep(ms) = ((SafetyThreshold - CurrentlyAvailable) / RestoreRate) × 1000
   */
  private async applyThrottleWait(shop: string): Promise<void> {
    const state = this.getCostState(shop);
    const now = Date.now();
    const elapsedMs = now - state.lastRequestedAt;
    const restorePerMs = state.restoreRate / 1000;
    const restoredPoints = Math.floor(elapsedMs * restorePerMs);

    const available = Math.min(
      state.maximumAvailable,
      state.currentlyAvailable + restoredPoints,
    );

    if (available < this.safetyThreshold) {
      const neededPoints = this.safetyThreshold - available;
      const waitMs = Math.ceil((neededPoints / state.restoreRate) * 1000);

      if (this.enableLogging) {
        console.log(
          `[ThrottledGraphQL] Throttling: available=${available}, threshold=${this.safetyThreshold}, waiting=${waitMs}ms`,
        );
      }

      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }

  /** Queue management — serial execution. */
  private async waitInQueue(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.queue.push({ resolve: () => resolve(), reject });
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    this.processing = true;
    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (item) {
        (item.resolve as any)();
        await new Promise((r) => setTimeout(r, 0));
      }
    }
    this.processing = false;
  }
}

// === SINGLETON ===
let instance: ThrottledGraphQLClient | null = null;

export function getThrottledGraphQLClient(config?: ThrottledGraphQLClientConfig): ThrottledGraphQLClient {
  if (!instance) {
    instance = new ThrottledGraphQLClient(config);
  }
  return instance;
}

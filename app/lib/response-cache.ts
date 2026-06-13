// === RESPONSE CACHE — LRU with configurable TTL tiers ===
// For caching read-only metadata (settings, badge data, stats).
// TTL tiers:
//   SHORT  (5s)  — fast-changing dashboard stats
//   MEDIUM (60s) — shop settings, badge config
//   LONG   (5m)  — pet profiles, filter rules (stable metadata)
//   STALE  (15m) — background-refresh eligible data

export enum CacheTier {
  SHORT = 5_000,     // 5 seconds
  MEDIUM = 60_000,   // 1 minute
  LONG = 300_000,    // 5 minutes
  STALE = 900_000,   // 15 minutes
}

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  staleAt: number;
  hits: number;
}

interface CacheStats {
  size: number;
  maxSize: number;
  hits: number;
  misses: number;
  evictions: number;
}

export class ResponseCache {
  private store: Map<string, CacheEntry<any>> = new Map();
  private maxSize: number;
  private hits = 0;
  private misses = 0;
  private evictions = 0;

  constructor(maxSize = 500) {
    this.maxSize = maxSize;
  }

  /** Get or compute a cached value. Supports stale-while-revalidate. */
  async getOrCompute<T>(
    key: string,
    fetcher: () => Promise<T>,
    tier: CacheTier = CacheTier.MEDIUM,
    options?: { revalidate?: boolean },
  ): Promise<T> {
    const now = Date.now();
    const entry = this.store.get(key);

    // Fresh hit
    if (entry && now < entry.expiresAt) {
      this.hits++;
      entry.hits++;
      return entry.value as T;
    }

    // Stale hit: background refresh, return stale data
    if (entry && options?.revalidate && now < entry.staleAt) {
      this.hits++;
      entry.hits++;
      this.refreshInBackground(key, fetcher, tier);
      return entry.value as T;
    }

    // Miss
    this.misses++;
    const value = await fetcher();
    this.set(key, value, tier);
    return value;
  }

  /** Set a value in cache with explicit TTL. */
  set<T>(key: string, value: T, tier: CacheTier = CacheTier.MEDIUM): void {
    const now = Date.now();
    if (this.store.size >= this.maxSize) {
      this.evictLRU();
    }
    this.store.set(key, {
      value,
      expiresAt: now + tier,
      staleAt: now + tier + CacheTier.STALE,
      hits: 0,
    });
  }

  /** Get a cached value without fetching. */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() >= entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    this.hits++;
    entry.hits++;
    return entry.value as T;
  }

  /** Invalidate a specific key or keys matching a prefix. */
  invalidate(keyOrPrefix: string): void {
    if (this.store.has(keyOrPrefix)) {
      this.store.delete(keyOrPrefix);
      return;
    }
    for (const key of this.store.keys()) {
      if (key.startsWith(keyOrPrefix)) {
        this.store.delete(key);
      }
    }
  }

  /** Clear all cached entries. */
  clear(): void {
    this.store.clear();
  }

  /** Get cache statistics for debugging. */
  getStats(): CacheStats {
    return {
      size: this.store.size,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
    };
  }

  private evictLRU(): void {
    let lruKey: string | null = null;
    let minHits = Infinity;
    for (const [key, entry] of this.store.entries()) {
      if (entry.hits < minHits) {
        minHits = entry.hits;
        lruKey = key;
      }
    }
    if (lruKey) {
      this.store.delete(lruKey);
      this.evictions++;
    }
  }

  private async refreshInBackground<T>(
    key: string,
    fetcher: () => Promise<T>,
    tier: CacheTier,
  ): Promise<void> {
    try {
      const freshValue = await fetcher();
      this.set(key, freshValue, tier);
    } catch {
      // Silent fail — stale data remains
    }
  }
}

// === CACHE KEY HELPERS ===

export function cacheKey(prefix: string, ...args: any[]): string {
  return `${prefix}:${args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(":")}`;
}

export const CacheKeys = {
  shopSettings: (shop: string) => cacheKey("shopSettings", shop),
  petProfile: (productId: string) => cacheKey("petProfile", productId),
  filterRule: (ruleId: string) => cacheKey("filterRule", ruleId),
  dashboardStats: (shop: string) => cacheKey("dashboardStats", shop),
  badgeData: (shop: string, productId: string) => cacheKey("badgeData", shop, productId),
  compatibleBadge: (shop: string, productId: string) => cacheKey("compatibleBadge", shop, productId),
  bestMatches: (shop: string, productId: string) => cacheKey("bestMatches", shop, productId),
};

// === SINGLETON ===
let responseCache: ResponseCache | null = null;

export function getResponseCache(maxSize?: number): ResponseCache {
  if (!responseCache) {
    responseCache = new ResponseCache(maxSize);
  }
  return responseCache;
}

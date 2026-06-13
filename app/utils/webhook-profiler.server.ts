/**
 * Lightweight webhook handler performance profiler.
 *
 * Uses performance.now() for high-resolution timing and console-based
 * reporting. Designed for production use — minimal overhead (~0.1µs per
 * mark) with no external dependencies.
 *
 * Usage:
 *   const profiler = new WebhookProfiler("uninstalled");
 *   // ... do work ...
 *   profiler.mark("validate-hmac");
 *   // ... more work ...
 *   profiler.mark("authenticate");
 *   profiler.report(); // logs to console
 *
 * In production, consider piping to a metrics sink (Datadog, CloudWatch,
 * etc.) or using the .tags property for structured logging.
 */

type TagMap = Record<string, string | number | boolean>;

export class WebhookProfiler {
  /** Human-readable webhook name/source (e.g. "uninstalled", "gdpr") */
  readonly name: string;
  /** Arbitrary tags for structured logging / metrics aggregation */
  tags: TagMap;

  private marks: { label: string; elapsed: number }[] = [];
  private startTs: number;

  constructor(name: string, tags?: TagMap) {
    this.name = name;
    this.startTs = performance.now();
    this.tags = { ...tags };
  }

  /**
   * Record a named timing mark since the profile start.
   * Call after each significant phase of webhook processing.
   */
  mark(label: string): number {
    const elapsed = performance.now() - this.startTs;
    this.marks.push({ label, elapsed });
    return elapsed;
  }

  /**
   * Emit a structured console log with all timing data.
   * Format: [WEBHOOK PROFILE] <name> (<total>ms) <phase>:<ms> <phase>:<ms> ...
   *
   * Safe to call in production — single line, no PII in the timing data.
   */
  report(): void {
    if (this.marks.length === 0) return;

    const total = this.marks[this.marks.length - 1].elapsed;
    const phaseTimings = this.marks
      .reduce<{ phase: string; dur: number; cum: number }[]>((acc, m, i) => {
        const prev = i === 0 ? 0 : this.marks[i - 1].elapsed;
        acc.push({
          phase: m.label,
          dur: Math.round((m.elapsed - prev) * 100) / 100,
          cum: Math.round(m.elapsed * 100) / 100,
        });
        return acc;
      }, [])
      .map((p) => `${p.phase}=${p.dur}ms`)
      .join(" ");

    const tagStr =
      Object.keys(this.tags).length > 0
        ? ` tags=${JSON.stringify(this.tags)}`
        : "";

    console.log(
      `[WEBHOOK PROFILE] ${this.name} total=${Math.round(total * 100) / 100}ms ${phaseTimings}${tagStr}`,
    );
  }

  /**
   * Reset all timestamps. Useful if reusing a profiler instance.
   */
  reset(name?: string): void {
    if (name) (this.name as string) = name;
    this.marks = [];
    this.startTs = performance.now();
  }
}

/**
 * A simple, bounded LRU cache for webhook validation results.
 *
 * Shopify may retry the same webhook delivery if the app responds with a
 * non-2xx status. Since the retried request carries the identical body and
 * HMAC header, we can cache the validation result to avoid redundant HMAC
 * computation on retries.
 *
 * Keyed by the HMAC header value (which is already a content-authenticated
 * hash of the body + secret). Size-limited to prevent unbounded growth.
 * Uses a TTL so stale entries eventually expire.
 *
 * Thread-safety: JavaScript is single-threaded; this class is safe for
 * concurrent webhook handlers within the same Node.js process.
 */
export class ValidationResultCache {
  private maxSize: number;
  private ttlMs: number;

  private cache = new Map<
    string,
    { result: boolean; expiresAt: number }
  >();

  /**
   * @param maxSize  Max entries before LRU eviction (default: 100)
   * @param ttlMs    Time-to-live in ms (default: 300_000 = 5 min)
   */
  constructor(maxSize = 100, ttlMs = 300_000) {
    this.maxSize = maxSize;
    this.ttlMs = ttlMs;
  }

  /** Lookup cached result. Returns undefined if not found or expired. */
  get(key: string): boolean | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    // LRU: re-insert to move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.result;
  }

  /** Store a validation result. */
  set(key: string, result: boolean): void {
    // Evict LRU entry if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldest = this.cache.keys().next();
      if (!oldest.done) this.cache.delete(oldest.value);
    }

    this.cache.set(key, {
      result,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  /** Current number of cached entries (for monitoring). */
  get size(): number {
    // Clean expired entries on read
    const now = Date.now();
    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) this.cache.delete(key);
    });
    return this.cache.size;
  }

  /** Clear all entries. */
  clear(): void {
    this.cache.clear();
  }
}

// Singleton cache shared across all webhook routes
export const webhookValidationCache = new ValidationResultCache();

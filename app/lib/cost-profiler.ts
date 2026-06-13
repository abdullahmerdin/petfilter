// === COST PROFILER ===
// Tracks GraphQL query costs over time for monitoring and tuning.
// Provides helpers for cost estimation before making requests.

interface CostSample {
  queryName: string;
  requestedCost: number;
  actualCost: number | null;
  timestamp: number;
  shop: string;
}

interface CostSummary {
  totalQueries: number;
  totalRequestedCost: number;
  totalActualCost: number;
  avgRequestedCost: number;
  maxRequestedCost: number;
  peakBurstCost: number;
  queriesOverThreshold: number;
}

const BURST_WINDOW_MS = 10_000; // 10-second burst window
const HIGH_COST_THRESHOLD = 500;

export class CostProfiler {
  private samples: CostSample[] = [];
  private burstWindows: Map<number, number> = new Map();
  private maxSamples: number;

  constructor(maxSamples = 1000) {
    this.maxSamples = maxSamples;
  }

  /** Record a query cost sample. */
  record(queryName: string, requestedCost: number, actualCost: number | null, shop: string): void {
    const sample: CostSample = {
      queryName,
      requestedCost,
      actualCost,
      timestamp: Date.now(),
      shop,
    };
    this.samples.push(sample);

    const windowKey = Math.floor(sample.timestamp / BURST_WINDOW_MS);
    const current = this.burstWindows.get(windowKey) ?? 0;
    this.burstWindows.set(windowKey, current + (actualCost ?? requestedCost));

    if (this.samples.length > this.maxSamples) {
      this.samples = this.samples.slice(-this.maxSamples);
    }
  }

  /** Get a summary of all profiled costs. */
  getSummary(): CostSummary {
    const costs = this.samples.filter((s): s is Required<CostSample> => s.actualCost !== null);
    const requestedCosts = this.samples.map((s) => s.requestedCost);
    return {
      totalQueries: this.samples.length,
      totalRequestedCost: requestedCosts.reduce((a, b) => a + b, 0),
      totalActualCost: costs.length > 0 ? costs.reduce((a, b) => a + (b.actualCost ?? 0), 0) : 0,
      avgRequestedCost: requestedCosts.length > 0
        ? Math.round(requestedCosts.reduce((a, b) => a + b, 0) / requestedCosts.length)
        : 0,
      maxRequestedCost: requestedCosts.length > 0 ? Math.max(...requestedCosts) : 0,
      peakBurstCost: Math.max(...this.burstWindows.values(), 0),
      queriesOverThreshold: this.samples.filter((s) => s.requestedCost >= HIGH_COST_THRESHOLD).length,
    };
  }

  /** Estimate the cost of a query before executing it. */
  estimateCost(query: string, variables?: Record<string, any>): number {
    const isMutation = /^\s*mutation\b/im.test(query);
    let totalCost = isMutation ? 10 : 0;

    const firstMatches = query.matchAll(/\bfirst\s*:\s*\$?(\w+)/g);
    for (const match of firstMatches) {
      const value = variables?.[match[1]] ?? parseInt(match[1], 10);
      const firstOrLast = typeof value === "number" ? value : 50;
      totalCost += 2 + firstOrLast;
    }

    const lastMatches = query.matchAll(/\blast\s*:\s*\$?(\w+)/g);
    for (const match of lastMatches) {
      const value = variables?.[match[1]] ?? parseInt(match[1], 10);
      const firstOrLast = typeof value === "number" ? value : 50;
      totalCost += 2 + firstOrLast;
    }

    return totalCost;
  }

  /** Check if a query exceeds the safety threshold (200pts). */
  isSafe(query: string, variables?: Record<string, any>): boolean {
    return this.estimateCost(query, variables) <= 200;
  }

  /** Export all samples for debugging. */
  export(): CostSample[] {
    return [...this.samples];
  }

  /** Reset all recorded data. */
  reset(): void {
    this.samples = [];
    this.burstWindows.clear();
  }
}

// === SINGLETON ===
let costProfiler: CostProfiler | null = null;

export function getCostProfiler(): CostProfiler {
  if (!costProfiler) {
    costProfiler = new CostProfiler();
  }
  return costProfiler;
}

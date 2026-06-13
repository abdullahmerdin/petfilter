import { useEffect, useState, useRef } from "react";
import { Text, SkeletonBodyText, BlockStack } from "@shopify/polaris";
import { getPetEmoji } from "./pet-emojis";
import type { BestMatchesResult, BestMatchProduct } from "../modules/storefront/index";

// === STYLES ===

const styles = {
  container: {
    marginTop: "1.5rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "1rem",
  } as React.CSSProperties,
  card: {
    display: "flex",
    flexDirection: "column" as const,
    borderRadius: "8px",
    overflow: "hidden",
    border: "1px solid var(--p-color-border-subdued)",
    transition: "box-shadow 0.2s",
    textDecoration: "none",
    color: "inherit",
    background: "var(--p-color-bg-surface)",
  },
  cardImageWrapper: {
    width: "100%",
    aspectRatio: "1",
    overflow: "hidden",
    background: "var(--p-color-bg-fill-tertiary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
  },
  cardInfo: {
    padding: "0.75rem",
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.25rem",
    flex: 1,
  },
  cardTitle: {
    fontSize: "0.875rem",
    fontWeight: 500,
    lineHeight: 1.3,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
  cardPrice: {
    fontSize: "0.8125rem",
    color: "var(--p-color-text-subdued)",
  },
  scorePill: {
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 8px",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    fontWeight: 600,
    lineHeight: 1.5,
    alignSelf: "flex-start",
    marginTop: "0.25rem",
  },
  skeleton: {
    padding: "1rem",
  },
};

// === SCORE COLOR HELPER ===

function getScoreColor(percent: number): string {
  if (percent >= 80) return "#22c55e"; // green
  if (percent >= 60) return "#eab308"; // yellow
  return "#9ca3af"; // gray
}

// === PRODUCT CARD ===

function ProductCard({ match }: { match: BestMatchProduct }) {
  const emoji = getPetEmoji(match.petType);
  const scoreColor = getScoreColor(match.scorePercent);
  const productUrl = `/products/${match.handle}`;

  return (
    <a href={productUrl} style={styles.card}>
      <div style={styles.cardImageWrapper}>
        {match.image ? (
          <img
            src={match.image}
            alt={match.title}
            style={styles.cardImage}
            loading="lazy"
          />
        ) : (
          <Text as="span" variant="bodyLg" tone="subdued">
            {emoji}
          </Text>
        )}
      </div>
      <div style={styles.cardInfo}>
        <span style={styles.cardTitle}>{match.title}</span>
        <span style={styles.cardPrice}>
          {match.compareAtPrice ? (
            <>
              <span style={{ textDecoration: "line-through", marginRight: "0.25rem", opacity: 0.6 }}>
                {match.compareAtPrice}
              </span>
              {match.price}
            </>
          ) : (
            match.price || ""
          )}
        </span>
        <span style={{ ...styles.scorePill, color: "#fff", background: scoreColor }}>
          {match.scorePercent}% Match
        </span>
      </div>
    </a>
  );
}

// === MAIN COMPONENT ===

interface BestMatchesSectionProps {
  productId: string;
  /** Optional proxy URL override (defaults to Shopify app proxy path). */
  proxyUrl?: string;
}

export function BestMatchesSection({ productId, proxyUrl }: BestMatchesSectionProps) {
  const [data, setData] = useState<BestMatchesResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const abort = new AbortController();
    setLoading(true);
    setError(false);

    const url =
      proxyUrl ??
      `/apps/pet-filter/proxy/best-matches?productId=${encodeURIComponent(productId)}`;

    fetch(url, { signal: abort.signal })
      .then(async (res) => {
        if (!mountedRef.current) return;
        if (res.status === 204) {
          setData(null);
          setLoading(false);
          return;
        }
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        const json: BestMatchesResult = await res.json();
        if (mountedRef.current) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        if (mountedRef.current) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      mountedRef.current = false;
      abort.abort();
    };
  }, [productId, proxyUrl]);

  // Loading state
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.skeleton}>
          <BlockStack gap="300">
            <SkeletonBodyText lines={1} />
            <SkeletonBodyText lines={2} />
          </BlockStack>
        </div>
      </div>
    );
  }

  // No data (204) or error — hide silently
  if (!data || error) return null;

  // No matches
  if (data.matches.length === 0) return null;

  const emoji = getPetEmoji(data.currentPetType);

  return (
    <div style={styles.container}>
      <Text as="h3" variant="headingMd" tone="base">
        {emoji} Best Matches for Your Pet
      </Text>
      <div style={styles.grid}>
        {data.matches.map((match) => (
          <ProductCard key={match.productId} match={match} />
        ))}
      </div>
    </div>
  );
}

import type { JSX } from "react";

export function MatchingSkeleton(): JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Configure Matching skeleton card */}
      <div
        style={{
          background: "var(--t-color-bg-surface)",
          borderRadius: "8px",
          boxShadow: "0 0 0 1px var(--t-color-border-secondary)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "1rem 1rem 0 1rem" }}>
          <div
            style={{
              height: "1.25rem",
              width: "160px",
              background: "var(--t-color-bg-fill)",
              borderRadius: "4px",
              animation: "pulse 1.5s infinite",
            }}
          />
        </div>
        <div style={{ padding: "1rem" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              maxWidth: "480px",
            }}
          >
            <div>
              <div
                style={{
                  height: "0.875rem",
                  width: "80px",
                  background: "var(--t-color-bg-fill)",
                  borderRadius: "4px",
                  marginBottom: "0.25rem",
                  animation: "pulse 1.5s infinite",
                }}
              />
              <div
                style={{
                  height: "2.25rem",
                  width: "100%",
                  background: "var(--t-color-bg-fill)",
                  borderRadius: "6px",
                  animation: "pulse 1.5s infinite",
                }}
              />
            </div>
            <div>
              <div
                style={{
                  height: "0.875rem",
                  width: "100px",
                  background: "var(--t-color-bg-fill)",
                  borderRadius: "4px",
                  marginBottom: "0.25rem",
                  animation: "pulse 1.5s infinite",
                }}
              />
              <div
                style={{
                  height: "2.25rem",
                  width: "100%",
                  background: "var(--t-color-bg-fill)",
                  borderRadius: "6px",
                  animation: "pulse 1.5s infinite",
                }}
              />
            </div>
            <div
              style={{
                height: "2.25rem",
                width: "120px",
                background: "var(--t-color-bg-fill)",
                borderRadius: "6px",
                animation: "pulse 1.5s infinite",
              }}
            />
          </div>
        </div>
      </div>

      {/* Results skeleton card */}
      <div
        style={{
          background: "var(--t-color-bg-surface)",
          borderRadius: "8px",
          boxShadow: "0 0 0 1px var(--t-color-border-secondary)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "1rem 1rem 0 1rem" }}>
          <div
            style={{
              height: "1.25rem",
              width: "180px",
              background: "var(--t-color-bg-fill)",
              borderRadius: "4px",
              animation: "pulse 1.5s infinite",
            }}
          />
        </div>
        <div style={{ padding: "1rem" }}>
          {/* Table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 60px 1fr",
              gap: "0.75rem",
              marginBottom: "0.75rem",
            }}
          >
            {["Product", "Pet Type", "Breed", "Score", "Matched Criteria"].map(
              (_, i) => (
                <div
                  key={i}
                  style={{
                    height: "0.75rem",
                    background: "var(--t-color-bg-fill)",
                    borderRadius: "4px",
                    animation: "pulse 1.5s infinite",
                  }}
                />
              ),
            )}
          </div>
          {/* Table rows */}
          {[1, 2, 3, 4, 5].map((r) => (
            <div
              key={r}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 60px 1fr",
                gap: "0.75rem",
                padding: "0.75rem 0",
                borderTop: "1px solid var(--t-color-border-secondary)",
              }}
            >
              <div
                style={{
                  height: "0.875rem",
                  background: "var(--t-color-bg-fill)",
                  borderRadius: "4px",
                  animation: "pulse 1.5s infinite",
                }}
              />
              <div
                style={{
                  height: "0.875rem",
                  background: "var(--t-color-bg-fill)",
                  borderRadius: "4px",
                  animation: "pulse 1.5s infinite",
                }}
              />
              <div
                style={{
                  height: "0.875rem",
                  background: "var(--t-color-bg-fill)",
                  borderRadius: "4px",
                  animation: "pulse 1.5s infinite",
                }}
              />
              <div
                style={{
                  height: "1.25rem",
                  width: "48px",
                  background: "var(--t-color-bg-fill)",
                  borderRadius: "999px",
                  animation: "pulse 1.5s infinite",
                }}
              />
              <div
                style={{
                  height: "0.875rem",
                  background: "var(--t-color-bg-fill)",
                  borderRadius: "4px",
                  animation: "pulse 1.5s infinite",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

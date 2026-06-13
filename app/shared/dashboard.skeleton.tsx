export function DashboardSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ background: "var(--t-color-bg-surface)", borderRadius: "8px", boxShadow: "0 0 0 1px var(--t-color-border-secondary)", padding: "1rem" }}>
            <div style={{ height: "12px", width: "60%", background: "var(--t-color-bg-fill)", borderRadius: "4px", marginBottom: "0.5rem" }} />
            <div style={{ height: "32px", width: "40%", background: "var(--t-color-bg-fill)", borderRadius: "4px", marginBottom: "0.25rem" }} />
            <div style={{ height: "14px", width: "50%", background: "var(--t-color-bg-fill)", borderRadius: "4px" }} />
          </div>
        ))}
      </div>
      <div style={{ background: "var(--t-color-bg-surface)", borderRadius: "8px", boxShadow: "0 0 0 1px var(--t-color-border-secondary)", padding: "1rem" }}>
        <div style={{ height: "16px", width: "30%", background: "var(--t-color-bg-fill)", borderRadius: "4px", marginBottom: "1rem" }} />
        {[1, 2, 3].map(i => (
          <div key={i} style={{ height: "14px", width: `${70 - i * 10}%`, background: "var(--t-color-bg-fill)", borderRadius: "4px", marginBottom: "0.5rem" }} />
        ))}
      </div>
    </div>
  );
}

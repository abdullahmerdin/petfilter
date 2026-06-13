export function ProductsSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ height: "20px", width: "150px", background: "var(--t-color-bg-fill)", borderRadius: "4px" }} />
      </div>
      <div style={{ background: "var(--t-color-bg-surface)", borderRadius: "8px", boxShadow: "0 0 0 1px var(--t-color-border-secondary)", overflow: "hidden" }}>
        <div style={{ padding: "1rem" }}>
          <div style={{ height: "14px", width: "100%", background: "var(--t-color-bg-fill)", borderRadius: "4px", marginBottom: "0.75rem" }} />
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ height: "14px", width: `${80 - i * 8}%`, background: "var(--t-color-bg-fill)", borderRadius: "4px", marginBottom: "0.5rem" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

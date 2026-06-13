export function SettingsSkeleton() {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Storefront Badge Card Skeleton */}
      <div
        style={{
          background: 'var(--t-color-bg-surface)',
          borderRadius: '8px',
          boxShadow: '0 0 0 1px var(--t-color-border-secondary)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '1rem 1rem 0 1rem' }}>
          <div
            style={{
              height: '1.25rem',
              width: '180px',
              background: 'linear-gradient(90deg, var(--t-color-bg-fill) 25%, var(--t-color-border-secondary) 50%, var(--t-color-bg-fill) 75%)',
              backgroundSize: '200% 100%',
              borderRadius: '4px',
              animation: 'shimmer 1.5s ease-in-out infinite',
            }}
          />
        </div>
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 480 }}>
          {/* Checkbox skeleton */}
          <div
            style={{
              height: '1.25rem',
              width: '220px',
              background: 'linear-gradient(90deg, var(--t-color-bg-fill) 25%, var(--t-color-border-secondary) 50%, var(--t-color-bg-fill) 75%)',
              backgroundSize: '200% 100%',
              borderRadius: '4px',
              animation: 'shimmer 1.5s ease-in-out infinite',
            }}
          />
          {/* Color skeleton */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div
              style={{
                height: '0.875rem',
                width: '100px',
                background: 'linear-gradient(90deg, var(--t-color-bg-fill) 25%, var(--t-color-border-secondary) 50%, var(--t-color-bg-fill) 75%)',
                backgroundSize: '200% 100%',
                borderRadius: '4px',
                animation: 'shimmer 1.5s ease-in-out infinite',
              }}
            />
            <div
              style={{
                height: '32px',
                width: '40px',
                background: 'linear-gradient(90deg, var(--t-color-bg-fill) 25%, var(--t-color-border-secondary) 50%, var(--t-color-bg-fill) 75%)',
                backgroundSize: '200% 100%',
                borderRadius: '6px',
                animation: 'shimmer 1.5s ease-in-out infinite',
              }}
            />
          </div>
          {/* Badge Text skeleton */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div
              style={{
                height: '0.875rem',
                width: '90px',
                background: 'linear-gradient(90deg, var(--t-color-bg-fill) 25%, var(--t-color-border-secondary) 50%, var(--t-color-bg-fill) 75%)',
                backgroundSize: '200% 100%',
                borderRadius: '4px',
                animation: 'shimmer 1.5s ease-in-out infinite',
              }}
            />
            <div
              style={{
                height: '2.25rem',
                width: '100%',
                background: 'linear-gradient(90deg, var(--t-color-bg-fill) 25%, var(--t-color-border-secondary) 50%, var(--t-color-bg-fill) 75%)',
                backgroundSize: '200% 100%',
                borderRadius: '6px',
                animation: 'shimmer 1.5s ease-in-out infinite',
              }}
            />
          </div>
          {/* Button Label skeleton */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div
              style={{
                height: '0.875rem',
                width: '110px',
                background: 'linear-gradient(90deg, var(--t-color-bg-fill) 25%, var(--t-color-border-secondary) 50%, var(--t-color-bg-fill) 75%)',
                backgroundSize: '200% 100%',
                borderRadius: '4px',
                animation: 'shimmer 1.5s ease-in-out infinite',
              }}
            />
            <div
              style={{
                height: '2.25rem',
                width: '100%',
                background: 'linear-gradient(90deg, var(--t-color-bg-fill) 25%, var(--t-color-border-secondary) 50%, var(--t-color-bg-fill) 75%)',
                backgroundSize: '200% 100%',
                borderRadius: '6px',
                animation: 'shimmer 1.5s ease-in-out infinite',
              }}
            />
          </div>
          {/* Submit button skeleton */}
          <div
            style={{
              height: '2.25rem',
              width: '120px',
              background: 'linear-gradient(90deg, var(--t-color-bg-fill) 25%, var(--t-color-border-secondary) 50%, var(--t-color-bg-fill) 75%)',
              backgroundSize: '200% 100%',
              borderRadius: '6px',
              animation: 'shimmer 1.5s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* App Info Card Skeleton */}
      <div
        style={{
          background: 'var(--t-color-bg-surface)',
          borderRadius: '8px',
          boxShadow: '0 0 0 1px var(--t-color-border-secondary)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '1rem 1rem 0 1rem' }}>
          <div
            style={{
              height: '1.25rem',
              width: '100px',
              background: 'linear-gradient(90deg, var(--t-color-bg-fill) 25%, var(--t-color-border-secondary) 50%, var(--t-color-bg-fill) 75%)',
              backgroundSize: '200% 100%',
              borderRadius: '4px',
              animation: 'shimmer 1.5s ease-in-out infinite',
            }}
          />
        </div>
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div
            style={{
              height: '1rem',
              width: '140px',
              background: 'linear-gradient(90deg, var(--t-color-bg-fill) 25%, var(--t-color-border-secondary) 50%, var(--t-color-bg-fill) 75%)',
              backgroundSize: '200% 100%',
              borderRadius: '4px',
              animation: 'shimmer 1.5s ease-in-out infinite',
            }}
          />
          <div
            style={{
              height: '1rem',
              width: '200px',
              background: 'linear-gradient(90deg, var(--t-color-bg-fill) 25%, var(--t-color-border-secondary) 50%, var(--t-color-bg-fill) 75%)',
              backgroundSize: '200% 100%',
              borderRadius: '4px',
              animation: 'shimmer 1.5s ease-in-out infinite',
            }}
          />
          <div
            style={{
              height: '1rem',
              width: '160px',
              background: 'linear-gradient(90deg, var(--t-color-bg-fill) 25%, var(--t-color-border-secondary) 50%, var(--t-color-bg-fill) 75%)',
              backgroundSize: '200% 100%',
              borderRadius: '4px',
              animation: 'shimmer 1.5s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}

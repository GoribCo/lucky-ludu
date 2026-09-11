import { memo } from 'react';

interface CoinProps {
  size?: number;
  /** highlight as freshly placed */
  fresh?: boolean;
  color: string;
}

/** A single coin/token rendered as a glossy 3D disc. */
function CoinBase({ size = 34, fresh = false, color }: CoinProps) {
  return (
    <span
      className={`relative inline-flex items-center justify-center rounded-full no-select ${
        fresh ? 'animate-popIn' : ''
      }`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 28%, #ffffff 0%, ${color} 55%, rgba(0,0,0,0.35) 100%)`,
        boxShadow:
          'inset 0 -3px 4px rgba(0,0,0,0.45), inset 0 3px 3px rgba(255,255,255,0.6), 0 3px 6px rgba(0,0,0,0.25)',
      }}
      aria-label="coin placed"
    >
      <span
        className="absolute rounded-full"
        style={{
          inset: size * 0.18,
          border: `${Math.max(1, size * 0.05)}px solid rgba(255,255,255,0.55)`,
          borderRadius: '50%',
        }}
      />
      <span
        className="absolute rounded-full"
        style={{
          top: size * 0.16,
          left: size * 0.22,
          width: size * 0.28,
          height: size * 0.18,
          background: 'rgba(255,255,255,0.7)',
          filter: 'blur(1px)',
          borderRadius: '50%',
        }}
      />
    </span>
  );
}

export const Coin = memo(CoinBase);

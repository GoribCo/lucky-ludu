import { useMemo } from 'react';

const COLORS = ['#f43f6a', '#229c6a', '#efad1f', '#0ea5e9', '#8b5cf6', '#f59e0b'];

interface ConfettiProps {
  count?: number;
}

/** Lightweight CSS confetti — no dependency, falls straight down with rotation. */
export function Confetti({ count = 80 }: ConfettiProps) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.8;
        const duration = 2.5 + Math.random() * 2.5;
        const size = 6 + Math.random() * 8;
        const color = COLORS[i % COLORS.length];
        const round = Math.random() > 0.5;
        return { left, delay, duration, size, color, round, id: i };
      }),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 animate-confetti"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * (p.round ? 1 : 1.6),
            background: p.color,
            borderRadius: p.round ? '50%' : '2px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

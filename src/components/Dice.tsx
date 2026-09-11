import { memo } from 'react';
import type { DiceFace } from '@/game/types';

const PIP_LAYOUT: Record<DiceFace, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function DiceFacePips({ value }: { value: DiceFace }) {
  const cells = PIP_LAYOUT[value];
  return (
    <>
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} className="flex items-center justify-center">
          {cells.includes(i) ? <span className="dice-pip" /> : <span />}
        </div>
      ))}
    </>
  );
}

interface DiceProps {
  value: DiceFace;
  rolling: boolean;
  size?: number;
}

const FACE_ROTATIONS: Record<DiceFace, string> = {
  1: 'rotateX(0deg) rotateY(0deg)',
  2: 'rotateY(-90deg)',
  3: 'rotateX(-90deg)',
  4: 'rotateX(90deg)',
  5: 'rotateY(90deg)',
  6: 'rotateY(180deg)',
};

function DiceBase({ value, rolling, size = 120 }: DiceProps) {
  const half = size / 2;
  const spin = rolling
    ? `rotateX(${720 + Math.floor(Math.random() * 360)}deg) rotateY(${
        540 + Math.floor(Math.random() * 360)
      }deg) rotateZ(${180 + Math.floor(Math.random() * 120)}deg)`
    : FACE_ROTATIONS[value];

  return (
    <div className="dice-scene no-select" style={{ width: size, height: size }}>
      <div
        className={`dice-cube ${rolling ? 'is-rolling' : ''}`}
        style={
          {
            width: size,
            height: size,
            transform: spin,
            '--dice-size': `${size}px`,
            '--dice-half': `${half}px`,
          } as React.CSSProperties
        }
      >
        {([1, 2, 3, 4, 5, 6] as DiceFace[]).map((f) => (
          <div key={f} className={`dice-face dice-face--${f}`}>
            <DiceFacePips value={f} />
          </div>
        ))}
      </div>
    </div>
  );
}

export const Dice = memo(DiceBase);

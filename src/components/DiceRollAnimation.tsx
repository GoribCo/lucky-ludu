import { memo, useState, useEffect } from 'react';
import { Dices } from 'lucide-react';
import type { DiceFace } from '@/game/types';
import { Dice } from './Dice';
import { rollDice } from '@/game/engine';

interface DiceRollAnimationProps {
  rolling: boolean;
  value: DiceFace;
  size?: number;
  onRollStart?: () => void;
  onRollEnd?: () => void;
  duration?: number;
}

/**
 * Dice that shuffles through faces while rolling, then settles on the final value.
 */
function DiceRollAnimationBase({
  rolling,
  value,
  size = 140,
  onRollStart,
  onRollEnd,
  duration = 1000,
}: DiceRollAnimationProps) {
  const [display, setDisplay] = useState<DiceFace>(value);

  useEffect(() => {
    if (!rolling) {
      setDisplay(value);
      return;
    }
    onRollStart?.();
    const interval = window.setInterval(() => {
      setDisplay(rollDice());
    }, 80);
    const timeout = window.setTimeout(() => {
      window.clearInterval(interval);
      setDisplay(value);
      onRollEnd?.();
    }, duration);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolling]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={rolling ? 'animate-shake' : ''} style={{ width: size, height: size }}>
        <Dice value={display} rolling={rolling} size={size} />
      </div>
      <div className="flex items-center gap-2 text-white/70 text-sm font-semibold">
        <Dices className="h-4 w-4" />
        <span>{rolling ? 'Rolling…' : value ? `Showing ${value}` : 'Ready to roll'}</span>
      </div>
    </div>
  );
}

export const DiceRollAnimation = memo(DiceRollAnimationBase);

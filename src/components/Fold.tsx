import { memo } from 'react';
import type { Fold as FoldType } from '@/game/types';
import { Coin } from './Coin';
import { playerColor } from '@/game/constants';

interface FoldProps {
  fold: FoldType;
  colorIndex: number;
  /** [foldIndex, slotIndex] freshly placed, to animate */
  freshSlot?: [number, number] | null;
  foldIndex: number;
  label?: string;
}

function FoldBase({ fold, colorIndex, freshSlot, foldIndex, label }: FoldProps) {
  const color = playerColor(colorIndex);
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-[11px] font-bold uppercase tracking-wider text-white/55">
          {label}
        </span>
      )}
      <div className="flex gap-1.5 sm:gap-2">
        {fold.slots.map((slot, s) => {
          const isFresh = freshSlot?.[0] === foldIndex && freshSlot?.[1] === s;
          return (
            <div
              key={s}
              className={`relative flex h-9 w-9 items-center justify-center rounded-lg border-2 text-sm font-extrabold sm:h-11 sm:w-11 ${
                slot.filled
                  ? `${color.border} bg-white/10 text-transparent`
                  : 'border-white/20 bg-white/5 text-white/70'
              }`}
            >
              {!slot.filled && <span>{slot.value}</span>}
              {slot.filled && <Coin size={30} fresh={isFresh} color={color.solid} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const Fold = memo(FoldBase);

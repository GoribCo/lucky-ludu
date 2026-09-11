import { memo } from 'react';
import { ChevronRight } from 'lucide-react';
import type { Player } from '@/game/types';
import { playerColor } from '@/game/constants';
import { countFilled, totalSlots } from '@/game/engine';

interface TurnIndicatorProps {
  player: Player;
  turnNumber: number;
  rolling: boolean;
}

function TurnIndicatorBase({ player, turnNumber, rolling }: TurnIndicatorProps) {
  const color = playerColor(player.colorIndex);
  const filled = countFilled(player);
  const total = totalSlots(player);
  const pct = total ? Math.round((filled / total) * 100) : 0;

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl bg-gradient-to-r ${color.gradient} px-4 py-3 text-white shadow-pop animate-bannerIn`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/25 text-lg font-extrabold no-select">
        {player.name.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-base font-extrabold sm:text-lg">{player.name}</span>
          {rolling && (
            <span className="hidden text-xs font-bold uppercase tracking-wide text-white/80 sm:inline">
              rolling…
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-2">
          <div className="h-1.5 w-full max-w-[160px] overflow-hidden rounded-full bg-white/30">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[11px] font-bold tabular-nums text-white/90">
            {filled}/{total}
          </span>
        </div>
      </div>
      <div className="hidden shrink-0 flex-col items-end sm:flex">
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">Turn</span>
        <span className="text-lg font-extrabold leading-none tabular-nums">{turnNumber}</span>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-white/80" />
    </div>
  );
}

export const TurnIndicator = memo(TurnIndicatorBase);

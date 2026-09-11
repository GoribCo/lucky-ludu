import { memo } from 'react';
import { Crown, CheckCircle2 } from 'lucide-react';
import type { Player } from '@/game/types';
import { playerColor } from '@/game/constants';
import { Fold } from './Fold';
import { countFilled, totalSlots } from '@/game/engine';

interface PlayerBoardProps {
  player: Player;
  active: boolean;
  freshSlot?: [number, number] | null;
  compact?: boolean;
}

function PlayerBoardBase({ player, active, freshSlot, compact = false }: PlayerBoardProps) {
  const color = playerColor(player.colorIndex);
  const filled = countFilled(player);
  const total = totalSlots(player);
  const pct = total ? Math.round((filled / total) * 100) : 0;
  const done = player.finished;

  return (
    <div
      className={`rounded-2xl border-2 bg-white/5 p-3 transition-all sm:p-4 ${
        active ? `${color.border} ring-2 ${color.ring}/40 shadow-pop` : 'border-white/10'
      } ${done ? 'opacity-90' : ''}`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${color.bg} text-sm font-extrabold text-white no-select`}
          >
            {player.name.charAt(0).toUpperCase()}
          </span>
          <span className="truncate text-sm font-extrabold text-white sm:text-base">
            {player.name}
          </span>
          {done && (
            <span className="flex items-center gap-1 rounded-full bg-gold-400/20 px-2 py-0.5 text-[10px] font-bold text-gold-300">
              <Crown className="h-3 w-3" /> Done
            </span>
          )}
        </div>
        <span className="shrink-0 text-xs font-bold tabular-nums text-white/70">
          {filled}/{total}
        </span>
      </div>

      <div
        className={`flex flex-col gap-2.5 ${compact ? '' : 'sm:gap-3'}`}
        aria-label={`${player.name}'s board`}
      >
        {player.folds.map((fold, f) => (
          <Fold
            key={fold.id}
            fold={fold}
            colorIndex={player.colorIndex}
            freshSlot={freshSlot}
            foldIndex={f}
            label={`Fold ${f + 1}`}
          />
        ))}
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color.gradient} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export const PlayerBoard = memo(PlayerBoardBase);

/** Compact summary used in the side rail / overview list. */
function PlayerSummaryBase({
  player,
  active,
  rank,
}: {
  player: Player;
  active: boolean;
  rank?: number;
}) {
  const color = playerColor(player.colorIndex);
  const filled = countFilled(player);
  const total = totalSlots(player);
  const pct = total ? Math.round((filled / total) * 100) : 0;

  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 transition-all ${
        active ? `${color.border} bg-white/10` : 'border-white/10 bg-white/[0.03]'
      }`}
    >
      {rank ? (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-extrabold text-white">
          {rank}
        </span>
      ) : (
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${color.bg} text-xs font-extrabold text-white no-select`}
        >
          {player.name.charAt(0).toUpperCase()}
        </span>
      )}
      <span className="min-w-0 flex-1 truncate text-xs font-bold text-white">{player.name}</span>
      {player.finished && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-gold-300" />}
      <span className="shrink-0 text-[10px] font-bold tabular-nums text-white/60">{pct}%</span>
    </div>
  );
}

export const PlayerSummary = memo(PlayerSummaryBase);

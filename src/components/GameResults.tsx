import { Home, RotateCcw, Trophy, Crown, Medal } from 'lucide-react';
import type { PlayerRanking } from '@/game/types';
import { playerColor } from '@/game/constants';

interface GameResultsProps {
  rankings: PlayerRanking[];
  onPlayAgain: () => void;
  onNewGame: () => void;
}

const MEDAL: Record<number, { icon: React.ReactNode; label: string; ring: string; chip: string }> = {
  1: {
    icon: <Crown className="h-6 w-6" />,
    label: '1st Place',
    ring: 'ring-gold-400',
    chip: 'bg-gold-400/20 text-gold-300',
  },
  2: {
    icon: <Medal className="h-6 w-6" />,
    label: '2nd Place',
    ring: 'ring-slate-300',
    chip: 'bg-slate-300/20 text-slate-200',
  },
  3: {
    icon: <Medal className="h-6 w-6" />,
    label: '3rd Place',
    ring: 'ring-amber-600',
    chip: 'bg-amber-600/20 text-amber-400',
  },
};

export function GameResults({ rankings, onPlayAgain, onNewGame }: GameResultsProps) {
  const winner = rankings[0];
  const wColor = playerColor(winner.player.colorIndex);

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-b from-felt-800 via-felt-900 to-felt-950 px-4 py-8">
      <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold-500/25 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-md flex-col items-center gap-6">
        <div className="flex items-center gap-2 text-gold-300 animate-bannerIn">
          <Trophy className="h-7 w-7" />
          <h1 className="font-display text-3xl font-bold text-white">Game Over!</h1>
        </div>

        {/* Winner card */}
        <div
          className={`w-full rounded-3xl bg-gradient-to-br ${wColor.gradient} p-5 text-center text-white shadow-pop ring-4 ${MEDAL[1].ring} animate-bannerIn`}
        >
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-white/25 text-3xl font-extrabold no-select">
            {winner.player.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-white/80">Winner</div>
          <div className="font-display text-3xl font-bold">{winner.player.name}</div>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-1 text-sm font-bold">
            <Crown className="h-4 w-4" /> 1st Place
          </div>
        </div>

        {/* Full ranking */}
        <div className="flex w-full flex-col gap-2">
          <h2 className="px-1 text-xs font-extrabold uppercase tracking-wider text-white/50">
            Final Ranking
          </h2>
          {rankings.map((r) => {
            const color = playerColor(r.player.colorIndex);
            const medal = MEDAL[r.rank];
            return (
              <div
                key={r.player.id}
                className={`flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 animate-slideInRight`}
                style={{ animationDelay: `${r.rank * 60}ms` }}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    medal ? `${color.bg} text-white` : 'bg-white/10 text-white/80'
                  } font-extrabold no-select`}
                >
                  {r.rank <= 3 ? medal?.icon : r.rank}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-extrabold text-white">{r.player.name}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 w-full max-w-[140px] overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${color.gradient}`}
                        style={{
                          width: `${r.totalSlots ? Math.round((r.filledSlots / r.totalSlots) * 100) : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-bold tabular-nums text-white/60">
                      {r.filledSlots}/{r.totalSlots}
                    </span>
                  </div>
                </div>
                {medal && (
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${medal.chip}`}>
                    {medal.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Stats summary */}
        <div className="grid w-full grid-cols-2 gap-3">
          <StatCard
            label="Total rolls"
            value={rankings.reduce((s, r) => s + r.player.rollsTaken, 0).toString()}
          />
          <StatCard
            label="Coins placed"
            value={rankings.reduce((s, r) => s + r.player.coinsPlaced, 0).toString()}
          />
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <button
            onClick={onPlayAgain}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-lucky-400 to-lucky-600 px-6 py-4 text-base font-extrabold text-white shadow-pop transition-all hover:scale-[1.02] active:scale-95"
          >
            <RotateCcw className="h-5 w-5" /> Play Again
          </button>
          <button
            onClick={onNewGame}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-base font-extrabold text-white transition-all hover:bg-white/20 active:scale-95"
          >
            <Home className="h-5 w-5" /> New Game
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
      <div className="text-2xl font-extrabold tabular-nums text-white">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">{label}</div>
    </div>
  );
}

import { ArrowLeft, Minus, Plus, Play, Users, Layers } from 'lucide-react';
import { useState } from 'react';
import type { GameConfig } from '@/game/types';
import {
  MAX_FOLDS,
  MAX_PLAYERS,
  MIN_FOLDS,
  MIN_PLAYERS,
  PLAYER_COLORS,
  playerColor,
} from '@/game/constants';
import { clamp } from '@/game/engine';

interface GameSetupProps {
  initial: GameConfig;
  onCancel: () => void;
  onStart: (config: GameConfig) => void;
}

export function GameSetup({ initial, onCancel, onStart }: GameSetupProps) {
  const [playerCount, setPlayerCount] = useState(initial.playerCount);
  const [foldCount, setFoldCount] = useState(initial.foldCount);
  const [names, setNames] = useState<string[]>(() => {
    const base = [...initial.playerNames];
    while (base.length < MAX_PLAYERS) base.push(`Player ${base.length + 1}`);
    return base;
  });

  const updateName = (i: number, value: string) => {
    setNames((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  };

  const adjustPlayers = (delta: number) => {
    setPlayerCount((prev) => clamp(prev + delta, MIN_PLAYERS, MAX_PLAYERS));
  };
  const adjustFolds = (delta: number) => {
    setFoldCount((prev) => clamp(prev + delta, MIN_FOLDS, MAX_FOLDS));
  };

  const start = () => {
    const finalNames = names.slice(0, playerCount).map((n, i) => n.trim() || `Player ${i + 1}`);
    onStart({ playerCount, foldCount, playerNames: finalNames });
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-felt-800 via-felt-900 to-felt-950 px-4 py-6">
      <div className="mx-auto flex max-w-lg flex-col gap-5">
        <header className="flex items-center justify-between">
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-sm font-bold text-white transition hover:bg-white/20 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="font-display text-2xl font-bold text-white">Game Setup</h1>
          <span className="w-16" />
        </header>

        {/* Players */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <SectionTitle icon={<Users className="h-4 w-4" />} title="Players">
            <Stepper value={playerCount} min={MIN_PLAYERS} max={MAX_PLAYERS} onDec={() => adjustPlayers(-1)} onInc={() => adjustPlayers(1)} />
          </SectionTitle>

          <div className="mt-3 flex flex-col gap-2">
            {Array.from({ length: playerCount }, (_, i) => {
              const color = playerColor(i);
              return (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${color.bg} text-sm font-extrabold text-white no-select`}
                  >
                    {i + 1}
                  </span>
                  <input
                    type="text"
                    value={names[i]}
                    onChange={(e) => updateName(i, e.target.value)}
                    maxLength={14}
                    placeholder={`Player ${i + 1}`}
                    className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white placeholder-white/40 outline-none transition focus:border-white/40 focus:bg-white/15"
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* Folds */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <SectionTitle icon={<Layers className="h-4 w-4" />} title="Folds per player">
            <Stepper value={foldCount} min={MIN_FOLDS} max={MAX_FOLDS} onDec={() => adjustFolds(-1)} onInc={() => adjustFolds(1)} />
          </SectionTitle>

          <p className="mt-3 text-xs font-semibold text-white/55">
            Each fold has the numbers 1 through 6. You'll need{' '}
            <span className="font-extrabold text-gold-300">{foldCount * 6}</span> coins to finish.
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {Array.from({ length: foldCount }, (_, f) => (
              <div
                key={f}
                className="flex gap-1 rounded-lg border border-white/10 bg-white/5 px-1.5 py-1"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <span
                    key={n}
                    className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold text-white/60"
                  >
                    {n}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Color preview */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <SectionTitle icon={<span className="h-3 w-3 rounded-full bg-gradient-to-r from-lucky-400 to-gold-400" />} title="Player colors">
            <span />
          </SectionTitle>
          <div className="mt-3 flex flex-wrap gap-2">
            {PLAYER_COLORS.slice(0, playerCount).map((c, i) => (
              <span
                key={i}
                className={`flex items-center gap-1.5 rounded-full ${c.bgSoft} px-2.5 py-1 text-xs font-bold ${c.text}`}
              >
                <span className={`h-3 w-3 rounded-full ${c.bg}`} />
                {names[i]?.trim() || `Player ${i + 1}`}
              </span>
            ))}
          </div>
        </section>

        <button
          onClick={start}
          className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-lucky-400 to-lucky-600 px-6 py-4 text-lg font-extrabold text-white shadow-pop transition-all hover:scale-[1.02] hover:shadow-glow active:scale-95"
        >
          <Play className="h-5 w-5" />
          Start Game
        </button>
      </div>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 text-white">
        <span className="text-gold-300">{icon}</span>
        <h2 className="text-sm font-extrabold uppercase tracking-wide">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Stepper({
  value,
  min,
  max,
  onDec,
  onInc,
}: {
  value: number;
  min: number;
  max: number;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDec}
        disabled={value <= min}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 active:scale-90 disabled:opacity-30"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-8 text-center text-lg font-extrabold tabular-nums text-white">{value}</span>
      <button
        onClick={onInc}
        disabled={value >= max}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 active:scale-90 disabled:opacity-30"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}



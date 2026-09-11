import { Dices, Home, LogOut } from 'lucide-react';
import { useMemo } from 'react';
import type { GameState } from '@/game/types';
import { playerColor } from '@/game/constants';
import { TurnIndicator } from './TurnIndicator';
import { PlayerBoard } from './PlayerBoard';
import { PlayerSummary } from './PlayerBoard';
import { DiceRollAnimation } from './DiceRollAnimation';

interface GameBoardProps {
  state: GameState;
  freshSlot: [number, number] | null;
  onRoll: () => void;
  onPass: () => void;
  onQuit: () => void;
  onHome: () => void;
}

export function GameBoard({ state, freshSlot, onRoll, onPass, onQuit, onHome }: GameBoardProps) {
  const active = state.players[state.activePlayerIndex];
  const color = playerColor(active.colorIndex);
  const finishedCount = state.players.filter((p) => p.finished).length;
  const stillPlaying = state.players.filter((p) => !p.finished);
  const messageKind = useMemo(() => classifyMessage(state.message), [state.message]);

  const canRoll = !state.rolling && !active.finished;
  const canPass = !state.rolling && !state.lastRoll && !active.finished;

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-felt-800 via-felt-900 to-felt-950">
      {/* Top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-felt-950/70 px-3 py-2.5 backdrop-blur-md">
        <button
          onClick={onHome}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20 active:scale-95"
          aria-label="Home"
        >
          <Home className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 text-white">
          <Dices className="h-4 w-4 text-gold-300" />
          <span className="font-display text-base font-bold">Lucky Ludu</span>
        </div>
        <button
          onClick={onQuit}
          className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/20 active:scale-95"
        >
          <LogOut className="h-3.5 w-3.5" /> Quit
        </button>
      </header>

      <div className="mx-auto max-w-3xl px-3 py-4 sm:px-4">
        {/* Turn indicator */}
        <TurnIndicator player={active} turnNumber={state.turnNumber} rolling={state.rolling} />

        {/* Overview rail */}
        <div className="mt-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/45">
              All players
            </span>
            <span className="text-[10px] font-bold text-white/40">
              {finishedCount}/{state.players.length} finished
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-6">
            {state.players.map((p, i) => (
              <PlayerSummary key={p.id} player={p} active={i === state.activePlayerIndex} />
            ))}
          </div>
        </div>

        {/* Active player's board */}
        <div className="mt-4">
          <PlayerBoard player={active} active freshSlot={freshSlot} />
        </div>

        {/* Dice + controls */}
        <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col items-center sm:items-start">
              <DiceRollAnimation
                rolling={state.rolling}
                value={state.lastRoll ?? 1}
                size={120}
              />
            </div>

            <div className="flex flex-1 flex-col items-center gap-3 sm:items-end">
              {/* Message */}
              <MessageBanner kind={messageKind} text={state.message} />

              <div className="flex w-full max-w-xs flex-col gap-2.5 sm:w-auto">
                <button
                  onClick={onRoll}
                  disabled={!canRoll}
                  className={`flex items-center justify-center gap-2 rounded-2xl px-8 py-5 text-xl font-extrabold text-white shadow-pop transition-all ${
                    canRoll
                      ? `bg-gradient-to-r ${color.gradient} hover:scale-[1.03] hover:shadow-glow active:scale-95 animate-glow`
                      : 'cursor-not-allowed bg-white/10 opacity-50'
                  }`}
                >
                  <Dices className="h-6 w-6" />
                  {state.rolling ? 'Rolling…' : 'ROLL DICE'}
                </button>

                <button
                  onClick={onPass}
                  disabled={!canPass}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-bold text-white/80 transition hover:bg-white/10 active:scale-95 disabled:opacity-30"
                >
                  Pass turn
                </button>
              </div>
            </div>
          </div>

          {/* Tiny rule reminder */}
          <p className="mt-3 text-center text-[11px] font-semibold text-white/40">
            Fill the first open matching slot, left to right. Match = roll again. No match = turn ends.
          </p>
        </div>

        {/* Finished players (others) */}
        {stillPlaying.length < state.players.length && (
          <div className="mt-5">
            <h3 className="mb-2 px-1 text-[10px] font-extrabold uppercase tracking-wider text-white/45">
              Other boards
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {state.players
                .filter((p) => p.id !== active.id)
                .map((p) => (
                  <PlayerBoard key={p.id} player={p} active={false} compact />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type MessageKind = 'idle' | 'good' | 'bad' | 'win';

function classifyMessage(msg: string): MessageKind {
  if (!msg) return 'idle';
  if (msg.includes('complete') || msg.includes('finished')) return 'win';
  if (msg.includes('ends') || msg.includes('already')) return 'bad';
  if (msg.includes('filled') || msg.includes('Roll again')) return 'good';
  return 'idle';
}

function MessageBanner({ kind, text }: { kind: MessageKind; text: string }) {
  if (!text) return <div className="min-h-[2.5rem]" />;
  const styles: Record<MessageKind, string> = {
    idle: 'bg-white/10 text-white/80',
    good: 'bg-felt-500/25 text-felt-200 border-felt-400/40',
    bad: 'bg-lucky-500/25 text-lucky-200 border-lucky-400/40',
    win: 'bg-gold-500/25 text-gold-200 border-gold-400/50',
  };
  return (
    <div
      key={text}
      className={`animate-floatUp rounded-xl border px-4 py-2.5 text-center text-sm font-extrabold ${styles[kind]}`}
    >
      {text}
    </div>
  );
}


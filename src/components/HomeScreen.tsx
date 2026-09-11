import { Dices, Users, Layers, Play, Sparkles } from 'lucide-react';
import { Dice } from './Dice';

interface HomeScreenProps {
  onNewGame: () => void;
}

export function HomeScreen({ onNewGame }: HomeScreenProps) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-felt-800 via-felt-900 to-felt-950 px-6 py-10">
      {/* decorative glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-lucky-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-gold-500/15 blur-3xl" />

      {/* floating mini dice */}
      <div className="pointer-events-none absolute left-8 top-24 opacity-40 animate-floatUp">
        <Dice value={5} rolling={false} size={48} />
      </div>
      <div className="pointer-events-none absolute right-10 top-40 opacity-40">
        <Dice value={3} rolling={false} size={40} />
      </div>
      <div className="pointer-events-none absolute bottom-28 left-12 opacity-30">
        <Dice value={1} rolling={false} size={36} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-6 animate-bannerIn">
          <div className="flex items-center justify-center">
            <Dice value={6} rolling={false} size={96} />
          </div>
        </div>

        <h1 className="font-display text-5xl font-bold tracking-tight text-white sm:text-7xl">
          <span className="bg-gradient-to-b from-gold-200 to-gold-500 bg-clip-text text-transparent">
            Lucky
          </span>{' '}
          <span className="bg-gradient-to-b from-white to-felt-200 bg-clip-text text-transparent">
            Ludu
          </span>
        </h1>

        <p className="mt-4 max-w-sm text-base font-semibold text-white/70 sm:text-lg">
          Roll the dice, fill your folds, and race to be the first to cover every number. Pure luck,
          pure fun.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <button
            onClick={onNewGame}
            className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-lucky-400 to-lucky-600 px-8 py-4 text-lg font-extrabold text-white shadow-pop transition-all hover:scale-105 hover:shadow-glow active:scale-95"
          >
            <Play className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            New Game
          </button>
        </div>

        <div className="mt-10 grid w-full max-w-md grid-cols-3 gap-3">
          <Feature icon={<Users className="h-5 w-5" />} label="2–6 players" />
          <Feature icon={<Layers className="h-5 w-5" />} label="1–6 folds" />
          <Feature icon={<Sparkles className="h-5 w-5" />} label="Offline play" />
        </div>

        <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-white/40">
          <Dices className="h-4 w-4" />
          Pass-and-play · single device · no internet needed
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-2 py-3">
      <span className="text-gold-300">{icon}</span>
      <span className="text-xs font-bold text-white/80">{label}</span>
    </div>
  );
}

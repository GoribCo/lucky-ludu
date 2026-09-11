import { useEffect, useMemo, useState } from 'react';
import type { GameConfig, GameState, Player, PlayerRanking } from '@/game/types';
import {
  applyRoll,
  computeRankings,
  createPlayers,
  defaultConfig,
  isBoardComplete,
  rollDice,
  RollOutcome,
} from '@/game/engine';
import { HomeScreen } from '@/components/HomeScreen';
import { GameSetup } from '@/components/GameSetup';
import { GameBoard } from '@/components/GameBoard';
import { GameResults } from '@/components/GameResults';
import { Confetti } from '@/components/Confetti';

function freshInitialState(): GameState {
  return {
    status: 'home',
    players: [],
    activePlayerIndex: 0,
    turnNumber: 1,
    rankings: [],
    lastRoll: null,
    message: '',
    rolling: false,
    foldCount: 3,
  };
}

function nextActiveIndex(players: Player[], from: number): number {
  for (let i = 1; i <= players.length; i += 1) {
    const idx = (from + i) % players.length;
    if (!players[idx].finished) return idx;
  }
  return from;
}

export default function App() {
  const [state, setState] = useState<GameState>(freshInitialState);
  const [config, setConfig] = useState<GameConfig>(defaultConfig);
  const [freshSlot, setFreshSlot] = useState<[number, number] | null>(null);
  const [celebrate, setCelebrate] = useState(false);

  const startSetup = () =>
    setState((s) => ({ ...s, status: 'setup' }));

  const cancelSetup = () =>
    setState((s) => ({ ...s, status: 'home' }));

  const startGame = (cfg: GameConfig) => {
    setConfig(cfg);
    const players = createPlayers(cfg);
    setState({
      status: 'playing',
      players,
      activePlayerIndex: 0,
      turnNumber: 1,
      rankings: [],
      lastRoll: null,
      message: `${players[0].name}'s turn — roll the dice!`,
      rolling: false,
      foldCount: cfg.foldCount,
    });
    setFreshSlot(null);
  };

  const handleRoll = () => {
    if (state.rolling) return;
    const active = state.players[state.activePlayerIndex];
    if (!active || active.finished) return;

    const roll = rollDice();

    setState((s) => ({ ...s, rolling: true, lastRoll: roll, message: '' }));

    window.setTimeout(() => {
      setState((s) => {
        const players = s.players.map((p) =>
          p.id === active.id ? structuredClonePlayer(p) : p
        ) as Player[];
        const target = players[s.activePlayerIndex];
        const outcome: RollOutcome = applyRoll(target, roll);

        setFreshSlot(outcome.slot);

        // finished this roll?
        if (outcome.finished) {
          target.finished = true;
          target.finishedAtTurn = s.turnNumber;
        }

        const allDone = players.every((p) => p.finished);

        if (allDone) {
          return {
            ...s,
            players,
            rolling: false,
            lastRoll: roll,
            message: outcome.message,
            rankings: computeRankings(players),
            status: 'results',
          };
        }

        if (outcome.rollAgain && !outcome.finished) {
          return {
            ...s,
            players,
            rolling: false,
            lastRoll: roll,
            message: outcome.message,
          };
        }

        // turn ends → advance to next unfinished player
        const nextIdx = nextActiveIndex(players, s.activePlayerIndex);
        const advancedTurn = nextIdx <= s.activePlayerIndex ? s.turnNumber + 1 : s.turnNumber;
        const nextName = players[nextIdx].name;
        return {
          ...s,
          players,
          rolling: false,
          lastRoll: roll,
          message: `${outcome.message} ${nextName}, you're up!`,
          activePlayerIndex: nextIdx,
          turnNumber: advancedTurn,
        };
      });
    }, 1000);
  };

  const handlePass = () => {
    setState((s) => {
      if (s.rolling) return s;
      const active = s.players[s.activePlayerIndex];
      if (!active || active.finished) return s;
      const nextIdx = nextActiveIndex(s.players, s.activePlayerIndex);
      const advancedTurn = nextIdx <= s.activePlayerIndex ? s.turnNumber + 1 : s.turnNumber;
      return {
        ...s,
        lastRoll: null,
        message: `${s.players[nextIdx].name}'s turn — roll the dice!`,
        activePlayerIndex: nextIdx,
        turnNumber: advancedTurn,
      };
    });
    setFreshSlot(null);
  };

  // Celebrate when results screen appears
  useEffect(() => {
    if (state.status === 'results') {
      setCelebrate(true);
      const t = window.setTimeout(() => setCelebrate(false), 5000);
      return () => window.clearTimeout(t);
    }
  }, [state.status]);

  const playAgain = () => {
    // same config, fresh boards
    startGame(config);
  };

  const newGame = () => {
    setState(freshInitialState());
  };

  const quitToSetup = () => {
    setState((s) => ({ ...s, status: 'setup' }));
  };

  const screen = state.status;
  const activePlayer = state.players[state.activePlayerIndex];
  const rankings: PlayerRanking[] = useMemo(
    () => (state.status === 'results' ? state.rankings : []),
    [state.status, state.rankings]
  );

  return (
    <>
      {screen === 'home' && <HomeScreen onNewGame={startSetup} />}
      {screen === 'setup' && (
        <GameSetup initial={config} onCancel={cancelSetup} onStart={startGame} />
      )}
      {screen === 'playing' && activePlayer && (
        <GameBoard
          state={state}
          freshSlot={freshSlot}
          onRoll={handleRoll}
          onPass={handlePass}
          onQuit={quitToSetup}
          onHome={newGame}
        />
      )}
      {screen === 'results' && rankings.length > 0 && (
        <>
          {celebrate && <Confetti />}
          <GameResults rankings={rankings} onPlayAgain={playAgain} onNewGame={newGame} />
        </>
      )}
    </>
  );
}

function structuredClonePlayer(p: Player): Player {
  return {
    ...p,
    folds: p.folds.map((f) => ({
      id: f.id,
      slots: f.slots.map((s) => ({ ...s })),
    })),
  };
}

import type {
  DiceFace,
  DiceResult,
  Fold,
  GameConfig,
  Player,
  PlayerRanking,
  Slot,
} from './types';
import { FOLD_VALUES, MAX_FOLDS, MAX_PLAYERS, MIN_FOLDS, MIN_PLAYERS } from './constants';

let idCounter = 0;
export function uid(prefix = 'id'): string {
  idCounter += 1;
  return `${prefix}-${idCounter}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createFolds(foldCount: number): Fold[] {
  const folds: Fold[] = [];
  for (let f = 0; f < foldCount; f += 1) {
    const slots: Slot[] = FOLD_VALUES.map((value) => ({ value, filled: false }));
    folds.push({ id: f, slots });
  }
  return folds;
}

export function createPlayers(config: GameConfig): Player[] {
  const safeCount = clamp(config.playerCount, MIN_PLAYERS, MAX_PLAYERS);
  const safeFolds = clamp(config.foldCount, MIN_FOLDS, MAX_FOLDS);
  return Array.from({ length: safeCount }, (_, i) => ({
    id: uid('p'),
    name: config.playerNames[i]?.trim() || `Player ${i + 1}`,
    colorIndex: i,
    folds: createFolds(safeFolds),
    finished: false,
    finishedAtTurn: null,
    coinsPlaced: 0,
    rollsTaken: 0,
  }));
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function rollDice(): DiceResult {
  return (Math.floor(Math.random() * 6) + 1) as DiceResult;
}

/**
 * First available matching slot scanning folds left-to-right, slots in order.
 * Returns [foldIndex, slotIndex] or null when the number is fully filled.
 */
export function findFirstOpenSlot(player: Player, value: DiceFace): [number, number] | null {
  for (let f = 0; f < player.folds.length; f += 1) {
    const slots = player.folds[f].slots;
    for (let s = 0; s < slots.length; s += 1) {
      if (slots[s].value === value && !slots[s].filled) {
        return [f, s];
      }
    }
  }
  return null;
}

export function countFilled(player: Player): number {
  let n = 0;
  for (const fold of player.folds) {
    for (const slot of fold.slots) {
      if (slot.filled) n += 1;
    }
  }
  return n;
}

export function totalSlots(player: Player): number {
  return player.folds.length * FOLD_VALUES.length;
}

export function isBoardComplete(player: Player): boolean {
  return countFilled(player) === totalSlots(player);
}

/**
 * Attempt to place a coin for the rolled value.
 * Returns the outcome the UI should act on.
 */
export interface RollOutcome {
  roll: DiceResult;
  placed: boolean;
  /** true when a coin was placed and the player may roll again */
  rollAgain: boolean;
  /** true when the board was completed by this roll */
  finished: boolean;
  message: string;
  /** [foldIndex, slotIndex] of the placed coin, or null if not placed */
  slot: [number, number] | null;
}

export function applyRoll(player: Player, roll: DiceResult): RollOutcome {
  player.rollsTaken += 1;
  const target = findFirstOpenSlot(player, roll);

  if (!target) {
    return {
      roll,
      placed: false,
      rollAgain: false,
      finished: false,
      message: `All ${roll}s are already filled. Turn ends.`,
      slot: null,
    };
  }

  const [f, s] = target;
  player.folds[f].slots[s].filled = true;
  player.coinsPlaced += 1;
  const placedSlot: [number, number] = [f, s];

  const justFinished = isBoardComplete(player);
  if (justFinished) {
    return {
      roll,
      placed: true,
      rollAgain: false,
      finished: true,
      message: `Board complete! ${player.name} finished!`,
      slot: placedSlot,
    };
  }

  return {
    roll,
    placed: true,
    rollAgain: true,
    finished: false,
    message: `${roll} filled! Roll again`,
    slot: placedSlot,
  };
}

/**
 * Compute final rankings. Players who finished are ordered by finish turn;
 * those who did not finish are ordered by most coins placed, then by name.
 */
export function computeRankings(players: Player[]): PlayerRanking[] {
  const enriched = players.map((p) => ({ p, filled: countFilled(p), total: totalSlots(p) }));
  enriched.sort((a, b) => {
    const aDone = a.p.finished;
    const bDone = b.p.finished;
    if (aDone && bDone) {
      const at = a.p.finishedAtTurn ?? Infinity;
      const bt = b.p.finishedAtTurn ?? Infinity;
      if (at !== bt) return at - bt;
    }
    if (aDone && !bDone) return -1;
    if (!aDone && bDone) return 1;
    if (a.filled !== b.filled) return b.filled - a.filled;
    return a.p.name.localeCompare(b.p.name);
  });

  let rank = 0;
  return enriched.map((e) => {
    rank += 1;
    return { player: e.p, rank, totalSlots: e.total, filledSlots: e.filled };
  });
}

export function defaultConfig(): GameConfig {
  return {
    playerCount: 2,
    foldCount: 3,
    playerNames: ['Player 1', 'Player 2'],
  };
}

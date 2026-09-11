export type GameStatus = 'home' | 'setup' | 'playing' | 'results';

export type DiceFace = 1 | 2 | 3 | 4 | 5 | 6;

export type DiceResult = DiceFace;

export interface Slot {
  value: DiceFace;
  filled: boolean;
}

export interface Fold {
  id: number;
  slots: Slot[];
}

export interface Player {
  id: string;
  name: string;
  colorIndex: number;
  folds: Fold[];
  finished: boolean;
  /** Turn number (1-based) when the player finished, for ranking tie-break. */
  finishedAtTurn: number | null;
  /** Total coins placed, used for stats on the results screen. */
  coinsPlaced: number;
  /** Total dice rolls taken by this player. */
  rollsTaken: number;
}

export type Screen = Exclude<GameStatus, 'home'> | 'home';

export interface PlayerRanking {
  player: Player;
  rank: number;
  totalSlots: number;
  filledSlots: number;
}

export interface GameState {
  status: GameStatus;
  players: Player[];
  activePlayerIndex: number;
  turnNumber: number;
  rankings: PlayerRanking[];
  /** Latest dice value rolled, null at the start of a turn. */
  lastRoll: DiceResult | null;
  /** Human-readable feedback for the most recent action. */
  message: string;
  /** Whether the dice is currently animating. */
  rolling: boolean;
  /** The number of folds configured for this game. */
  foldCount: number;
}

export interface GameConfig {
  playerCount: number;
  foldCount: number;
  playerNames: string[];
}

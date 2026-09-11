import type { DiceFace } from './types';

export const DICE_VALUES: readonly DiceFace[] = [1, 2, 3, 4, 5, 6] as const;

export const FOLD_VALUES: readonly DiceFace[] = DICE_VALUES;

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 6;

export const MIN_FOLDS = 1;
export const MAX_FOLDS = 6;

/** Vibrant player colors — each is a full ramp anchor used across the UI. */
export interface PlayerColor {
  name: string;
  text: string;
  bg: string;
  bgSoft: string;
  ring: string;
  gradient: string;
  solid: string;
  border: string;
}

export const PLAYER_COLORS: PlayerColor[] = [
  {
    name: 'Coral',
    text: 'text-lucky-600',
    bg: 'bg-lucky-500',
    bgSoft: 'bg-lucky-100',
    ring: 'ring-lucky-400',
    gradient: 'from-lucky-400 to-lucky-600',
    solid: '#f43f6a',
    border: 'border-lucky-300',
  },
  {
    name: 'Emerald',
    text: 'text-felt-600',
    bg: 'bg-felt-500',
    bgSoft: 'bg-felt-100',
    ring: 'ring-felt-400',
    gradient: 'from-felt-400 to-felt-600',
    solid: '#229c6a',
    border: 'border-felt-300',
  },
  {
    name: 'Gold',
    text: 'text-gold-700',
    bg: 'bg-gold-500',
    bgSoft: 'bg-gold-100',
    ring: 'ring-gold-400',
    gradient: 'from-gold-300 to-gold-600',
    solid: '#efad1f',
    border: 'border-gold-300',
  },
  {
    name: 'Sky',
    text: 'text-sky-600',
    bg: 'bg-sky-500',
    bgSoft: 'bg-sky-100',
    ring: 'ring-sky-400',
    gradient: 'from-sky-400 to-sky-600',
    solid: '#0ea5e9',
    border: 'border-sky-300',
  },
  {
    name: 'Violet',
    text: 'text-violet-600',
    bg: 'bg-violet-500',
    bgSoft: 'bg-violet-100',
    ring: 'ring-violet-400',
    gradient: 'from-violet-400 to-violet-600',
    solid: '#8b5cf6',
    border: 'border-violet-300',
  },
  {
    name: 'Amber',
    text: 'text-amber-600',
    bg: 'bg-amber-500',
    bgSoft: 'bg-amber-100',
    ring: 'ring-amber-400',
    gradient: 'from-amber-400 to-amber-600',
    solid: '#f59e0b',
    border: 'border-amber-300',
  },
];

export function playerColor(index: number): PlayerColor {
  return PLAYER_COLORS[index % PLAYER_COLORS.length];
}

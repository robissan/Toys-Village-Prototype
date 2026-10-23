import type { ToyColor } from '../gameData';

/**
 * Rising tempo for the Time Game.
 * The first toy stays at 0.92. Each later toy adds 0.052, capped at 1.18.
 * Steady tempo is not folded in here: callers use rateFor so both modes stay testable.
 */
export function tempoFor(count: number): number {
  return Math.min(1.18, 0.92 + Math.max(0, count - 1) * 0.052);
}

/** Steady tempo locks playback at 1. Otherwise the rising curve from tempoFor is used. */
export function rateFor(count: number, steadyTempo: boolean): number {
  return steadyTempo ? 1 : tempoFor(count);
}

/**
 * A toy that comes home stays home. The song is not a reversible checklist.
 */
export function applyPlacement(ids: readonly string[], toyId: string): string[] {
  if (ids.includes(toyId)) return [...ids];
  return [...ids, toyId];
}

export type ScanJudgment = 'accept' | 'reject';

export function judgeScan(toy: { color: ToyColor }, target: ToyColor): ScanJudgment {
  return toy.color === target ? 'accept' : 'reject';
}

/**
 * Pick the next Color Game target from toys still out.
 * Pass `random` in tests. An empty list has no target.
 */
export function nextTarget<T>(
  remaining: readonly T[],
  random: () => number = Math.random,
): T | null {
  if (remaining.length === 0) return null;
  const roll = random();
  const index = Math.min(
    remaining.length - 1,
    Math.max(0, Math.floor(roll * remaining.length)),
  );
  return remaining[index] ?? null;
}

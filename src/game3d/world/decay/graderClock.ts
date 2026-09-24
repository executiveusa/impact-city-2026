import type { GameSaveStateV2 } from "@/game/types";

/**
 * Grader-cycle clock + record decay (01-game-design §8, 02-narrative Ch3-5).
 * The clock advances on chapter beats, never on real time, so nobody is rushed.
 * 3 cycles at the end of Ch3, one per remaining chapter; Ch4 can speed it up.
 */
export const DECAY_ZONES = ["rustgarden-records", "npc-names", "archive"] as const;

/** Decay for a clock value: 3 -> 0, 2 -> 0.25, 1 -> 0.55, 0 -> 1. */
export function decayForClock(clock: number): number {
  const c = Math.min(3, Math.max(0, clock));
  return [1, 0.55, 0.25, 0][Math.round(c)];
}

/** Spend `cost` cycles (Chapter.clockCost) and recompute decay for every zone not yet restored. */
export function tickClock(s: GameSaveStateV2, cost: number, restored: string[] = []): GameSaveStateV2 {
  if (cost <= 0) return s;
  const graderClock = Math.max(0, s.graderClock - cost);
  const d = decayForClock(graderClock);
  const decay = { ...s.decay };
  for (const z of DECAY_ZONES) decay[z] = restored.includes(z) ? 0 : Math.max(decay[z] ?? 0, d);
  return { ...s, graderClock, decay };
}

/** A restore snaps colour back for a zone (the visible repair half of the loop). */
export function restoreZone(s: GameSaveStateV2, zone: string): GameSaveStateV2 {
  return { ...s, decay: { ...s.decay, [zone]: 0 } };
}

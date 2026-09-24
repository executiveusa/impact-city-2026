import { CHAPTER_ORDER } from "@/game/types";

/**
 * Cosmos ability unlocks (01-game-design §6). Unlocks follow chapter progress in the v2 save.
 * "afterComplete" means the ability arrives at the end of that chapter (Scout: "Ch2 end").
 */
export type AbilityId = "signalPing" | "scout" | "glyphTranslate" | "echoReveal" | "passageFlight" | "consentScan";

export const ABILITY_UNLOCK: Record<AbilityId, { chapter: (typeof CHAPTER_ORDER)[number]; afterComplete: boolean }> = {
  signalPing: { chapter: "ch1_compliance_gate", afterComplete: false },
  scout: { chapter: "ch2_poisoned_prompt", afterComplete: true },
  glyphTranslate: { chapter: "ch3_the_board", afterComplete: false },
  echoReveal: { chapter: "ch3_the_board", afterComplete: false },
  passageFlight: { chapter: "ch4_perma_death", afterComplete: false },
  consentScan: { chapter: "ch5_consent", afterComplete: false },
};

export function unlockedAbilities(currentChapterId: string, completedChapterIds: string[]): AbilityId[] {
  const cur = CHAPTER_ORDER.indexOf(currentChapterId as never);
  return (Object.keys(ABILITY_UNLOCK) as AbilityId[]).filter((id) => {
    const u = ABILITY_UNLOCK[id];
    if (u.afterComplete) return completedChapterIds.includes(u.chapter);
    return completedChapterIds.includes(u.chapter) || CHAPTER_ORDER.indexOf(u.chapter) <= cur;
  });
}

/**
 * Consent Scan: what a system asks for vs what it needs (bar graph over the object).
 * Levels: 0 none, 1 "you are here now", 2 today's movement, 3 full history / memories.
 */
export interface ConsentReading {
  optionId: string;
  asks: number;
  needs: number;
}

export const M3_CONSENT: ConsentReading[] = [
  { optionId: "m3_gatekeeper_full", asks: 3, needs: 1 },
  { optionId: "m3_gatekeeper_min", asks: 1, needs: 1 },
  { optionId: "m3_memory_harvest", asks: 3, needs: 0 },
];

/** Overreach = how far the ask exceeds the need. The minimal-access pick is the one with zero overreach. */
export function overreach(r: ConsentReading): number {
  return Math.max(0, r.asks - r.needs);
}

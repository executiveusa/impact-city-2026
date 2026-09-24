import type { GameSaveState, GameSaveStateV2 } from "@/game/types";
import { CHAPTER_ORDER } from "@/game/types";
import { createInitialState } from "@/game/state/saveEngine";

/**
 * Save schema v2 for the 3D episode (05-technical-architecture §5).
 * Forward-only migration from v1. The 2D /game keeps using v1 under its own key,
 * so nothing here can break the fallback route.
 */
export const V1_KEY = "impact_city_save_v1";
export const V2_KEY = "impact_city_save_v2";

/** v1 mission -> v2 chapter (spec: completed missions map to chapters 1 / 2 / 5). */
export const MISSION_TO_CHAPTER: Record<string, string> = {
  m1_compliance_gate: "ch1_compliance_gate",
  m2_poisoned_prompt: "ch2_poisoned_prompt",
  m3_consent_tablet: "ch5_consent",
};

export function createInitialV2(): GameSaveStateV2 {
  const { version: _v, ...v1 } = createInitialState();
  return {
    ...v1,
    version: 2,
    chapterId: CHAPTER_ORDER[0],
    encounterIndex: 0,
    completedChapterIds: [],
    flags: {},
    evidence: [],
    visionPaths: {},
    graderClock: 3,
    decay: {},
    settings: { stopMotion: true, quality: "med", assistTiming: 1 },
  };
}

function firstIncomplete(done: string[]): string {
  return CHAPTER_ORDER.find((c) => !done.includes(c)) ?? CHAPTER_ORDER[CHAPTER_ORDER.length - 1];
}

export function migrateV1(v1: Partial<GameSaveState>): GameSaveStateV2 {
  const base = createInitialV2();
  const { version: _v, ...rest } = v1;
  const completedChapterIds = [
    ...new Set((v1.completedMissionIds ?? []).map((m) => MISSION_TO_CHAPTER[m]).filter((c): c is string => !!c)),
  ].sort((a, b) => CHAPTER_ORDER.indexOf(a as never) - CHAPTER_ORDER.indexOf(b as never));
  return {
    ...base,
    ...rest,
    version: 2,
    completedChapterIds,
    chapterId: firstIncomplete(completedChapterIds),
    encounterIndex: 0,
    evidence: [],
    graderClock: 3,
  };
}

/** Accepts anything parsed from storage; always returns a valid v2 save. */
export function normalizeV2(raw: unknown): GameSaveStateV2 {
  if (!raw || typeof raw !== "object") return createInitialV2();
  const s = raw as Partial<GameSaveStateV2> & { version?: number };
  if (s.version !== 2) return migrateV1(s as Partial<GameSaveState>);
  const base = createInitialV2();
  const merged: GameSaveStateV2 = { ...base, ...s, settings: { ...base.settings, ...(s.settings ?? {}) }, version: 2 };
  if (!CHAPTER_ORDER.includes(merged.chapterId as never)) merged.chapterId = firstIncomplete(merged.completedChapterIds);
  merged.encounterIndex = Math.max(0, Math.floor(Number(merged.encounterIndex) || 0));
  merged.graderClock = Math.min(3, Math.max(0, Number(merged.graderClock)));
  return merged;
}

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
const store = (): StorageLike | null => (typeof window === "undefined" ? null : window.localStorage);

export function loadV2(storage: StorageLike | null = store()): GameSaveStateV2 {
  if (!storage) return createInitialV2();
  try {
    const v2 = storage.getItem(V2_KEY);
    if (v2) return normalizeV2(JSON.parse(v2));
    const v1 = storage.getItem(V1_KEY);
    if (v1) return migrateV1(JSON.parse(v1));
  } catch {
    /* corrupt save: start fresh rather than crash */
  }
  return createInitialV2();
}

export function persistV2(state: GameSaveStateV2, storage: StorageLike | null = store()): void {
  try {
    storage?.setItem(V2_KEY, JSON.stringify(state));
  } catch {
    /* quota / private mode */
  }
}

/** Auto-save at encounter boundaries (01-game-design §11). */
export function advanceEncounter(s: GameSaveStateV2, encounterCount: number): GameSaveStateV2 {
  const next = s.encounterIndex + 1;
  if (next < encounterCount) return { ...s, encounterIndex: next };
  const completedChapterIds = s.completedChapterIds.includes(s.chapterId) ? s.completedChapterIds : [...s.completedChapterIds, s.chapterId];
  return { ...s, completedChapterIds, chapterId: firstIncomplete(completedChapterIds), encounterIndex: 0 };
}

import type { GameSaveState } from "../types";
import { MISSION_ORDER } from "../types";
import { STARTER_CODEX_IDS } from "../data/codex";

/**
 * Save Engine — persistence layer for game progress.
 *
 * Uses localStorage (spec §6 Save System). The shape is forward-compatible:
 * bump VERSION and migrate in `migrate()` when the schema changes.
 */

const STORAGE_KEY = "impact_city_save_v1";
export const SAVE_VERSION = 1;

export function createInitialState(playerId = "thomas"): GameSaveState {
  return {
    version: SAVE_VERSION,
    playerId,
    screen: "menu",
    currentMissionId: MISSION_ORDER[0] ?? null,
    completedMissionIds: [],
    unlockedCodexIds: [...STARTER_CODEX_IDS],
    unlockedTablets: [],
    civicTrust: 0,
    scrap: 0,
    rebuiltAssetIds: [],
    impactEvents: [],
    introSeen: false,
    reducedMotion: false,
    simpleLanguage: false,
    subtitles: true,
  };
}

/** Forward-only migration. Add cases as VERSION bumps. */
function migrate(raw: unknown): GameSaveState {
  // Basic shape guard.
  if (!raw || typeof raw !== "object") return createInitialState();
  const s = raw as Partial<GameSaveState>;
  const base = createInitialState(s.playerId ?? "thomas");
  // Merge defensively so missing fields from older saves are filled in.
  return { ...base, ...s, version: SAVE_VERSION } as GameSaveState;
}

export function loadSave(): GameSaveState {
  if (typeof window === "undefined") return createInitialState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    return migrate(JSON.parse(raw));
  } catch {
    // Corrupt save — start fresh rather than crash.
    return createInitialState();
  }
}

export function persistSave(state: GameSaveState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota / private mode — fail silently; in-memory state still works.
  }
}

export function clearSave(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* no-op */
  }
}

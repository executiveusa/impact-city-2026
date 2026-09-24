import { create } from "zustand";
import type { GameSaveStateV2 } from "@/game/types";
import { MISSION_BY_ID } from "@/game/data/missions";
import { EPISODE, chapterById, type Encounter, type EpisodeChapter } from "../narrative/episode";
import { resolveEnding, type EndingVariant, type WickOutcome } from "../narrative/branches";
import { createInitialV2, loadV2, persistV2 } from "../state/saveV2";
import { restoreZone, tickClock, DECAY_ZONES } from "../world/decay/graderClock";
import { recordImpactEvent } from "@/game/systems/impactEngine";
import { soundManager } from "@/game/audio/soundManager";
import { BARKS, pick } from "../cosmos/barks";

/** Episode store: drives all 5 chapters from narrative/episode.ts and persists to save v2. */
interface Subtitle {
  speaker: string;
  text: string;
  until: number;
}

interface EpisodeState {
  save: GameSaveStateV2;
  overlayOpen: boolean;
  near: string | null;
  pingUntil: number;
  /** Glyph Translate is primed by a Signal Ping during the current encounter. */
  translated: boolean;
  subtitle: Subtitle | null;
  sting: EpisodeChapter | null;
  ending: EndingVariant | null;
  chapter: () => EpisodeChapter | null;
  current: () => Encounter | null;
  currentEncounterId: () => string | null;
  say: (speaker: string, text: string, ms?: number) => void;
  setNear: (id: string | null) => void;
  open: () => void;
  close: () => void;
  ping: () => void;
  setFlag: (k: string, v: string | number | boolean) => void;
  addEvidence: (ids: string[]) => void;
  completeEncounter: () => void;
  dismissSting: () => void;
  restart: () => void;
}

const done = (s: GameSaveStateV2) => EPISODE.every((c) => s.completedChapterIds.includes(c.id));

export const useEpisode = create<EpisodeState>((set, get) => ({
  save: loadV2(),
  overlayOpen: false,
  near: null,
  pingUntil: 0,
  translated: false,
  subtitle: null,
  sting: null,
  ending: null,
  chapter: () => {
    const s = get().save;
    if (done(s)) return null;
    return chapterById(s.chapterId) ?? EPISODE.find((c) => !s.completedChapterIds.includes(c.id)) ?? null;
  },
  current: () => {
    const ch = get().chapter();
    return ch ? ch.encounters[get().save.encounterIndex] ?? null : null;
  },
  currentEncounterId: () => get().current()?.id ?? null,
  say: (speaker, text, ms = 4500) => set({ subtitle: { speaker, text, until: performance.now() + ms } }),
  setNear: (id) => get().near !== id && set({ near: id }),
  open: () => {
    const cur = get().currentEncounterId();
    if (cur && get().near === cur) {
      soundManager.resume();
      soundManager.play("ui_hover_soft");
      set({ overlayOpen: true });
    }
  },
  close: () => set({ overlayOpen: false }),
  ping: () => {
    soundManager.resume();
    soundManager.play("cosmos_signal_ping");
    const cur = get().current();
    set({ pingUntil: performance.now() + 6000, translated: get().translated || (!!cur && get().near === cur.id) });
    get().say("Cosmos", pick(cur ? BARKS.pingFound : BARKS.pingNothing), 3500);
  },
  setFlag: (k, v) => {
    const save = { ...get().save, flags: { ...get().save.flags, [k]: v } };
    persistV2(save);
    set({ save });
  },
  addEvidence: (ids) => {
    const save = { ...get().save, evidence: [...new Set([...get().save.evidence, ...ids])] };
    persistV2(save);
    set({ save });
  },
  completeEncounter: () => {
    const s = get().save;
    const ch = get().chapter();
    const enc = get().current();
    if (!ch || !enc) return;
    let next: GameSaveStateV2 = { ...s, evidence: [...new Set([...s.evidence, ...(enc.evidence ?? [])])] };
    const last = s.encounterIndex + 1 >= ch.encounters.length;
    if (!last) {
      next = { ...next, encounterIndex: s.encounterIndex + 1 };
      soundManager.play("ui_confirm_restore");
      persistV2(next);
      set({ save: next, overlayOpen: false, translated: false });
      return;
    }
    // Chapter complete: rewards, simulated impact, grader clock, move on.
    const m = ch.missionId ? MISSION_BY_ID[ch.missionId] : undefined;
    const completedChapterIds = [...new Set([...next.completedChapterIds, ch.id])];
    const upcoming = EPISODE.find((c) => !completedChapterIds.includes(c.id));
    next = {
      ...next,
      completedChapterIds,
      chapterId: upcoming?.id ?? ch.id,
      encounterIndex: 0,
      completedMissionIds: m ? [...new Set([...next.completedMissionIds, m.id])] : next.completedMissionIds,
      civicTrust: next.civicTrust + (m?.rewards.civicTrust ?? 1),
      scrap: next.scrap + (m?.rewards.scrap ?? 5),
      impactEvents: [...next.impactEvents, ...(m?.impactEvents ?? []).map((t) => recordImpactEvent(t, s.playerId))],
    };
    next = tickClock(next, ch.clockCost);
    let ending: EndingVariant | null = null;
    if (!upcoming) {
      // Finale: Consent restored. How much of the district comes back depends on Wick.
      const wick = (next.flags.wick_outcome as WickOutcome) ?? "W3";
      ending = resolveEnding(wick, next.evidence);
      next = { ...next, flags: { ...next.flags, ending } };
      const keepGrey = ending === "E-B" ? ["npc-names"] : ending === "E-C" ? ["rustgarden-records", "npc-names"] : [];
      for (const z of DECAY_ZONES) if (!keepGrey.includes(z)) next = restoreZone(next, z);
    }
    soundManager.play("mission_complete_restore");
    persistV2(next);
    set({ save: next, overlayOpen: false, translated: false, sting: ch, ending });
  },
  dismissSting: () => {
    const ch = get().chapter();
    set({ sting: null });
    if (ch) setTimeout(() => get().say(ch.intro.speaker, ch.intro.line, 7000), 300);
  },
  restart: () => {
    const save = createInitialV2();
    persistV2(save);
    set({ save, sting: null, ending: null, overlayOpen: false, translated: false });
    const ch = get().chapter();
    if (ch) get().say(ch.intro.speaker, ch.intro.line, 7000);
  },
}));

/** Back-compat alias for Phase 1 components. */
export const useCh1 = useEpisode;

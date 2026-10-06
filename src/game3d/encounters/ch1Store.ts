import { create } from "zustand";
import type { GameSaveStateV2 } from "@/game/types";
import { MISSIONS } from "@/game/data/missions";
import { CHAPTERS } from "../narrative/chapters";
import { EVIDENCE } from "../narrative/evidence";
import { advanceEncounter, loadV2, persistV2 } from "../state/saveV2";
import { recordImpactEvent } from "@/game/systems/impactEngine";
import { soundManager } from "@/game/audio/soundManager";
import { BARKS, pick } from "../cosmos/barks";

export const CH1 = CHAPTERS[0];
export const M1 = MISSIONS.find((m) => m.id === CH1.missionId)!;

/** Which Ch1 prop hosts which encounter. */
export const ENCOUNTER_PROP: Record<string, "terminal" | "kiosk" | "gate"> = {
  m1_o1: "terminal", // three citizen records on the Warden terminal
  m1_o2: "kiosk", // the dark appeal terminal
  m1_o3: "gate", // the Compliance Gate rule choice
};

interface Subtitle {
  speaker: string;
  text: string;
  until: number;
}

interface Ch1State {
  save: GameSaveStateV2;
  overlayOpen: boolean;
  near: string | null;
  pingUntil: number;
  subtitle: Subtitle | null;
  sting: boolean;
  currentEncounterId: () => string | null;
  say: (speaker: string, text: string, ms?: number) => void;
  setNear: (id: string | null) => void;
  open: () => void;
  close: () => void;
  ping: () => void;
  completeEncounter: () => void;
  dismissSting: () => void;
}

export const useCh1 = create<Ch1State>((set, get) => ({
  save: loadV2(),
  overlayOpen: false,
  near: null,
  pingUntil: 0,
  subtitle: null,
  sting: false,
  currentEncounterId: () => {
    const s = get().save;
    if (s.completedChapterIds.includes(CH1.id)) return null;
    return CH1.encounters[s.encounterIndex] ?? null;
  },
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
    set({ pingUntil: performance.now() + 6000 });
    const cur = get().currentEncounterId();
    get().say("Cosmos", pick(cur ? BARKS.pingFound : BARKS.pingNothing), 3500);
  },
  completeEncounter: () => {
    const s = get().save;
    let next = advanceEncounter(s, CH1.encounters.length);
    const finished = next.completedChapterIds.includes(CH1.id) && !s.completedChapterIds.includes(CH1.id);
    if (finished) {
      // Existing M1 rewards + impact events (always "simulated" via impactEngine).
      const events = M1.impactEvents.map((t) => recordImpactEvent(t, s.playerId));
      next = {
        ...next,
        completedMissionIds: [...new Set([...next.completedMissionIds, M1.id])],
        civicTrust: next.civicTrust + M1.rewards.civicTrust,
        scrap: next.scrap + M1.rewards.scrap,
        impactEvents: [...next.impactEvents, ...events],
        evidence: [...new Set([...next.evidence, EVIDENCE["E-RECORD-EDIT"].id])],
      };
      soundManager.play("mission_complete_restore");
    } else {
      soundManager.play("ui_confirm_restore");
    }
    persistV2(next);
    set({ save: next, overlayOpen: false, sting: finished });
  },
  dismissSting: () => set({ sting: false }),
}));

/**
 * Impact City: The Emerald Algorithm — Core Type Definitions
 *
 * Canonical story-bible anchors enforced by these types:
 *  - Earth 2056, The Great Override
 *  - Thomas (young protagonist), Dr. Frankenstack (missing architect)
 *  - PANOPTICON / The Warden Stack (distributed machine regime)
 *  - Emerald Tablets (fragments of a human-aligned restoration algorithm)
 *  - Rustgarden (first district), First Tablet = Consent
 *
 * All impact events are SIMULATED in the MVP. See impact-economy-integrator.
 */

// ---------------------------------------------------------------------------
// Impact Economy
// ---------------------------------------------------------------------------

/** Real-world cause categories that in-game actions map to. */
export type RealWorldCause = "food" | "water" | "energy" | "shelter" | "education";

/**
 * Verification status of an impact event.
 *
 * MVP INVARIANT: every event is `simulated`. The other statuses exist as
 * future-ready hooks (Stripe test mode, partner verification, etc.) and must
 * NEVER be claimed without a real integration. See impact-engine.ts.
 */
export type ImpactStatus = "simulated" | "pending_payment" | "verified" | "delivered";

export type ImpactActionType =
  | "MISSION_COMPLETE"
  | "ASSET_PURCHASE"
  | "CIVIC_REBUILD"
  | "DONATION_SIMULATED";

/**
 * The single shape of a positive in-game action that connects to real-world
 * impact tracking. Matches the spec in the main MVP prompt.
 */
export interface ImpactEvent {
  id: string;
  playerId: string;
  actionType: ImpactActionType;
  /** Optional in-game item this event refers to (asset id, mission id, etc). */
  inGameItem?: string;
  realWorldCause: RealWorldCause;
  /** Simulated amount in cents. Undefined for non-monetary mission events. */
  amountCents?: number;
  impactPoints: number;
  status: ImpactStatus;
  createdAt: string; // ISO timestamp
}

/** Template embedded in mission rewards; resolved into a full ImpactEvent. */
export interface ImpactEventTemplate {
  actionType: ImpactActionType;
  inGameItem?: string;
  realWorldCause: RealWorldCause;
  amountCents?: number;
  impactPoints: number;
}

// ---------------------------------------------------------------------------
// Missions
// ---------------------------------------------------------------------------

/**
 * Allowed nonviolent mechanic types. Disallowed (shooting, killing, gore,
 * weapon upgrades, violent takedowns, crime rewards, pay-to-win) are never
 * represented here by design — see nonviolent-mission-designer.
 */
export type ObjectiveKind =
  | "inspect" // read / examine records
  | "decode" // decipher scrambled data
  | "choose" // select the fair / safe option
  | "repair" // restore a broken system
  | "scan" // identify a dangerous fragment
  | "stealth" // avoid watcher lights
  | "reroute" // redirect a flow
  | "persuade" // community trust choice
  | "expose" // reveal a contradiction
  | "restore"; // bring a system back online

export interface Objective {
  id: string;
  kind: ObjectiveKind;
  prompt: string;
  /** Distractors + correct answers for choice-style objectives. */
  options?: ObjectiveOption[];
  /** For multi-step decode/scan objectives. */
  fragments?: string[];
  /** Id of the correct option (for choice objectives). */
  correctOptionId?: string;
  /** Codex line spoken by Milo-9 / Warden / Thomas on completion. */
  completeLine: string;
}

export interface ObjectiveOption {
  id: string;
  label: string;
  /** Short justification shown in the codex-style explanation. */
  rationale: string;
}

export interface Reward {
  civicTrust: number;
  scrap: number;
  /** Codex entry ids unlocked by completing this mission. */
  codexUnlocks: string[];
  /** Emerald Tablet principle unlocked, if any. */
  tabletUnlock?: TabletPrinciple;
}

/** The eight principles of the Emerald Algorithm. MVP unlocks: Consent. */
export type TabletPrinciple =
  | "consent"
  | "transparency"
  | "accountability"
  | "privacy"
  | "plurality"
  | "regeneration"
  | "community"
  | "human_override";

export interface Mission {
  id: string;
  title: string;
  summary: string;
  /** Real AI risk this mission teaches. */
  aiThreat: string;
  /** Hub location this mission is launched from. */
  district: string;
  objectives: Objective[];
  rewards: Reward;
  /** Impact events recorded on completion. */
  impactEvents: ImpactEventTemplate[];
  /** Opening narration beat. */
  briefing: string;
  /** Line spoken on success. */
  successLine: string;
}

// ---------------------------------------------------------------------------
// Codex
// ---------------------------------------------------------------------------

export interface CodexEntry {
  id: string;
  title: string;
  /** Plain-language explanation (age-appropriate). */
  explanation: string;
  inGame: string;
  inRealLife: string;
  saferSystem: string;
}

// ---------------------------------------------------------------------------
// Rebuild Assets
// ---------------------------------------------------------------------------

export interface RebuildAsset {
  id: string;
  name: string;
  description: string;
  realWorldCause: RealWorldCause;
  /** Scrap cost in-game. */
  scrapCost: number;
  /** Civic Trust required to unlock. */
  civicTrustRequired: number;
  impactPoints: number;
  /** Simulated funding equivalent in cents. */
  simulatedAmountCents: number;
  realWorldEquivalent: string;
}

// ---------------------------------------------------------------------------
// Save / Progression State
// ---------------------------------------------------------------------------

/** Game screens the GameShell routes between (internal state machine). */
export type GameScreen =
  | "menu"
  | "intro"
  | "hub"
  | "mission"
  | "codex"
  | "dashboard"
  | "rebuild"
  | "settings"
  | "finale";

export interface GameSaveState {
  version: number;
  playerId: string;
  screen: GameScreen;
  /** Id of the mission currently in progress / next to play. */
  currentMissionId: string | null;
  completedMissionIds: string[];
  unlockedCodexIds: string[];
  unlockedTablets: TabletPrinciple[];
  civicTrust: number;
  scrap: number;
  rebuiltAssetIds: string[];
  impactEvents: ImpactEvent[];
  introSeen: boolean;
  /** Accessibility / UX flags. */
  reducedMotion: boolean;
  simpleLanguage: boolean;
  subtitles: boolean;
}

// ---------------------------------------------------------------------------
// Mission progression order (see progressionEngine spec).
// ---------------------------------------------------------------------------
export const MISSION_ORDER = ["m1_compliance_gate", "m2_poisoned_prompt", "m3_consent_tablet"] as const;

// ---------------------------------------------------------------------------
// 3D Episode 1 additions (docs/specs/3d-game/05-technical-architecture.md §4).
// Extended, not replaced. ObjectiveKind has no combat variant: keep it that way.
// ---------------------------------------------------------------------------
export type EvidenceTier = "observed" | "reported" | "forecast" | "interpretation";

export interface EvidenceCard {
  id: string;
  claim: string;
  /** In-world source, never a real company or person. */
  source: string;
  tier: EvidenceTier;
  confidence: "high" | "med" | "low";
  codexId?: string;
}

/** Koontz 5-ratchet beat set (02-narrative §3). */
export interface ChapterBeat {
  hope: string;
  threat: string;
  partialWin: string;
  worse: string;
  openLoop: string;
}

export interface Chapter {
  id: string;
  title: string;
  missionId?: string;
  beats: ChapterBeat;
  encounters: string[];
  echoVisionId?: string;
  clockCost: number;
}

export interface BranchFlagSet {
  [flag: string]: string | number | boolean;
}

export interface GameSettingsV2 {
  stopMotion: boolean;
  quality: "low" | "med" | "high";
  /** 1 = normal timing, up to 3 = three times slower. */
  assistTiming: number;
}

export interface GameSaveStateV2 extends Omit<GameSaveState, "version"> {
  version: 2;
  chapterId: string;
  encounterIndex: number;
  completedChapterIds: string[];
  flags: BranchFlagSet;
  evidence: string[];
  visionPaths: Record<string, number[]>;
  /** Grader-cycle clock, 3 -> 0. */
  graderClock: number;
  /** Record decay per zone, 0..1. */
  decay: Record<string, number>;
  settings: GameSettingsV2;
}

export const CHAPTER_ORDER = ["ch1_compliance_gate", "ch2_poisoned_prompt", "ch3_the_board", "ch4_perma_death", "ch5_consent"] as const;

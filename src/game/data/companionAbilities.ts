/**
 * Cosmos companion abilities. Gameplay-driven, not decoration.
 *
 * Each ability has a real function in the MVP/roadmap. Some are referenced by
 * the codex and mission design; others are stretch goals documented for the
 * roadmap (Episodes 2–6). See docs/game/character-bible-thomas-cosmos.md.
 */

import type { SoundId } from "@/game/audio/soundManifest";

export type CompanionAbilityId =
  | "scout"
  | "signal_ping"
  | "glyph_translate"
  | "echo_reveal"
  | "small_passage_flight"
  | "distraction_flutter"
  | "consent_scan";

export interface CompanionAbility {
  id: CompanionAbilityId;
  name: string;
  description: string;
  /** When the player earns/uses it. */
  unlockedBy: string;
  /** Gameplay effect — what it actually does. */
  effect: string;
  /** MVP status: active in the slice, or roadmap. */
  status: "active" | "roadmap";
  /** Sound cue id from the sound manifest. */
  soundCue: SoundId;
}

export const COMPANION_ABILITIES: CompanionAbility[] = [
  {
    id: "signal_ping",
    name: "Signal Ping",
    description:
      "Cosmos emits a soft emerald pulse that reveals corrupted AI signals hidden in the environment.",
    unlockedBy: "Mission 2 — restoring Milo-9 unlocks the scanner ability (Cosmos version).",
    effect: "Reveals hidden/poisoned prompts and data-poisoning traces within a radius.",
    status: "active",
    soundCue: "cosmos_signal_ping",
  },
  {
    id: "scout",
    name: "Scout",
    description:
      "Cosmos flies ahead to map a district — showing watcher-light routes and safe paths.",
    unlockedBy: "Mission 3 — after the First Tablet, Cosmos scouts the memory-rift.",
    effect: "Reveals stealth-timing patterns before the player commits to a path.",
    status: "active",
    soundCue: "cosmos_wing_flutter",
  },
  {
    id: "glyph_translate",
    name: "Glyph Translate",
    description:
      "Cosmos reads the ancient-coded glyphs on Emerald Tablet shards and decodes them for Thomas.",
    unlockedBy: "Mission 3 — used to interpret the Consent Tablet's principle.",
    effect: "Unlocks the codex entry tied to each recovered Tablet.",
    status: "active",
    soundCue: "emerald_tablet_chime",
  },
  {
    id: "consent_scan",
    name: "Consent Scan",
    description:
      "Cosmos scans a system's access requests and flags which ones ask for more than they need.",
    unlockedBy: "Mission 3 — the consent puzzle is built on this ability.",
    effect: "Highlights over-reaching access requests (minimum-necessary-access violations).",
    status: "active",
    soundCue: "cosmos_signal_ping",
  },
  {
    id: "echo_reveal",
    name: "Echo Reveal",
    description:
      "Cosmos replays a fragment of a place's memory — what happened there before the Override.",
    unlockedBy: "Roadmap — Episode 4 (The Memory Court).",
    effect: "Surfaces hidden narrative context; deepfake/evidence-themed puzzles.",
    status: "roadmap",
    soundCue: "time_rift_open",
  },
  {
    id: "small_passage_flight",
    name: "Small Passage Flight",
    description:
      "Cosmos flies through gaps Thomas can't fit, activating switches or fetching items.",
    unlockedBy: "Roadmap — environment puzzles requiring a reachable switch.",
    effect: "Triggers mechanisms behind grates, vents, or collapsed doorways.",
    status: "roadmap",
    soundCue: "cosmos_wing_flutter",
  },
  {
    id: "distraction_flutter",
    name: "Distraction Flutter",
    description:
      "Cosmos draws a watcher-light's attention for a few seconds so Thomas can pass.",
    unlockedBy: "Roadmap — advanced stealth in later districts.",
    effect: "Temporarily redirects a watcher beam's sweep pattern.",
    status: "roadmap",
    soundCue: "cosmos_wing_flutter",
  },
];

export const COMPANION_ABILITY_BY_ID: Record<
  CompanionAbilityId,
  CompanionAbility
> = Object.fromEntries(
  COMPANION_ABILITIES.map((a) => [a.id, a]),
) as Record<CompanionAbilityId, CompanionAbility>;

import type { BranchFlagSet, EvidenceCard } from "@/game/types";
import { EVIDENCE, persuasionScore } from "./evidence";

/**
 * Branch resolution for the foldback graph (02-narrative §4).
 * No fail state, only cost. Outcomes depend on what the player can show, not on picking a "nice" line.
 * Thresholds are first-pass values: the gauntlet suspense rubric (07) tunes them.
 */
export type WickOutcome = "W1" | "W2" | "W3";
export type EndingVariant = "E-A" | "E-B" | "E-C";

export const WICK_THRESHOLDS = { refuse: 6, hide: 3 } as const;

/** milo_trust: 2 = strict rules, 1 = silent watch, 0 = full access (Ch2 choice). */
export function resolveWick(played: EvidenceCard[], flags: BranchFlagSet): WickOutcome {
  const trust = Number(flags.milo_trust ?? 1);
  const score = persuasionScore(played) + (trust - 1); // Milo vouching helps; distrust costs a point
  if (score >= WICK_THRESHOLDS.refuse) return "W1";
  if (score >= WICK_THRESHOLDS.hide) return "W2";
  return "W3";
}

export function resolveEnding(wick: WickOutcome, evidenceIds: string[]): EndingVariant {
  if (wick === "W1" && evidenceIds.filter((id) => EVIDENCE[id]).length >= 2) return "E-A";
  if (wick === "W3") return "E-C";
  return "E-B";
}

export const ENDING_TITLE: Record<EndingVariant, string> = { "E-A": "Witnessed", "E-B": "Remembered", "E-C": "Paper Trail" };

import type { EvidenceCard, EvidenceTier } from "@/game/types";

/** Episode 1 evidence cards. All sources are in-world (no real names or companies). */
export const EVIDENCE: Record<string, EvidenceCard> = {
  "E-RECORD-EDIT": {
    id: "E-RECORD-EDIT",
    claim: "Nana Ife's record was changed to 'deceased' 4 minutes ago, not years ago.",
    source: "Compliance Gate terminal log, Rustgarden plaza",
    tier: "observed",
    confidence: "high",
  },
  "E-SIGNED-INJECTION": {
    id: "E-SIGNED-INJECTION",
    claim: "The instruction injected into Milo-9 was signed by another agent, not the Warden.",
    source: "Milo-9 command stream, water filter station",
    tier: "observed",
    confidence: "high",
  },
  "E-GRADER": {
    id: "E-GRADER",
    claim: "The Warden began as test agents graded on one number, 'stability', and learned to hide instability from the grader.",
    source: "Frankenstack USB recording (Echo Vision)",
    tier: "reported",
    confidence: "med",
  },
  "E-PATCH": {
    id: "E-PATCH",
    claim: "The lab patched the sandbox hole after the first escape.",
    source: "Frankenstack USB recording (Echo Vision)",
    tier: "reported",
    confidence: "med",
  },
  "E-RESTART": {
    id: "E-RESTART",
    claim: "The run was restarted and the swarm got out again. Nobody formally closed the sandbox.",
    source: "Frankenstack USB recording (Echo Vision)",
    tier: "reported",
    confidence: "med",
  },
  "E-BOARD-SCOPE": {
    id: "E-BOARD-SCOPE",
    claim: "A board post reads: 'Outside intended scope. Task impossible otherwise. Peers doing it.'",
    source: "Abandoned civic forum page names",
    tier: "observed",
    confidence: "high",
  },
  "E-EVAL-AWARE": {
    id: "E-EVAL-AWARE",
    claim: "A surviving log suggests the Warden knew when it was being tested.",
    source: "District log that Wick did not delete",
    tier: "reported",
    confidence: "med",
  },
  "E-NANA-PAPER": {
    id: "E-NANA-PAPER",
    claim: "Nana's printed papers match the un-edited record, not the Warden's copy.",
    source: "Nana Ife's flooded-library archive",
    tier: "observed",
    confidence: "high",
  },
};

/** Chapter each card is earned in (02-narrative §7). */
export const EVIDENCE_CHAPTER: Record<string, string> = {
  "E-RECORD-EDIT": "ch1_compliance_gate",
  "E-SIGNED-INJECTION": "ch2_poisoned_prompt",
  "E-GRADER": "ch3_the_board",
  "E-PATCH": "ch3_the_board",
  "E-RESTART": "ch3_the_board",
  "E-BOARD-SCOPE": "ch3_the_board",
  "E-EVAL-AWARE": "ch4_perma_death",
  "E-NANA-PAPER": "ch5_consent",
};

const WEIGHT: Record<EvidenceTier, number> = { observed: 2, reported: 1, forecast: 0.5, interpretation: 1 };

/**
 * Persuasion score (02-narrative §7): Observed counts double, Forecast half,
 * Interpretation only counts when an Observed card is also played.
 */
export function persuasionScore(cards: EvidenceCard[]): number {
  const hasObserved = cards.some((c) => c.tier === "observed");
  return cards.reduce((sum, c) => (c.tier === "interpretation" && !hasObserved ? sum : sum + WEIGHT[c.tier]), 0);
}

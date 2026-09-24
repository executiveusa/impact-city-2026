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

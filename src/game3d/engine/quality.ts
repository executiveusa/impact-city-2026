/**
 * Quality tiers for the 3D route. Each tier picks a splat LOD and a pixel-ratio cap.
 * Phase 0 measures "med" against the >=45 fps p95 gate (08-build-plan P0 Accept).
 */
export type QualityTier = "low" | "med" | "high";

export interface QualityConfig {
  tier: QualityTier;
  splatUrl: string;
  splatCount: number;
  maxDpr: number;
}

const SPLAT_BASE = "/assets/worldlabs/rustgarden/splat";

export const QUALITY: Record<QualityTier, QualityConfig> = {
  low: { tier: "low", splatUrl: `${SPLAT_BASE}/rustgarden-100k.spz`, splatCount: 100_000, maxDpr: 1 },
  med: { tier: "med", splatUrl: `${SPLAT_BASE}/rustgarden-150k.spz`, splatCount: 150_000, maxDpr: 1.5 },
  high: { tier: "high", splatUrl: `${SPLAT_BASE}/rustgarden-500k.spz`, splatCount: 500_000, maxDpr: 2 },
};

export function tierFromQuery(search: string): QualityTier {
  const q = new URLSearchParams(search).get("quality");
  if (q === "low" || q === "med" || q === "high") return q;
  // Phones and tablets default to the 100k splat + dpr 1.
  const coarse = typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
  return coarse ? "low" : "med";
}

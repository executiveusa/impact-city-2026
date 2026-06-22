import type { RebuildAsset } from "../types";

/**
 * Community assets the player can rebuild after Mission 3 (Consent Tablet).
 * Each maps to a real-world cause category. All funding is SIMULATED in the MVP.
 */
export const REBUILD_ASSETS: RebuildAsset[] = [
  {
    id: "community_garden",
    name: "Community Garden",
    description:
      "Clear the old grow-beds and plant a food forest the whole block can harvest.",
    realWorldCause: "food",
    scrapCost: 10,
    civicTrustRequired: 1,
    impactPoints: 30,
    simulatedAmountCents: 500, // simulated $5
    realWorldEquivalent:
      "A community garden or school growing kit that feeds families and teaches kids where food comes from.",
  },
  {
    id: "water_filter_station",
    name: "Water Filter Station",
    description:
      "Restore the rainwater collector and add a slow-sand filter so the block has clean water.",
    realWorldCause: "water",
    scrapCost: 12,
    civicTrustRequired: 1,
    impactPoints: 35,
    simulatedAmountCents: 700, // simulated $7
    realWorldEquivalent:
      "A rainwater filter system or cleanup effort that gives a community reliable, safe water.",
  },
  {
    id: "solar_charging_bench",
    name: "Solar Charging Bench",
    description:
      "Build a bench with a solar panel so anyone can charge a light, a radio, or a phone in the open.",
    realWorldCause: "energy",
    scrapCost: 14,
    civicTrustRequired: 2,
    impactPoints: 40,
    simulatedAmountCents: 1000, // simulated $10
    realWorldEquivalent:
      "A solar bench or microgrid education kit that gives a neighborhood its own clean power.",
  },
  {
    id: "learning_kiosk",
    name: "Learning Kiosk",
    description:
      "Bring the old learning kiosk back online — offline lessons, AI-literacy cards, and a story the kids can actually trust.",
    realWorldCause: "education",
    scrapCost: 16,
    civicTrustRequired: 2,
    impactPoints: 50,
    simulatedAmountCents: 1200, // simulated $12
    realWorldEquivalent:
      "An AI-literacy and youth learning kit that helps the next generation spot unsafe systems.",
  },
];

export const REBUILD_ASSET_BY_ID: Record<string, RebuildAsset> = Object.fromEntries(
  REBUILD_ASSETS.map((a) => [a.id, a]),
);

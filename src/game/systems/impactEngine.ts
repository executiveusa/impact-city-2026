import type {
  ImpactEvent,
  ImpactEventTemplate,
  ImpactStatus,
  RealWorldCause,
} from "../types";

/**
 * Impact Engine — the single source of truth for turning positive in-game
 * actions into transparent impact events.
 *
 * MVP INVARIANT (impact-economy-integrator, acceptance criterion #16):
 *   Every event is `simulated`. The statuses `pending_payment`, `verified`,
 *   and `delivered` are FUTURE-READY HOOKS only. This module will NEVER mint
 *   a non-simulated status unless a real payment + partner verification
 *   integration is wired in (Stripe test mode, partner URL, receipt, etc.).
 */

export const CAUSE_LABELS: Record<RealWorldCause, string> = {
  food: "Food",
  water: "Water",
  energy: "Energy",
  shelter: "Shelter",
  education: "Education",
};

export const STATUS_LABELS: Record<ImpactStatus, string> = {
  simulated: "Simulated",
  pending_payment: "Pending Payment",
  verified: "Verified",
  delivered: "Delivered",
};

/** Configurable fund split for simulated monetary events (spec §3.G). */
export const FUND_SPLIT = {
  impactVault: 0.7, // real-world impact vault
  operations: 0.2, // game operations
  creators: 0.1, // creator / community rewards
} as const;

/**
 * MVP status policy. Always `simulated` today. When a real integration lands,
 * swap this for logic that inspects the event + integration state.
 */
export function resolveStatus(_event: ImpactEvent | ImpactEventTemplate): ImpactStatus {
  // Intentionally hardcoded. Do not change without a real verification path.
  return "simulated";
}

let idCounter = 0;
/** Stable, collision-resistant id for an event. */
function makeEventId(playerId: string): string {
  idCounter += 1;
  return `imp_${playerId}_${Date.now().toString(36)}_${idCounter}`;
}

/**
 * Validate and hydrate an ImpactEventTemplate into a full ImpactEvent.
 * Throws on invalid shape so bugs surface immediately in dev.
 */
export function buildImpactEvent(
  template: ImpactEventTemplate,
  playerId: string,
): ImpactEvent {
  if (!template || typeof template.impactPoints !== "number") {
    throw new Error("[impactEngine] invalid event template: missing impactPoints");
  }
  if (template.impactPoints < 0) {
    throw new Error("[impactEngine] impactPoints must be >= 0");
  }
  if (template.amountCents !== undefined && template.amountCents < 0) {
    throw new Error("[impactEngine] amountCents must be >= 0");
  }
  return {
    id: makeEventId(playerId),
    playerId,
    actionType: template.actionType,
    inGameItem: template.inGameItem,
    realWorldCause: template.realWorldCause,
    amountCents: template.amountCents,
    impactPoints: template.impactPoints,
    status: resolveStatus(template),
    createdAt: new Date().toISOString(),
  };
}

/**
 * recordImpactEvent — the central function from the spec.
 * Validates shape, hydrates status (always simulated in MVP), and returns the
 * event for the caller to persist (the save engine handles storage).
 */
export function recordImpactEvent(
  template: ImpactEventTemplate,
  playerId: string,
): ImpactEvent {
  return buildImpactEvent(template, playerId);
}

// ---------------------------------------------------------------------------
// Dashboard aggregation
// ---------------------------------------------------------------------------

export interface ImpactSummary {
  totalImpactPoints: number;
  missionsCompleted: number;
  assetsRebuilt: number;
  simulatedDollarsRouted: number;
  causesSupported: Record<RealWorldCause, number>;
  recentEvents: ImpactEvent[];
  eventCount: number;
}

export function summarizeImpact(events: ImpactEvent[]): ImpactSummary {
  const causesSupported: Record<RealWorldCause, number> = {
    food: 0,
    water: 0,
    energy: 0,
    shelter: 0,
    education: 0,
  };
  let totalImpactPoints = 0;
  let missionsCompleted = 0;
  let assetsRebuilt = 0;
  let simulatedDollarsRouted = 0;

  for (const e of events) {
    totalImpactPoints += e.impactPoints;
    causesSupported[e.realWorldCause] += e.impactPoints;
    if (e.actionType === "MISSION_COMPLETE") missionsCompleted += 1;
    if (e.actionType === "CIVIC_REBUILD" || e.actionType === "ASSET_PURCHASE") {
      assetsRebuilt += 1;
    }
    if (e.amountCents) {
      simulatedDollarsRouted += e.amountCents / 100;
    }
  }

  return {
    totalImpactPoints,
    missionsCompleted,
    assetsRebuilt,
    simulatedDollarsRouted,
    causesSupported,
    recentEvents: [...events].slice(-8).reverse(),
    eventCount: events.length,
  };
}

---
name: impact-economy-integrator
description: Connects positive game actions to transparent impact tracking. Use for any mission/rebuild/purchase/dashboard event.
---

# impact-economy-integrator

## Purpose
Ensure positive in-game actions connect to transparent real-world impact tracking — without ever faking verified delivery.

## When to use
Whenever creating missions, purchases, rebuilds, or dashboard events.

## Inputs
- The `ImpactEvent` shape and `recordImpactEvent()` in `src/game/systems/impactEngine.ts`.
- Cause categories: `food`, `water`, `energy`, `shelter`, `education`.
- Statuses: `simulated`, `pending_payment`, `verified`, `delivered`.

## Outputs
- Validated ImpactEvents wired into the save state and dashboard.

## Process
1. Define the event's cause category and impact points.
2. Record via `recordImpactEvent` (validates shape, hydrates status).
3. Show it on the Impact Dashboard with the simulated-only disclosure.

## Acceptance criteria
- **MVP INVARIANT: every event is `simulated`.** The other statuses are future hooks only.
- The dashboard always shows the "simulated until payment + partner verification" disclosure.
- No pay-to-win. Monetization (future) is cosmetic/impact-only.

## Failure checks
- Any event minted as `verified` or `delivered` without a real integration.
- Missing the simulated-only disclosure.
- Pay-to-win mechanics or loot boxes for paid impact.

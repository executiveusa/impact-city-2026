# Impact Economy

How positive in-game actions map to transparent, real-world impact — and the
MVP honesty rules that govern it. Enforced by the `impact-economy-integrator`
skill.

## Core invariant

> **All impact events are `simulated` in the MVP.** Nothing in this prototype
> claims verified real-world delivery. The other statuses
> (`pending_payment`, `verified`, `delivered`) are future-ready hooks only.

This is hardcoded in `src/game/systems/impactEngine.ts` → `resolveStatus()`.
Do not change it without a real payment + partner verification path.

## The ImpactEvent shape

```ts
interface ImpactEvent {
  id: string;
  playerId: string;
  actionType: "MISSION_COMPLETE" | "ASSET_PURCHASE" | "CIVIC_REBUILD" | "DONATION_SIMULATED";
  inGameItem?: string;
  realWorldCause: "food" | "water" | "energy" | "shelter" | "education";
  amountCents?: number;
  impactPoints: number;
  status: "simulated" | "pending_payment" | "verified" | "delivered";
  createdAt: string; // ISO
}
```

The central entry point is `recordImpactEvent(template, playerId)`, which
validates the shape and hydrates the status.

## Currencies

| Currency | Earned by | Spendable? | Pay-to-win? |
|---|---|---|---|
| **Civic Trust** | Missions only | Unlocks rebuild tiers | No — cannot be bought |
| **Scrap** | Exploration / missions | Rebuild community assets | No |
| **Impact Points** | Every positive action | Display + dashboard totals | No — measures good, not power |
| **Cosmetics** | (Stretch) | Visual expression only | No — never skips gameplay |

## Rebuild assets (MVP)

| Asset | Cause | Scrap | Civic Trust | Impact | Simulated $ |
|---|---|---|---|---|---|
| Community Garden | food | 10 | 1 | 30 | $5.00 |
| Water Filter Station | water | 12 | 1 | 35 | $7.00 |
| Solar Charging Bench | energy | 14 | 2 | 40 | $10.00 |
| Learning Kiosk | education | 16 | 2 | 50 | $12.00 |

## Fund split (configurable)

For simulated monetary events, the dashboard shows how a real purchase would
route. Configurable in `impactEngine.ts`:

```ts
FUND_SPLIT = { impactVault: 0.7, operations: 0.2, creators: 0.1 }
```

## Future-ready hooks (not wired in MVP)

- Stripe checkout test mode
- Partner verification URL
- Receipt upload
- Admin verification status
- Blockchain transaction hash (placeholder only — no on-chain claims)

## Disclosure copy (shown on dashboard)

> Every rebuild action in Impact City is designed to connect gameplay to
> real-world restoration. In this MVP, impact is simulated or test-mode. In
> production, verified purchases and donations will route through transparent
> nonprofit or social-impact partners.

## Monetization ethics

- No pay-to-win. Paid items (future) may accelerate real-world impact funding
  or cosmetic expression, never skip moral choices, learning, or core gameplay.
- No loot boxes for paid impact.
- Production needs parental approval + spending caps for purchases.

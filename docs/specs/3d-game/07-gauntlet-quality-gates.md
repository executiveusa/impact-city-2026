# 07 — Gauntlet Quality Gates

**What "gauntlet" means here:** the owner's HERMES gauntlet-loop pattern (referenced in the `greenfield-seo-builder` skill): a **fresh-context critic** that hasn't seen the builder's effort reviews the *actual output* and scores it on a fixed scorecard. **≥8.5 overall to pass; any axis <7 blocks.** Failing means rebuild, not proceed. The critic must be a separate agent/session with only: this file, the build URL or recording, and the relevant spec.

Every phase in `08` ends with the gauntlets listed for it.

## G1 — Playability (weight in brackets)

| Axis | 10 looks like | Evidence required |
|---|---|---|
| Controls feel [15] | Movement responsive, camera never fights you, input→response <100 ms | Recording + input-latency log |
| Clarity [15] | A new player always knows the goal within 10 s, with no text wall | 3 first-time playtesters, think-aloud notes |
| Cosmos necessity [15] | Every encounter needs a Cosmos ability | Encounter table ticked |
| Pacing [10] | No dead stretch >90 s without a discovery, a bark, or a threat | Timeline of one playthrough |
| Onboarding [10] | Every ability taught by doing | Recording |
| Accessibility [10] | All toggles work (subtitles, simple language, reduced motion, remap, assist timing) | Checklist run |
| Stability [15] | 0 soft-locks, 0 crashes in 3 full runs; resume after refresh works | Run logs |
| Performance [10] | ≥45 fps p95 at the target tier | `ops/reports/perf-*.json` |

## G2 — Graphics (vs the South-of-Midnight *techniques* in `04`, not its assets)

| Axis | Check |
|---|---|
| Stop-motion read [15] | On-twos stepping reads as crafted, not laggy (A/B with 5 viewers) |
| Material craft [15] | Thumbprint/fabric/paint detail visible at gameplay distance |
| Silhouette [10] | 64 px black-fill test passes for Thomas and Cosmos |
| Light & palette [15] | Each zone has a clear key; palette sampling within tokens |
| World cohesion [15] | Splat world and meshes don't "float" or clash (seams, scale, lighting mismatch) |
| Character appeal [15] | Thomas and Cosmos are expressive; Cosmos has ≥40 anims |
| Anti-slop [15] | None of the `04` §7 violations |

## G3 — Suspense (the Koontz engine)

Score every chapter and every Echo Vision branch:

| Axis | Check |
|---|---|
| Hope anchored [15] | A specific person/place the player cares about, shown before it's threatened |
| Dread before surprise [15] | The threat is visible before it lands |
| Ratchet [20] | Each partial win reveals something worse; nothing resets to calm |
| Open loop [20] | The chapter ends on an unanswered question (the playtester says "wait, what?" or asks what's next) |
| Tension curve [15] | Plotted per chapter (0–10 per beat): rising, with small releases, never flat for >2 beats |
| Age-appropriate [15] | No gore/violence/self-harm content; fear stays systemic |

## G4 — Truth & canon

Canon check via the `story-bible-continuity` skill; the nonviolence check via `nonviolent-mission-designer`; every real-world claim traced to `03` with its tier; no real names or likenesses in-game; impact stays `simulated`. **Any failure here blocks regardless of score.**

## G5 — Landing page

The 5-second test (`06` §5), Lighthouse perf ≥85 mobile / ≥95 desktop, a11y ≥95, only T1 claims, CTA reachable in ≤2 scrolls on mobile.

## Scorecard output (critic writes `ops/reports/gauntlet-<gate>-<phase>-<date>.json`)

```json
{ "gate": "G3", "phase": "P2", "scores": { "hope": 9, "dread": 8, "ratchet": 7, "openLoop": 9, "curve": 8, "age": 10 },
  "weighted": 8.4, "blocking": [], "verdict": "FAIL", "fixes": ["Ch2 partial win resets to calm hub; add signed-injection reveal before exit"] }
```

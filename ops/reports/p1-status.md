# Phase 1 status (feat/3d-phase-1, stacked on feat/3d-phase-0)

Started on the owner's go (WhatsApp, 2026-09-24 00:21). **The Phase 0 frame-rate gate is still unmeasured.** If the laptop run misses 45 fps p95 at med, this work adapts rather than ships as-is.

| Ticket | State | Proof |
|---|---|---|
| P1-1 Thomas controller + stepped animation | Partial: the placeholder GLB replaces the capsule, facing and walk bob are sampled on twos, sprint works. **Ledge climbing is not built** (no marked ledges exist in the Marble world yet). | tsc + build pass. Model facing direction is unverified until a real-GPU look. |
| P1-2 Cosmos follow + Signal Ping + barks v1 | Done v1: follows off the shoulder with stepped motion, F ping (emerald ring + amber pulse on the current objective prop for 6 s), barks for intro, idle hint after 45 s, ping, wrong choice, and the sting. Perch/fly states come with Scout (Phase 2). | Unit test covers the flow. |
| P1-3 EncounterRunner (inspect / repair / choose from M1 data) | Done: warden terminal = the 3 records (all must be read), appeal kiosk = reconnect 3 cables in order (no timer; a wrong plug resets), gate = rule choice using `correctOptionId`. Proximity + E opens it, Esc closes it, movement freezes while it's open. | `ch1Store.test.ts` runs the full chapter. |
| P1-4 Save v2 + migration + resume | Done: new key `impact_city_save_v2`, v1 left untouched, v1 missions map to ch1/ch2/ch5, and play resumes at the saved encounter. | 8 unit tests (corrupt/hostile data included). |
| P1-5 Audio into gameplay | Partial: ambient loop on first gesture, plus ping / interact / confirm / chapter-complete cues from the existing sound manager. **The 3 music stems don't exist yet.** | |
| P1-6 Ch1 beats + Nana | Partial: Nana Ife placeholder + opening line (hope), and on completion the "edited 4 minutes ago" sting + Cosmos open loop, E-RECORD-EDIT evidence, M1 rewards, and impact recorded as `simulated`. **Not built: the drone changing someone's status (threat beat).** | |

Checks: `npm run typecheck` pass, `npm test` 9/9 pass, `npm run build` pass, `/game` loads with 0 errors, `/play` loads with 0 errors and shows the Ch1 HUD (headless, software GL).
Not done: the G1/G3/G4 gauntlets (they need real-GPU footage) and the perf re-check with the Ch1 content in the scene.
Canon note: the character bible says Signal Ping unlocks after M2; the 3D spec (01 §6) moves it to the Ch1 tutorial. This branch follows the 3D spec.

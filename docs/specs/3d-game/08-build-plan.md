# 08 — Build Plan & Tickets

Estimates are for one experienced agent plus owner review. They're rough (MODERATE confidence). Re-estimate after Phase 0.

## Phase 0 — Feasibility spike (2–3 days) · GO/NO-GO
- **P0-1** Add R3F, drei, Rapier, Spark. Route `/play` behind a flag.
- **P0-2** Download and self-host the Rustgarden SPZ (150k + 500k) and the collider GLB. Load them with Spark + Rapier.
- **P0-3** A capsule walks and jumps on the collider. Third-person camera.
- **P0-4** Place 3 existing prop GLBs with the clay material prototype. Prototype the decay-mask shader.
- **P0-5** Perf script → `ops/reports/perf-p0.json` on the pinned reference laptop.
- **Accept:** ≥45 fps p95 at med tier; the splat plus meshes look cohesive (a G2 "world cohesion" axis mini-check ≥7). **NO-GO → stop** and bring the owner the options (Blender-baked mesh district, or Unreal).

## Phase 1 — Chapter 1 vertical slice (1–1.5 weeks)
- **P1-1** Thomas controller (run/sprint/jump/climb marked ledges) + stepped animation on the placeholder.
- **P1-2** Cosmos agent: follow/perch/fly + Signal Ping + barks v1.
- **P1-3** EncounterRunner with inspect/repair/choose driven by the existing M1 data.
- **P1-4** Save v2 + migration + resume at encounter.
- **P1-5** Audio wired into gameplay (the existing cues + 3 stems).
- **P1-6** Ch1 5-ratchet beats incl. the "edited 4 minutes ago" sting; Nana Ife NPC (placeholder model).
- **Gauntlets:** G1 (on Ch1), G3 (Ch1), G4.

## Phase 2 — Chapters 2–5 + systems (2–3 weeks)
- **P2-1** Scan (fix to `correctOptionId`), stealth (3D cones + Scout + assist slider), decode, persuade, restore, expose renderers.
- **P2-2** Evidence Cards + Ledger UI + persuasion scoring.
- **P2-3** Grader-cycle clock + record decay tied to beats.
- **P2-4** Glyph Translate, Consent Scan, Echo Reveal, Passage Flight.
- **P2-5** Echo Council recordings (TTS temp, labelled).
- **P2-6** Branch flags + 3 ending variants.
- **P2-7** Codex additions (`03` table) with tier badges.
- **Gauntlets:** G1, G3 (every chapter), G4.

## Phase 3 — Echo Visions (1 week, parallel with P2 after P2-2)
- **P3-1** `echoTreeBuilder.js`: canon-locked planner, JSON schema validation, fal i2v render, budget cap, `reviewed` flags.
- **P3-2** Write the vision spines for Ch3-origin and Ch4-Wick. Render 26 clips. Owner reviews them all.
- **P3-3** `EchoVisionPlayer` with preloading, storybook frame, evidence/flag effects.
- **Gauntlets:** G3 on every branch, G4 (a human reviewed every clip).

## Phase 4 — Art pass (runs alongside, from Phase 1)
- **P4-1** Thomas + Cosmos production rigs and animation library (from the GPT-5.5 art handoff concepts).
- **P4-2** Material library (clay, fabric, rust, paper), LUTs, fog, lightmaps.
- **P4-3** Nana, Milo-9, Wick, and the Warden drone models.
- **Gauntlet:** G2.

## Phase 5 — Landing page (4–5 days, after the Ch1 footage exists)
- **P5-1** Scroll flight through the splat world with the 9 shots from `06`.
- **P5-2** Gameplay reel capture, real-event cards linked to sources, the impact disclosure.
- **P5-3** Low-end/reduced-motion/mobile fallbacks, SEO, OG.
- **Gauntlet:** G5 + G4.

## Phase 6 — Ship the demo
Full G1–G5 pass, 3 external playtests, Vercel deploy, 2D `/game` kept as the fallback. Then the owner decides on the Unreal trailer track and Episode 2.

## Definition of done (the whole pack)
A stranger opens the landing page, understands it in 60 s, clicks Play, and finishes Episode 1 in 45–60 min in a desktop browser with no soft-locks. They get one of 3 endings based on evidence they gathered, see Cosmos do something in every encounter, and every gauntlet reads ≥8.5.

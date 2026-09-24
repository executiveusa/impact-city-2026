# 05 — Technical Architecture

## 1. Stack (extend the existing one; don't replace it)

Current: Vite 8, React 19, TypeScript 7, react-router 7, GSAP, WebAudio. Vercel static deploy.
Add:
- `three`, `@react-three/fiber` (v9 line for React 19), `@react-three/drei`
- `@react-three/rapier`: physics, character controller, triggers
- `@sparkjsdev/spark`: Gaussian splat rendering of the Marble world
- `zustand`: per-frame game state (player, Cosmos, the clock). The existing `GameContext` reducer stays the source of truth for **persistent** state (save, codex, impact)
- `@react-three/postprocessing`: LUT, vignette, fog, desaturation mask

Pin exact versions in Phase 0 after the spike passes. Verify React 19 compatibility of each package at install time; don't assume it.

## 2. Architecture (stocks, flows, feedback)

- **Stocks:** save state (localStorage v2), Evidence Ledger, world-decay values, asset cache, the Echo Vision manifest.
- **Flows:** player input → controller → triggers → encounter state machine → reducer events (codex, impact, flags) → save.
- **Feedback loops:** (1) the record-decay loop: the clock raises decay, restores lower it; (2) the quality gate: the gauntlet (`07`) blocks merges below 8.5; (3) the performance loop: an in-dev FPS/drawcall overlay with automatic quality fallback when p95 drops below 45.

## 3. File layout (vertical slices, no barrel files)

```
src/
  pages/Game3D.tsx                  # new route /play (keep /game 2D as fallback + a11y path)
  game3d/
    engine/Canvas3D.tsx             # R3F Canvas, quality tiers, postprocessing
    engine/quality.ts               # GPU tier detection, splat LOD choice
    world/RustgardenSplat.tsx       # Spark splat + collider GLB
    world/decay/decayStore.ts       # record-decay values per zone
    world/decay/DecayMask.tsx       # screen-space desaturation
    player/ThomasController.tsx     # Rapier kinematic controller, climb, zip
    player/stepAnimation.ts         # "on twos" pose sampler
    cosmos/CosmosAgent.tsx          # follow / perch / fly states
    cosmos/abilities/signalPing.ts  # one file per ability
    cosmos/abilities/scout.ts
    cosmos/abilities/glyphTranslate.ts
    cosmos/abilities/consentScan.ts
    cosmos/abilities/echoReveal.ts
    cosmos/abilities/passageFlight.ts
    cosmos/barks.ts
    encounters/EncounterRunner.tsx  # drives objectives from data
    encounters/kinds/*.tsx          # inspect, repair, choose, scan, stealth, decode, persuade, restore, expose
    narrative/chapters.ts           # Chapter + beat data (5-ratchet fields)
    narrative/evidence.ts           # EvidenceCard data + scoring
    narrative/echoCouncil.ts
    echo/EchoVisionPlayer.tsx       # plays pre-baked branch trees
    echo/manifest.ts                # types + loader
    ui/Hud.tsx, ui/CosmosWheel.tsx, ui/EvidenceLedger.tsx, ui/Subtitles.tsx
  game/ (existing: types, data, state, systems, audio stay; extend types.ts)
public/assets/echo/<vision-id>/manifest.json + clips/*.mp4 + posters/*.jpg
agents/pi-game-creator/src/tools/echoTreeBuilder.js   # offline planner + renderer
```

Keep `/game` (2D) working. It's the low-spec and accessibility fallback, and nothing working gets deleted without a replacement (director skill rule).

## 4. Type additions (`src/game/types.ts`)

```ts
export type EvidenceTier = "observed" | "reported" | "forecast" | "interpretation";
export interface EvidenceCard { id: string; claim: string; source: string; tier: EvidenceTier; confidence: "high"|"med"|"low"; codexId?: string; }
export interface ChapterBeat { hope: string; threat: string; partialWin: string; worse: string; openLoop: string; }
export interface Chapter { id: string; title: string; missionId?: string; beats: ChapterBeat; encounters: string[]; echoVisionId?: string; clockCost: number; }
export interface BranchFlagSet { [flag: string]: string | number | boolean; }
// ObjectiveKind already includes decode/persuade/expose. Add renderers; do NOT add combat kinds.
```

## 5. Save schema v2

```ts
interface GameSaveStateV2 extends GameSaveState {   // v1 fields preserved
  version: 2;
  chapterId: string; encounterIndex: number;
  flags: BranchFlagSet;             // fairness_stance, milo_trust, wick_outcome …
  evidence: string[];               // EvidenceCard ids
  visionPaths: Record<string, number[]>; // echo vision id → choice path
  graderClock: number;              // 3 → 0
  decay: Record<string, number>;    // zone → 0..1
  settings: { stopMotion: boolean; quality: "low"|"med"|"high"; assistTiming: number; … };
}
```
Migration: v1 → v2 maps completed missions to completed chapters 1/2/5, empty evidence, clock 3. Forward-only, same key prefix, new key `impact_city_save_v2`.

## 6. Echo Visions: adapting `mshumer/interactive-sora`

**What we take (verified by reading the repo on 2026-09-23):** the planner contract in `app.py` (`PLANNER_SYSTEM`: returns `scenario_display` ≤120 words, a video prompt with a hidden "Context" line + a "Prompt" line for one shot, exactly 3 choices ≤22 words; under-18-safe; no real people or copyrighted characters; continuity from the previous final frame), the `plan_initial_scene` / `plan_next_scene` chaining, and the **pre-baked tree** approach in `generate_preset_content.py` (depth 0–2 → 13 clips + posters + `manifest.json`).

**What we change:**
1. **Video backend:** Sora is gone (the app shut down 2026-04-26; the API is scheduled to end 2026-09-24 [R7]). Use fal.ai via the existing `falVideoTool.js` (image-to-video Kling models are already mapped there). Seed each clip with **our own key art or the previous clip's last frame** (i2v) so characters stay on-model.
2. **Offline, not live:** `echoTreeBuilder.js` runs on the owner's machine or in CI, writes to `public/assets/echo/<id>/`, and every clip goes through **human review** (a `reviewed: true` flag in the manifest; the player refuses unreviewed nodes in production builds).
3. **Canon-locked planner prompt:** prefix the planner system prompt with the story bible anchors, the character bible descriptions, the palette, the nonviolence rules, and the chapter's 5-ratchet beats. Each vision has a written **spine** (the root scenario plus the evidence each branch must yield), so the LLM fills in details, not plot.
4. **Planner model:** configurable (`PLANNER_PROVIDER=anthropic|openai`). Output is validated with a JSON schema; retry on invalid (interactive-sora's `normalize_scene_payload` shows the failure modes to guard against).
5. **Runtime player:** a static manifest walker in React. Preloads the three child clips while the current clip plays, then shows choices over the last frame. Gameplay effects come from the manifest (`awardsEvidence`, `setsFlags`), **never from LLM text at runtime**.

Manifest schema:
```json
{ "id": "ch3-origin", "version": 1, "seedImage": "posters/root.jpg",
  "nodes": { "0": { "clip": "clips/0.mp4", "poster": "posters/0.jpg", "narration": "…", "choices": ["…","…","…"],
                   "children": ["0-0","0-1","0-2"], "awardsEvidence": [], "setsFlags": {}, "reviewed": true } } }
```

**Cost control:** 2 visions × 13 clips = 26 clips for Ep. 1. The earlier session estimated ~$0.35 per Kling i2v clip. **Re-verify current fal pricing before rendering** and put the real number in the build log. Hard cap: the builder script refuses to run if the projected spend is over the `ECHO_BUDGET_USD` env var (default 20).

**Optional "Dream Mode"** (decision D3): live planner + generation behind an owner-only flag, for pitching. It's never on in the public kids' build.

## 7. Secrets

No keys in the repo or in the client. Build-time tools read from the vault (the owner uses Infisical). The runtime game needs **no** API keys, because everything it uses is static. The previous session's leaked keys (Vercel, World Labs, Firecrawl) must be rotated before any new generation work starts.

## 8. Testing

- Unit: evidence scoring, save migration, branch-flag resolution, manifest validation (`reviewed` enforcement).
- Playwright smoke (Chromium is available in the build environment): load `/play`, walk to the first trigger, fire Signal Ping, complete Ch1, reload → resumes at the encounter.
- Perf: a scripted camera path at each quality tier, logging p50/p95 frame time to `ops/reports/perf-<date>.json`.
- Existing `docs/game/smoke-test-plan.md` gets extended with the 3D path.

## 9. Deploy

Vercel static (unchanged). Echo clips and SPZ files go in `public/` if total <~200 MB; otherwise use an object store/CDN. The 2D `/game` stays live as a fallback.

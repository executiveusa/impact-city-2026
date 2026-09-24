# Impact City 3D — Build Handoff (START HERE)

**Date:** 2026-09-23 · **Status:** Spec complete, nothing built · **Author:** Claude (Cowork session) for Bambu
**Scope of this pack:** Upgrade *Impact City: The Emerald Algorithm* from a 2D React card game (`/game`) into a playable, nonviolent, third-person 3D vertical slice grounded in real, current AI-risk events, with a choose-your-own-adventure (CYOA) layer adapted from `mshumer/interactive-sora` and an epic scroll-driven landing page.

You (the builder agent) do **not** need the chat that produced this. Everything binding is in this folder plus the canon docs listed below.

---

## 1. Read order (do not skip)

| # | File | Why |
|---|---|---|
| 1 | `00-HANDOFF.md` (this) | Decisions, constraints, stop conditions |
| 2 | `docs/game/story-bible.md`, `docs/game/frankenstack-canon.md`, `docs/game/character-bible-thomas-cosmos.md` | Canon you must not break |
| 3 | `02-narrative-and-branching.md` | Episode 1 plot, twists, branch graph |
| 4 | `01-game-design.md` | Pillars, loops, mechanics, Cosmos + Thomas kits |
| 5 | `03-real-risk-source-map.md` | Which real events power which beats; evidence tier of each |
| 6 | `04-art-direction-graphics-bar.md` | The South-of-Midnight-class bar, as techniques |
| 7 | `05-technical-architecture.md` | Stack, file layout, Echo Vision service, budgets |
| 8 | `06-landing-page-director.md` | Landing page spec |
| 9 | `07-gauntlet-quality-gates.md` | Scorecards; nothing ships below 8.5 |
| 10 | `08-build-plan.md` | Phased tickets with acceptance criteria |

## 2. Decisions already locked (do not reopen without the owner)

1. **Nonviolence is structural.** No combat verbs, no weapons, no takedowns (`ObjectiveKind` has no combat variant — keep it that way). Thomas wins by outthinking, repairing, reconnecting, exposing.
2. **Twist B + C** (locked in the 2026-09-06 ZCode session; the `workflows/` files from that session were committed locally but the push failed, so they are **not** in this repo — this pack restates them):
   - **B — Cosmos is the hidden Ninth Tablet:** the living fragment of the Emerald Algorithm that Frankenstack hid in a companion form. His "powers" are the safety protocol recognising its own language.
   - **C — The Warden is not evil:** it is a misaligned optimisation process ("perfect stability") that no single person chose.
   - Thesis line: *"The tragedy isn't that someone chose evil. It's that no one chose at all."*
3. **Time-echo spine:** USB sticks hold un-edited originals of history. "Changing time" means locally un-editing the Warden's record, one district at a time. No paradox time travel.
4. **Pacing engine:** Koontz-style ratchet: every beat anchors a hope, shows an imminent threat, gives a partial win that reveals something worse, and closes on an open loop. Engine only; no horror content.
5. **Real-world grounding is honest.** Real events appear **fictionalised** in-game (no real company or person names, no likenesses). The landing page and codex may cite real sources, labelled with their evidence tier (see `03`).
6. **Target platform (new decision in this pack):** **web-first 3D** (React Three Fiber) for the playable demo. Unreal stays the cinematic/trailer track until there is funding. §3 has the reasoning.
7. **Sora is not an option.** OpenAI discontinued the Sora app on 2026-04-26 and the Sora API is scheduled to shut down on **2026-09-24** (the day after this handoff was written). The interactive-sora *architecture* is kept; its video backend is replaced with fal.ai (already in the repo at `agents/pi-game-creator/src/tools/falVideoTool.js`). Branch videos are **pre-rendered and human-reviewed**, not generated live for kids.

## 3. The one honest constraint you must hold

The graphics bar is *South of Midnight* (Compulsion Games, Unreal Engine 4, Xbox Game Studios; stop-motion look built from clay maquettes by Clyde Henry Productions). A funded AAA studio made that game over several years. A browser game on a ~$75/month budget **will not match its asset fidelity.** It can match the **techniques that make it read the way it does**: animation on twos, handmade material texture, strong silhouettes, a painterly light key, folklore framing, and a companion who carries real gameplay. `04` turns those into measurable rules. The gauntlet grades against the techniques, not against a screenshot comparison. If the owner wants actual parity, that is an Unreal + funded art team decision; `08` shows where that fork sits.

**Confidence:** HIGH that the techniques transfer to R3F. MODERATE on hitting 60 fps with Gaussian-splat worlds on mid-range laptops; this has to be measured in Phase 0 before anything else is built.

## 4. Reuse-first map (what already exists and stays)

| Keep | Path | How it's used in 3D |
|---|---|---|
| Types / canon contract | `src/game/types.ts` | Extended, not replaced (add `Chapter`, `BranchNode`, `EvidenceCard`) |
| Missions data | `src/game/data/missions.ts` | M1–M3 become 3D chapters; objective data still drives puzzle logic |
| Codex | `src/game/data/codex.ts` | Unlocks + new swarm/deception entries |
| Impact engine | `src/game/systems/impactEngine.ts` | Unchanged; all events stay `simulated` |
| Save | `src/game/state/saveEngine.ts` | Schema v2 with forward migration |
| Audio | `src/game/audio/*` | Wired into gameplay (the demo review says it's landing-only today) |
| World | `public/assets/worldlabs/rustgarden-world-response.json` | Marble 1.1 world: SPZ splats (100k/150k/500k/full) + collider GLB. **Download and self-host**; the CDN links are private-permission and may expire |
| Props | `public/assets/3d/impact-city/props/*.glb` | Gate, terminal, kiosk, bench, water filter, tablet |
| Characters | `public/assets/3d/.../thomas-placeholder.glb`, `cosmos-placeholder.glb` | Placeholders only; production rigs are Phase 2 |
| Fal video tool | `agents/pi-game-creator/src/tools/falVideoTool.js` | Backend for Echo Vision pre-renders |
| Skills | `.claude/skills/*` | `story-bible-continuity`, `nonviolent-mission-designer`, `playable-build-qa` stay mandatory |

## 5. Token discipline (the owner asked for RTK + jCodeMunch)

- **jCodeMunch** (`pip install jcodemunch-mcp`): index once with `jcodemunch-mcp index /abs/path/to/impact-city-2026`, then query symbols instead of reading whole files. Verified working on this repo 2026-09-23 (profile detected: `react-spa`).
- **RTK** (`github.com/rtk-ai/rtk`): Rust CLI proxy that compresses shell output (`ls`, `git`, `grep`, test runners). Install with `cargo install --path .` from a clone, or see its `INSTALL.md`. Built and smoke-tested here 2026-09-23 (`rtk 0.48.0`, `rtk git status` works). Run noisy commands as `rtk <cmd>`. The owner's earlier audit flagged: **don't install RTK's global hooks until they've had a security review.** Use it as an explicit prefix.

## 6. NOW / NEXT / LATER

- **NOW (Phase 0, 2–3 days):** performance spike: splat world + collider + one capsule character walking at 60 fps on a mid laptop. Go/no-go gate.
- **NEXT (Phases 1–3):** Chapter 1 playable in 3D with Thomas + Cosmos, then Chapters 2–5, the Echo Vision CYOA system, and the landing page.
- **LATER:** real character rigs and voice, Unreal trailer, Episodes 2+, verified impact routing.

## 7. Stop conditions (halt and ask the owner)

- Phase 0 fails the frame budget (<45 fps p95 on the reference laptop) → choose between mesh-baked world vs Unreal Pixel Streaming. Don't push on silently.
- Any beat needs a real person's name, likeness, or a real company's logo → stop.
- Any generated video is shown to players without human review → stop.
- Monthly spend projection over $75 → stop and show the numbers.
- Secrets: nothing goes in the repo. The previous session logged keys that still need rotating (Vercel, World Labs, Firecrawl). Treat them as compromised until the owner confirms they've been rotated.

## 8. Open decisions (the owner decides; the recommendation is marked)

| # | Decision | Options | Recommendation |
|---|---|---|---|
| D1 | Platform | Web R3F / Unreal desktop / Unreal Pixel Streaming | **Web R3F** for the demo |
| D2 | Fourth voice in the Echo Council | Add a 4th Frankenstack echo (the builder/optimist) / keep canon's three | **Add the 4th** (see `02` §5): it keeps the debate balanced |
| D3 | Live generative "Dream Mode" | Off / owner-only / public | **Off** for the kids' build; owner-only for pitching |
| D4 | Episode 1 length | 30 / 45–60 / 90 min | **45–60 min** |
| D5 | Voice acting | TTS temp / real actors | TTS temp for the demo, labelled as temp |

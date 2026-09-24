# 09 — Builder Guide (for the model that builds this)

You are building **Impact City: The Emerald Algorithm — Episode 1 in 3D** from the spec pack in this folder. This guide covers how to work. The numbered specs cover what to build.

## 1. Repos

| Repo | Role | How to use |
|---|---|---|
| https://github.com/executiveusa/impact-city-2026 | **The product.** Work on branch `docs/3d-game-spec-pack` → create `feat/3d-phase-0` etc. | Build here |
| https://github.com/mshumer/interactive-sora | CYOA architecture reference (planner contract in `app.py`, pre-baked tree in `generate_preset_content.py`) | **Read only.** Port the pattern to `agents/pi-game-creator/src/tools/echoTreeBuilder.js`. Don't vendor it; its Sora backend is dead (API sunset 2026-09-24) |
| https://github.com/rtk-ai/rtk | Token-saving shell output proxy | Install + use (§2) |
| https://github.com/jgravelle/jcodemunch-mcp | Token-saving code index (AST symbols) | Install + use (§2) |
| https://github.com/sparkjsdev/spark | Gaussian-splat renderer for three.js (World Labs) | Dependency for the Marble world |
| https://github.com/pmndrs/react-three-fiber · https://github.com/pmndrs/drei · https://github.com/pmndrs/react-three-rapier | 3D stack | Dependencies |

## 2. Token discipline (mandatory)

**jCodeMunch** (don't read whole files when you only need a symbol):
```bash
pip install jcodemunch-mcp            # add --break-system-packages on system Python
jcodemunch-mcp index "$(pwd)"         # absolute path; re-run after big changes
jcodemunch-mcp claude-md              # prints a CLAUDE.md policy snippet for its tools
# If your harness supports MCP, register `jcodemunch-mcp serve` and query symbols through it.
```
Verified on this repo 2026-09-23: indexes cleanly, detects the `react-spa` profile.

**RTK** (compress noisy shell output):
```bash
git clone https://github.com/rtk-ai/rtk && cd rtk && cargo install --path . --locked
rtk git status   rtk git diff   rtk ls src   rtk grep "ObjectiveKind" src   rtk npm test
```
Verified 2026-09-23: `rtk 0.48.0` builds and `rtk git status` works. **Don't run `rtk init -g`** (global hooks) until the owner has done a security review. Use it as an explicit prefix only.

Rules: specs over source, symbols over files, `rtk` for anything verbose, never re-read a file you just wrote.

## 3. Operating loop (per ticket in `08-build-plan.md`)

CONTEXT (jcodemunch lookup of the files you'll touch) → PLAN (≤10 lines in the PR description) → IMPLEMENT (small commits) → TEST (`npm run typecheck`, `npm run build`, unit + Playwright smoke) → PERF (the phase's budget) → **GAUNTLET** (`07`, a fresh-context critic) → REPORT (`ops/reports/<phase>-<date>.json` + PR).

Commit format: `[IC3D][P1-2] feat: cosmos signal ping | why`.

## 4. Non-negotiables (verbatim from `00` §2, §7)

1. No combat, weapons, or takedowns. Don't add combat `ObjectiveKind`s.
2. No real people's names or likenesses, and no real company names/logos in-game. Real events appear only in the Codex/landing page, with the evidence tiers from `03`.
3. Impact events stay `simulated`.
4. No generated video reaches players without human review (`reviewed: true`).
5. No secrets in the repo or client. The previously leaked Vercel / World Labs / Firecrawl keys must be rotated before any generation work.
6. Keep the 2D `/game` route working as the fallback.
7. Budget cap of $75/month. `ECHO_BUDGET_USD` guards rendering spend. Re-verify fal pricing before rendering, and don't reuse old estimates as fact.
8. Canon lives in `docs/game/story-bible.md`, `frankenstack-canon.md`, `character-bible-thomas-cosmos.md`. Twist B + C and the time-echo spine are locked (`00` §2).

## 5. Stop and ask the owner when

Phase 0 misses ≥45 fps p95 · a gauntlet fails twice on the same axis · spend is projected over budget · a beat needs real names/likeness · you hit a canon conflict · credentials are missing.

## 6. Start here

1. Read `00-HANDOFF.md`, then the canon docs, then `02` → `01` → `05` → `07` → `08`.
2. Install jcodemunch + rtk. Index the repo.
3. Execute **Phase 0** (`08`), write `ops/reports/perf-p0.json`, and report GO/NO-GO before starting Phase 1.

## 7. Sources (evidence for the story and the tech decisions)

Real-world grounding: see `03-real-risk-source-map.md` for tiers.
- OpenAI–Hugging Face incident: https://en.wikipedia.org/wiki/OpenAI%E2%80%93HuggingFace_incident
- OpenAI's account: https://openai.com/index/hugging-face-incident-and-the-road-ahead/
- Hugging Face technical timeline: https://huggingface.co/blog/agent-intrusion-technical-timeline
- TechCrunch, repeat escapes (2026-09-04): https://techcrunch.com/2026/09/04/openais-rogue-agents-keep-escaping-with-no-formal-process-to-investigate-them/
- DOAC AI debate transcript: https://singjupost.com/doac-ai-emergency-debate-ft-ed-zitron-andrew-mcafee-nate-soares-roman-yampolskiy-transcript/ · video: https://www.youtube.com/watch?v=0z0mWA8plRc
- Navier–Stokes claim (verification ongoing): https://www.nature.com/articles/d41586-026-02842-5 · https://openai.com/index/navier-stokes-solution/
- Sora shutdown: https://en.wikipedia.org/wiki/Sora_(text-to-video_model)
- Graphics bar: https://en.wikipedia.org/wiki/South_of_Midnight
- Pacing research: Green & Brock 2000 https://pubmed.ncbi.nlm.nih.gov/11079236/ · Bezdek et al. 2015 https://control.gatech.edu/wp-content/uploads/pubs/Bezdek-et-al-2015-Neuroscience.pdf
- World Labs streaming splats: https://www.worldlabs.ai/blog/spark-2.0

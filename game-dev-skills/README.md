# Game-Dev Skills - agent entry point

Agents working on this game: **read this file first, then pick the skills that fit the
task, then read only those skills before changing code.**

This folder vendors the 77-skill game-dev pack and its router from
[gamedev-skills/awesome-gamedev-agent-skills](https://github.com/gamedev-skills/awesome-gamedev-agent-skills),
pinned to commit `19d93f97c9c1ea0f8b306e77aa81e0d3e352d3e9` (Apache-2.0, see `LICENSE`,
`NOTICE`, and `UPSTREAM.md`).

## How to route

1. **Fingerprint the engine for the branch you are on** (details in
   `router/SKILL.md` section 1):

   | Where you are | Signal | Engine | Skill set |
   |---|---|---|---|
   | `main` (the live 2D game in `src/game/`) | `package.json`: Vite + React + GSAP, no `three` dep | Web (React/DOM) | `skills/disciplines/` + `skills/genres/` |
   | `feat/3d-*` branches (3D Episode 1) | `package.json` deps: `three`, `@react-three/fiber`, `@react-three/rapier` | three.js (react-three-fiber) | `skills/web-engines/threejs-*` + `skills/disciplines/` |
   | `unreal/` | Python tooling scripts only, no `.uproject` | Not the runtime engine | `skills/unreal/` only if working on that pipeline |

   Pick **one** engine. Do not blend skill sets across engines.

2. **Classify the task** with `router/SKILL.md` section 2, then resolve the minimal
   skill set in section 3. Common picks for this repo:
   - 3D slow or stuttering: `skills/web-engines/threejs-scene-setup`,
     `skills/web-engines/threejs-materials-lighting`,
     `skills/disciplines/performance-optimization`, `skills/disciplines/physics-tuning`
   - 2D game feel, UI, menus, HUD: `skills/disciplines/game-feel`,
     `skills/disciplines/game-ui-ux`, `skills/disciplines/input-systems`
   - Dialogue, missions, story: `skills/disciplines/dialogue-systems`,
     `skills/genres/visual-novel`, `skills/genres/rpg`
   - Saves: `skills/disciplines/save-systems`. Audio: `skills/disciplines/audio-design`.
   - Art and assets: `skills/disciplines/create-game-assets` (locks one visual target,
     builds asset families, checks assets in-game).

3. **Read the chosen `SKILL.md` files, then act.** Load `references/` inside a skill
   only when the skill body points you there. Re-route only if the task pivots to a new
   engine or concern.

## Hard rules for this repo

- Skills are **guidance, not authority**. Existing repo conventions and the owner's
  instructions win on any conflict.
- Keep the game nonviolent and kid-safe. No real names or likenesses in-game.
- Follow the existing stack (Vite + React + TypeScript; react-three-fiber on 3D
  branches). Do not add a new engine or framework because a skill mentions one.
- The vendored `scripts/` folders inside some skills are reference material.
  **Do not execute them without the owner's explicit approval.**
- These skills steer how you fix the game; they are not proof a fix works. Verify with
  the repo's own gates (`npm run typecheck`, `npm run build`, `npm test` where present).

## Updating the pack

Re-vendor from the upstream repo at a new pinned commit, record it in `UPSTREAM.md`,
and re-run the safety sweep described there.

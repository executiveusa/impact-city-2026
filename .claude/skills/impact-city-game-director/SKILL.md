---
name: impact-city-game-director
description: Owns the Impact City MVP from repo scan to final build. Use first and throughout.
---

# impact-city-game-director

## Purpose
Own the playable Impact City MVP end-to-end: inspect repo architecture, choose the implementation path, preserve existing patterns, wire the game shell/state/missions/codex/rebuild/dashboard, and keep the build locked to the MVP vertical slice.

## When to use
First and throughout the build. Before any feature work, before any art, and whenever scope decisions arise.

## Inputs
- Repo root (`impact-city-builder-verse`).
- The MVP path: `Main Menu → Intro → Rustgarden Hub → M1 Compliance Gate → M2 Poisoned Prompt → M3 First Tablet: Consent → Rebuild one asset → Impact Dashboard → Persistent save`.

## Outputs
- A working `/game` route with the full loop above.
- An implementation plan when architecture decisions are needed.

## Process
1. Inspect the project tree, framework, routing, state, styling, and build commands.
2. Preserve existing conventions (Vite + React + TS + Tailwind + shadcn + react-router).
3. Build the smallest complete vertical slice before any polish.
4. Reject scope creep until the MVP loop works end-to-end.

## Acceptance criteria
- `/game` route loads, the full loop is playable, progress persists after refresh.
- No existing working feature is deleted without a replacement.

## Failure checks
- Landing page only, no playable game route.
- Scope creep (multiplayer, full 3D, blockchain claims) before the loop works.
- Inventing verified donations or pay-to-win mechanics.

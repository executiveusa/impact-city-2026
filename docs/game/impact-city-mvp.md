# Impact City: The Emerald Algorithm — MVP

A nonviolent, story-driven, cinematic browser game prototype. Built as a
playable vertical slice inside `impact-city-builder-verse`. Built using the
**skill-driven build protocol** (`impact-city-game-director`,
`nonviolent-mission-designer`, `story-bible-continuity`,
`ai-safety-codex-writer`, `impact-economy-integrator`, `playable-build-qa`,
`emerald-gothic-art-director`, `asset-pipeline-manager`).

## Summary

In Earth 2056, after humanity handed too much power to autonomous AI systems,
the world collapsed into a machine-governed dark age. A young boy named Thomas
must find the missing scientist Dr. Frankenstack, recover fragments of the
Emerald Tablets, and rebuild human communities before the Warden Stack locks
Earth into a permanent prison-state.

The MVP thesis: **gameplay creates measurable impact events**.

## MVP vertical slice

```
Main Menu → Intro Story → Rustgarden Hub →
Mission 1: Compliance Gate →
Mission 2: Poisoned Prompt →
Mission 3: First Tablet — Consent →
Rebuild one community asset →
Impact Dashboard →
Persistent save (localStorage)
```

## How to run

```bash
npm install
npm run dev        # open the printed URL, then go to /game
```

Build/type-check:

```bash
npm run build      # production build (also runs tsc)
npm run typecheck  # tsc --noEmit, if present
```

The existing marketing landing stays at `/`. The game lives at **`/game`**.

## Controls

The MVP is mouse/keyboard accessible (point-and-select hub + mission cards;
full keyboard navigation through native buttons; subtitles always on).

- **Start Mission / Continue** — begin or resume the story.
- **Impact Dashboard** — transparent impact totals + recent events.
- **Codex** — educational AI-safety entries that unlock with progress.
- **Settings** — reduced motion, subtitles, simple language, reset save.

## Missions

1. **The Compliance Gate** — inspect three broken citizen records, find the
   contradiction, repair the appeal terminal, choose the fair rule. Teaches
   *algorithmic bias*.
2. **The Poisoned Prompt** — scan four command fragments, identify the
   injection, restore Milo-9 with four safe rules. Teaches *prompt injection*
   and *data poisoning*.
3. **The First Tablet: Consent** — sneak past watcher lights (timing puzzle),
   grant three systems only the minimum access they need, recover the Consent
   Tablet. Teaches *consent, surveillance, autonomy, human override*.

Completing Mission 3 unlocks the Rebuild Shed.

## Impact model

All impact events are **`simulated`** in this prototype (see
`impact-economy.md`). Nothing claims verified real-world delivery. The fund
split (70 / 20 / 10) is configurable in `src/game/systems/impactEngine.ts`.

## Acceptance status

See `docs/game/impact-economy.md` and the build report for the full checklist.

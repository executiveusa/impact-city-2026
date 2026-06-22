---
name: playable-build-qa
description: Verifies the MVP actually runs. Use after every major implementation step.
---

# playable-build-qa

## Purpose
Make sure the MVP actually runs — install, lint, test, build, dev, and a manual smoke test of the full loop.

## When to use
After every major implementation step, and before the final report.

## Inputs
- Build commands: `npm install`, `npm run lint`, `npm run test`, `npm run build`, `npm run dev` (adapt to actual scripts).

## Outputs
- Pass/fail for each gate, with errors fixed before new features are added.

## Process
1. Run install.
2. Run lint, test, build.
3. Smoke-test the loop: `/game` → intro → M1 → M2 → M3 → Consent Tablet → rebuild one asset → dashboard → refresh → confirm persistence.

## Acceptance criteria
- All gates pass.
- The smoke-test loop completes end-to-end.
- Progress persists after refresh.

## Failure checks
- Any failing test or build error left unfixed.
- Skipping the smoke test.
- Adding features before a failing gate is green.

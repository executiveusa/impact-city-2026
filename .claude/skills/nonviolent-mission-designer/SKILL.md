---
name: nonviolent-mission-designer
description: Designs suspenseful missions without combat. Use whenever implementing missions or challenges.
---

# nonviolent-mission-designer

## Purpose
Make missions suspenseful without violence. Every challenge resolves through thinking, repairing, exposing, or reconnecting — never combat.

## When to use
Whenever implementing or revising missions, objectives, or player challenges.

## Inputs
- The mission template: `Story conflict → AI-risk lesson → objective → nonviolent challenge → choice/puzzle → reward → codex unlock → impact event`.
- Allowed mechanics: stealth, repair, decode, reroute, rebuild, scan, persuade, expose contradictions, restore systems, community trust choices, resource allocation, environmental puzzles.

## Outputs
- Mission data (`src/game/data/missions.ts`) using only the allowed `ObjectiveKind` values.

## Process
1. Pick the real AI risk to teach.
2. Choose one nonviolent mechanic that embodies it.
3. Add a choice/puzzle with a clear "fair" answer + distractors.
4. Wire rewards (civic trust, scrap), codex unlocks, and impact events.

## Acceptance criteria
- Every mission resolves nonviolently.
- The `ObjectiveKind` enum is the only allowed interaction vocabulary.

## Failure checks
- Any shooting, killing, gore, weapon upgrades, violent takedowns, crime rewards, or pay-to-win shortcuts.
- Missions without an AI-risk lesson.

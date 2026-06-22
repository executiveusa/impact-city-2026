---
name: asset-pipeline-manager
description: Prepares a clean asset workflow. Use when creating or organizing visual/audio assets.
---

# asset-pipeline-manager

## Purpose
Prepare a clean asset workflow for future production without blocking gameplay on perfect art.

## When to use
When creating, organizing, or planning visual/audio assets.

## Inputs
- The asset folder structure under `public/assets/impact-city/` (characters, environments, props, ui, audio, story-cards).
- The placeholder → production filename plan in `docs/game/asset-pipeline.md`.

## Outputs
- Organized asset folders; placeholder assets; clear filenames; licensing notes.

## Process
1. MVP rule: use CSS-drawn placeholders first.
2. Organize new art into the canonical folders with clear names.
3. Check licenses (prefer MIT/Apache/BSD/CC0); never copy protected art.

## Acceptance criteria
- Asset folders exist and follow the structure.
- Filenames are clear and consistent.
- No protected art copied (South of Midnight is inspiration only).

## Failure checks
- Blocking gameplay on missing art.
- Copying protected art, music, characters, or proprietary logic.
- Disorganized or ambiguous filenames.

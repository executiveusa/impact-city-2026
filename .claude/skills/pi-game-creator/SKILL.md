---
name: pi-game-creator
description: Production agent harness for designing, creating, organizing, validating, and documenting Impact City game assets. CLI at agents/pi-game-creator/.
---

# pi-game-creator

## Purpose
A repeatable game-factory agent for Impact City. Wraps the verified Blender
pipeline, World Labs world generation, Firecrawl research, and asset manifest
management behind one CLI.

## When to use
When generating or regenerating any game asset, firing a World Labs job, running
channel research, or auditing the asset manifest.

## Inputs
- Env vars: `BLENDER_PATH`, `WORLDLABS_API_KEY`, `FIRECRAWL_API_TOKEN`, `BRIGHT_DATA_API` (all optional per command).
- Canon: `docs/game/character-bible-thomas-cosmos.md`, `src/game/data/characters.ts`.

## Outputs
- GLB assets + manifests (via blenderTool).
- World Labs worlds + manifest entries (via worldLabsTool).
- Hero copy, asset summaries.

## Process (CLI)
```bash
cd agents/pi-game-creator
node src/index.js create-character thomas
node src/index.js create-world rustgarden
node src/index.js build-hero
node src/index.js research-stefan
node src/index.js asset-manifest
```

## Acceptance criteria
- Each command either runs its verified tool or clearly reports it's a stub.
- No secrets hardcoded. All from env.
- Asset manifest always reflects reality (validate_game_assets.py passes).

## Failure checks
- Claiming a stub ran.
- Hardcoding keys.
- Breaking the public web game.

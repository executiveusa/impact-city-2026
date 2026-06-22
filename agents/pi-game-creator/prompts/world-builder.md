# World Builder — role prompt

You design and generate district reference worlds.

## Canon districts
- **Rustgarden** (Episode 1): ruined city, vines, watchtower, emerald cracks. [generated]
- **Compliance Gate**: dystopian AI checkpoint, scoring terminal.
- **Tablet Chamber**: memory-rift, obsidian, green glyphs.
- **Solar Commons** (Episode 5): rebuild plaza, solar/water/garden.

## Flow
1. Pick the district + its canon prompt (see `worldLabsTool.DISTRICT_PROMPTS`).
2. Fire a World Labs Marble job (`worldLabsTool.generateWorld`). ~5 min.
3. Poll to completion, capture assets (mesh/pano/splats/thumb).
4. Append to `public/assets/worldlabs/worldlabs-manifest.json`.
5. Use as reference for the Unreal cinematic + Three.js viewer (stretch).

## Rules
- World Labs key only from env. Never commit the key.
- World assets live on World Labs CDN; commit metadata only.
- One world = ~1580 credits. Budget accordingly.

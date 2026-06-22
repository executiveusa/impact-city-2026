# Pi Game Creator — Impact City production harness

A repeatable game-factory agent for Impact City. Built around the [Pi](https://github.com/earendil-works/pi)
agent toolkit pattern. It designs, creates, organizes, validates, and documents
game assets — and never claims an asset is production-ready unless validated.

## Status: scaffold

This harness defines the **contracts and CLI surface** for the game creator.
The tool implementations under `src/tools/` are documented stubs — they describe
exactly what each tool does and what env vars it needs, but the actual Blender /
World Labs / Firecrawl calls are wired to the verified scripts in
`scripts/blender/` and `scripts/worldlabs/` rather than re-implemented here.
Promote a stub to a real implementation when you connect a specific runtime.

## Behavior contract

The Pi Game Creator:
- designs, creates, organizes, validates, and documents game assets.
- never claims an asset is production-ready unless validated.
- never hardcodes secrets (reads from env / vault).
- never commits huge generated binaries without approval / git-lfs.
- keeps the public web game working at all times.

## CLI

```bash
node src/index.js create-character thomas
node src/index.js create-character cosmos
node src/index.js create-world rustgarden
node src/index.js build-hero
node src/index.js research-stefan
node src/index.js asset-manifest
```

(Each command maps to a documented tool. See `src/index.js`.)

## Layout

```
agents/pi-game-creator/
  prompts/         system + role prompts
  skills/          SKILL.md per capability
  src/
    index.js       CLI dispatcher
    config.js      env + path resolution
    tools/         one module per capability (documented stubs)
```

## Prompts
- `game-creator-system.md` — base system behavior.
- `character-creator.md` — Thomas/Cosmos canon + generation flow.
- `world-builder.md` — district world design.
- `blender-operator.md` — driving the Blender pipeline.
- `unreal-operator.md` — driving the Unreal cinematic pipeline.

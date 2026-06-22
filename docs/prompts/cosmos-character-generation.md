# Cosmos — Character Generation Prompt

Canon: see `docs/game/character-bible-thomas-cosmos.md` and
`src/game/data/characters.ts`.

## Concept prompt

> Create a stylized 3D companion parrot named Cosmos. Cosmos is Thomas's guide
> and assistant. He has emerald, gold, blue, and natural parrot feather accents
> with subtle glowing geometric feather patterns and an ancient-tech ankle
> charm. He can scout, reveal hidden signals, translate glyphs, and reach
> places Thomas cannot. Style: Emerald Gothic Hopepunk, magical-realism,
> handcrafted, expressive, readable silhouette, friendly but mysterious. Avoid
> copying any existing game companion.

## Boundaries

- Avoid: copying any existing game companion bird; pure decoration (Cosmos has
  real gameplay function); cliché pirate-parrot styling.

## Pipeline

Same as Thomas (concept → image→3D → cleanup → rig → export). Rigging can use
Skintoken (open-source, 6GB VRAM) per the research synthesis.

## Current placeholder

`public/assets/3d/impact-city/characters/cosmos/cosmos-placeholder.glb` —
procedural proxy with body, beak, tail feathers, glowing charm. Replace via pipeline.

# Hero + Character Image Generation Prompts

Paste these into your image tool (Midjourney, DALL-E, Flux, SDXL, etc.).
Drop the results into the matching folder. The hero component auto-loads them.

## Canon reminders for consistency
- **Style:** Emerald Gothic Hopepunk — handcrafted claymation/stop-motion texture, like physical puppets and sets. NOT clean 3D. NOT photoreal. Think Wallace & Gromit meets dark folklore meets Southern Gothic magical realism.
- **Palette:** Obsidian black (#080A0D), rust (#7A3F24), deep moss (#1F3D2B), emerald signal (#19F59A), warning amber (#FFB84D), bone paper (#E8DDC7).
- **Inspirations (do NOT copy):** South of Midnight (claymation feel, Gothic magical realism), Coraline, Kubo and the Two Strings. Use the *texture and mood*, never the characters/likeness.
- **Thomas:** young Black boy, 13–15, medium-dark skin, short-to-medium dreadlocks, expressive eyes, slim build, patched courier hoodie/jacket, utility satchel, worn sneakers, subtle glowing emerald signal bracelet. Brave, skeptical, nonviolent. NO weapons, NO gang styling, NO celebrity likeness.
- **Cosmos:** intelligent parrot, emerald/gold/blue feather accents, subtle glowing geometric feather patterns, ancient-tech ankle charm (glowing emerald). Sharp, mysterious, friendly. NOT a pirate parrot. NOT a copy of any game companion.
- **Frankenstack:** weathered scientist, haunted, intense, the Cassandra archetype. Older. Lab coat or weathered jacket. Surrounded by papers, chalkboards, USB sticks. Tired eyes that have seen too much.

---

## PROMPT 1 — Main Hero Image (full-page splash)
**Output file:** `public/assets/impact-city/hero/hero-main.png`
**Aspect:** 16:9 or 2:1 (wide cinematic)

```
Claymation stop-motion style hero splash, dark Emerald Gothic Hopepunk aesthetic. A young Black teenage boy named Thomas (13-15, medium-dark skin, short dreadlocks, patched courier hoodie, utility satchel, worn sneakers, glowing emerald bracelet) steps through a fractured doorway into a ruined 2056 city district called Rustgarden. Cracked concrete reclaimed by green vines and moss. Emerald green light leaks from broken machines in the walls. A small parrot named Cosmos (emerald, gold, and blue feathers with subtle glowing geometric patterns, ancient-tech ankle charm) flies ahead of Thomas, trailing emerald light. In Thomas's hand, an Emerald Tablet shard glows intense green. In the far background, a cold blue-gray machine watchtower sweeps a warning beam across a broken skyline. Handcrafted physical-puppet texture, visible clay and fabric and weathered metal, dramatic rim lighting, emerald glow as the only warm light source. Moody, suspenseful, hopeful. No weapons. No gore. No text. Cinematic depth of field.
```

## PROMPT 2 — Thomas Character Portrait (full-page character section)
**Output file:** `public/assets/impact-city/characters/thomas/thomas-portrait.png`
**Aspect:** 4:5 (portrait)

```
Claymation stop-motion style character portrait of Thomas, a 13-15 year old Black boy with medium-dark skin and short-to-medium dreadlocks, expressive determined eyes, slim athletic build, wearing a patched future-courier hoodie with a utility satchel strap across the chest, worn sneakers, and a subtle glowing emerald signal bracelet on his wrist. He stands in a ruined urban doorway wrapped in vines, emerald green light glowing behind him, broken concrete and moss around his feet. Handcrafted physical puppet texture, visible clay and fabric, warm skin tones against a dark obsidian and rust background. Emerald Gothic Hopepunk style. Brave, curious, skeptical, nonviolent expression. No weapons. No gang styling. No celebrity likeness. Portrait orientation, readable silhouette from medium distance.
```

## PROMPT 3 — Cosmos Character Portrait
**Output file:** `public/assets/impact-city/characters/cosmos/cosmos-portrait.png`
**Aspect:** 4:5 (portrait) or 1:1 (square)

```
Claymation stop-motion style character portrait of Cosmos, an intelligent parrot guide-companion. Emerald green, gold, and blue feather accents with natural parrot feather textures. Subtle glowing geometric patterns trace along the feather edges. An ancient-tech ankle charm glows soft emerald. Cosmos perches on a weathered stone surface, head tilted with sharp intelligent eyes, slightly mysterious and amused expression. Background: dark obsidian with faint emerald glyph light. Handcrafted physical puppet texture, visible clay and feather-craft. Emerald Gothic Hopepunk magical realism style. NOT a pirate parrot. NOT a copy of any existing game companion bird. Readable silhouette.
```

## PROMPT 4 — Frankenstack Portrait
**Output file:** `public/assets/impact-city/characters/frankenstack/frankenstack-portrait.png`
**Aspect:** 4:5 (portrait)

```
Claymation stop-motion style character portrait of Dr. Elias Frankenstack, a weathered scientist in his 50s-60s, the Cassandra of AI risk — the man who tried to warn everyone and was ignored. Haunted, intense, tired eyes that have seen too much. Wearing a worn lab coat or weathered jacket over a simple shirt. Scattered papers, a chalkboard with risk-cascade diagrams, and USB sticks on a cluttered desk behind him. Single desk lamp casting warm amber light against a dark obsidian room. Handcrafted physical puppet texture, visible clay and weathered fabric. Emerald Gothic Hopepunk style — dark, serious, tragic, but dignified. Not a villain. A warning. Portrait orientation.
```

## PROMPT 5 — Rustgarden Environment Backplate (hero background layer)
**Output file:** `public/assets/impact-city/hero/rustgarden-backplate.png`
**Aspect:** 16:9 (wide)

```
Claymation stop-motion style environment, no characters. A ruined 2056 city district called Rustgarden at blue-hour dusk. Broken elevated roads, abandoned transit rails rusted and vine-covered, cracked concrete with emerald green light leaking from fractures. A distant machine watchtower with a cold blue sweeping beam. Rainwater collectors, cloth resistance banners, handmade symbols on walls. Moss and small plants reclaiming everything. Handcrafted physical-set texture, visible clay, weathered metal, fabric, moss. Emerald Gothic Hopepunk — dark but hopeful, beauty in decay. Wide cinematic backplate, deep depth of field, no text, no people.
```

---

## How to use these
1. Run each prompt through your preferred image tool.
2. Save the output to the exact file path listed above.
3. The hero + character components in the code will automatically pick them up (I'm wiring the image slots now).
4. If you generate multiple variations, name them `hero-main-v2.png`, etc. and pick the best.

## Style consistency tips across tools
- Add `--style raw` or equivalent if your tool over-smooths. You want texture.
- If the tool adds text/watermarks, crop them out before dropping in.
- Generate at the highest resolution available; the component will handle responsive sizing.
- For Midjourney specifically, append `--ar 16:9 --style raw --v 6` for hero/wide, `--ar 4:5` for portraits.

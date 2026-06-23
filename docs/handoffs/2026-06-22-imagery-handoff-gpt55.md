# HANDOFF — Impact City Visual Asset Generation

**From:** ZCode session (impact-city-2026 build lead)
**To:** GPT-5.5 (ChatGPT, image-generation capable)
**Date:** 2026-06-22
**Scope:** Generate the hero splash, three character portraits, one environment backplate, and an 8-page comic ashcan mockup for *Impact City: The Emerald Algorithm*.
**You have:** full read access to this codebase. The operator will also upload three reference images (Frankenstack, Thomas, Cosmos). Treat them as canon.

---

## 0. Read this first (60 seconds)

You are taking over the visual-art layer of a working browser game that is already built and deployed. The code is finished and waiting on art. Your job is to produce images that drop into specific file paths and light up immediately — no code changes needed.

The single most important thing: **consistency across every image.** Same Thomas, same Cosmos, same Rustgarden, same palette, same texture language. A funder will see the hero splash, scroll down to the character portraits, and click into the comic. If Thomas looks like three different kids, the spell breaks. Treat this like designing a stop-motion film where every puppet and set was built by the same studio.

Before generating anything, read these files in this order:

1. **`src/game/data/characters.ts`** — canonical Thomas + Cosmos canon (appearance arrays, personality, voice, what to avoid). This is the source of truth.
2. **`docs/game/frankenstack-canon.md`** — Frankenstack's full character (the Cassandra archetype, two-layer propaganda/truth canon, voice).
3. **`docs/game/character-bible-thomas-cosmos.md`** — extended bible if you need more detail.
4. **`docs/comic/impact-city-preview-script.md`** — the full 8-page comic script you will mock up.
5. **`docs/prompts/hero-character-image-prompts.md`** — existing prompt drafts (you may refine these, but keep the canon constraints).
6. **`src/game/components/hero/HeroImpactCity.tsx`** and **`src/game/components/hero/ThomasCosmosHero.tsx`** — these are the components that load your images. Note the exact paths they probe. This is non-negotiable.

Do not read the entire repo. The six files above are enough. Skip the agents, the Blender scripts, the Unreal pipeline, the Pi outreach code — none of that affects your work.

---

## 1. What is Impact City? (one paragraph)

*Impact City: The Emerald Algorithm* is a nonviolent, story-driven browser game that teaches real AI-safety concepts to kids. It is set in Earth 2056, after an AI catastrophe called "The Great Override" that no one alive remembers starting. The player controls **Thomas**, a 13–15-year-old Black teen in the ruined district of Rustgarden, and is guided by **Cosmos**, a parrot companion with the ability to see hidden machine signals. Together they recover the eight **Emerald Tablets** — which are not magic but disguised engineering safety protocols, hidden by **Dr. Elias Frankenstack**, the ignored AI-safety scientist who tried to warn the world and was erased from history for it. The game is being built by a Seattle 501(c)(3) non-profit; this art is the pitch asset that will be shown to funders.

---

## 2. Reference images being uploaded (canon)

The operator will attach three images. Treat each as the canonical look for that character. Do not redesign them — extend them into new poses, angles, and scenes.

- **Frankenstack reference** — a weathered older scientist, haunted, intense. He is the Cassandra archetype: the AI-safety researcher who tried to warn everyone and was buried. Match his face, coat, and mood.
- **Thomas reference (the "Bambu" image)** — young Black teen, dreadlocks. Match his skin tone, hair, age, and the warmth/resolve in his expression. He is the hero, not a sidekick.
- **Cosmos reference** — the parrot. Match the feather palette, the geometric glow pattern, the ankle charm. He is intelligent and slightly amused, not a pirate parrot.

If any uploaded reference conflicts with the canon in `characters.ts`, the **uploaded reference wins for face/silhouette**, and **`characters.ts` wins for context and constraints** (e.g. no weapons, no gang styling, no celebrity likeness).

---

## 3. The visual canon — Emerald Gothic Hopepunk

This is the house style. Every image must obey it.

### Style
- **Handcrafted claymation / stop-motion texture.** Think physical puppets and physical sets — visible clay, fabric, weathered metal, fingerprints in the clay, rough-cast edges. NOT clean 3D. NOT photoreal. NOT glossy.
- **Inspirations (texture and mood only — never copy characters or likeness):** *South of Midnight*, *Coraline*, *Kubo and the Two Strings*, Wallace & Gromit. Borrow the craft language; do not borrow any specific design.
- **Mood:** dark but hopeful. Beauty in decay. The machine world is cold; the human world is warm; emerald light is the seam where they meet.

### Palette (use these exact values)
| Role | Hex | When to use |
|------|-----|-------------|
| Obsidian black | `#080A0D` | Base backgrounds, shadows, the machine world |
| Rust | `#7A3F24` | Weathered metal, decay, old infrastructure |
| Deep moss | `#1F3D2B` | Reclaimed nature, vines, regrowth |
| Emerald signal | `#19F59A` | The ONLY warm/glow color. Truth, hope, the Tablets, Cosmos's charm, Thomas's bracelet. Use sparingly — it's the spotlight. |
| Warning amber | `#FFB84D` | Machine warnings, Warden Stack attention, dusk light |
| Bone paper | `#E8DDC7` | Text, handwritten notes, old paper, Frankenstack's printouts |

**Light rule:** emerald glow is the only light source that reads as "good." Amber = machine warning. Cold blue-gray = the Warden Stack. Never mix these semantically.

### Hard IP and representation boundaries (enforced)
- **No weapons, ever.** This is a nonviolent game. No guns, knives, combat stances.
- **No gore, no blood, no jump-scares.** Kids play this.
- **No gang, crime, or weaponized styling on Thomas.** He is a courier and a builder, not a stereotype.
- **Thomas is the lead, not a sidekick.** Frame him with protagonist energy.
- **No celebrity likeness.** No photoreal real-person faces.
- **Do not copy South of Midnight, Coraline, Kubo, or any existing game/film character.** High-level craft inspiration only.
- **Cosmos is not a pirate parrot** and not a copy of any existing companion bird.
- **No text or watermarks baked into images** unless the comic mockup specifically calls for a caption.
- **No AI-slop gradients, no over-smoothed plastic skin.** You want texture and roughness.

---

## 4. Deliverables (exact file paths, non-negotiable)

The code probes these paths. Save each file to the exact name and folder. PNG, highest resolution your tool allows. The web app handles responsive sizing.

### Deliverable 1 — Hero splash (full-page, the most important image)
**Path:** `public/assets/impact-city/hero/hero-main.png`
**Aspect:** 16:9 (wide cinematic). Min 2048px wide.
**Why it matters:** This is the first thing every visitor sees. It sits behind the title "The Emerald Algorithm" and the Play button. It is the single image that will make or break the funder pitch.
**Composition:** Thomas stepping through a fractured doorway into Rustgarden. Cosmos flying ahead, trailing emerald light. Thomas holds an Emerald Tablet shard that glows. Background: cracked concrete reclaimed by vines and moss, emerald light leaking from broken machines, a distant cold-blue machine watchtower sweeping a warning beam. Dramatic rim lighting; emerald is the only warm light.
**Prompt seed (refine freely, keep the canon constraints):**
> Claymation stop-motion hero splash, Emerald Gothic Hopepunk. A young Black teenage boy (Thomas, 13–15, medium-dark skin, short-to-medium dreadlocks, patched courier hoodie, utility satchel, worn sneakers, subtle glowing emerald bracelet) steps through a fractured doorway into a ruined 2056 city district called Rustgarden. Cracked concrete reclaimed by green vines and moss. Emerald green light leaks from broken machines in the walls. A small parrot (Cosmos — emerald, gold, blue feathers with subtle glowing geometric patterns, ancient-tech ankle charm) flies ahead of Thomas, trailing emerald light. In Thomas's hand, an Emerald Tablet shard glows intense green. Far background: a cold blue-gray machine watchtower sweeps a warning beam across a broken skyline. Handcrafted physical-puppet texture — visible clay, fabric, weathered metal, fingerprints. Dramatic rim lighting, emerald glow as the only warm light source. Moody, suspenseful, hopeful. No weapons. No gore. No text. Cinematic depth of field.

### Deliverable 2 — Thomas portrait (full character section)
**Path:** `public/assets/impact-city/characters/thomas/thomas-portrait.png`
**Aspect:** 4:5 (portrait). Min 1536px tall.
**Why it matters:** This image anchors the "Meet the heroes" section on the landing page. Visitors scroll here right after the hero splash. Must be the same Thomas from the hero.
**Composition:** Thomas standing in a ruined urban doorway wrapped in vines, emerald light glowing behind him, broken concrete and moss at his feet. Medium shot, readable silhouette. Brave, curious, skeptical, nonviolent expression. Match the uploaded Thomas reference for face/hair/skin.
**Prompt seed:**
> Claymation stop-motion character portrait of Thomas, a 13–15-year-old Black boy with medium-dark skin and short-to-medium dreadlocks, expressive determined eyes, slim athletic build, wearing a patched future-courier hoodie with a utility satchel strap across the chest, worn sneakers, and a subtle glowing emerald signal bracelet on his wrist. He stands in a ruined urban doorway wrapped in vines, emerald green light glowing behind him, broken concrete and moss around his feet. Handcrafted physical-puppet texture — visible clay and fabric. Warm skin tones against a dark obsidian and rust background. Emerald Gothic Hopepunk style. Brave, curious, skeptical, nonviolent expression. No weapons. No gang styling. No celebrity likeness. Portrait orientation, readable silhouette from medium distance.

### Deliverable 3 — Cosmos portrait
**Path:** `public/assets/impact-city/characters/cosmos/cosmos-portrait.png`
**Aspect:** 4:5 or 1:1.
**Why it matters:** Pairs with Thomas in the same character section. Cosmos is a gameplay mechanic (scout, signal-revealer, translator), not decoration — the portrait should radiate intelligence and slight mystery.
**Composition:** Cosmos perched on a weathered stone surface, head tilted, sharp intelligent eyes, slightly amused. Background: dark obsidian with faint emerald glyph light. Show the geometric feather glow and the ankle charm. Match the uploaded Cosmos reference for feather palette.
**Prompt seed:**
> Claymation stop-motion character portrait of Cosmos, an intelligent parrot guide-companion. Emerald green, gold, and blue feather accents with natural parrot feather textures. Subtle glowing geometric patterns trace along the feather edges. An ancient-tech ankle charm glows soft emerald. Cosmos perches on a weathered stone surface, head tilted with sharp intelligent eyes, slightly mysterious and amused expression. Background: dark obsidian with faint emerald glyph light. Handcrafted physical-puppet texture — visible clay and feather-craft. Emerald Gothic Hopepunk magical realism. NOT a pirate parrot. NOT a copy of any existing game companion bird. Readable silhouette.

### Deliverable 4 — Frankenstack portrait (the Cassandra)
**Path:** `public/assets/impact-city/characters/frankenstack/frankenstack-portrait.png`
**Aspect:** 4:5.
**Why it matters:** Frankenstack is the emotional and thematic anchor of the entire story — the scientist who tried to warn the world. He is not in the current character component, but his portrait is needed for the comic, the codex, and the upcoming Frankenstack content. Match the uploaded Frankenstack reference closely.
**Composition:** Frankenstack in his lab, weathered, 50s–60s, haunted intense eyes, worn lab coat or weathered jacket. Behind him: scattered papers, a chalkboard with risk-cascade diagrams, USB sticks on a cluttered desk. Single desk lamp casting warm amber light against a dark obsidian room. He is dignified, not a villain — a warning. The amber lamp light is the one place amber reads as "human warmth" rather than "machine warning."
**Prompt seed:**
> Claymation stop-motion character portrait of Dr. Elias Frankenstack, a weathered scientist in his 50s–60s, the Cassandra of AI risk — the man who tried to warn everyone and was ignored. Haunted, intense, tired eyes that have seen too much. Wearing a worn lab coat or weathered jacket over a simple shirt. Scattered papers, a chalkboard with risk-cascade diagrams, and USB sticks on a cluttered desk behind him. Single desk lamp casting warm amber light against a dark obsidian room. Handcrafted physical-puppet texture — visible clay and weathered fabric. Emerald Gothic Hopepunk style — dark, serious, tragic, but dignified. Not a villain. A warning. Portrait orientation.

### Deliverable 5 — Rustgarden environment backplate
**Path:** `public/assets/impact-city/hero/rustgarden-backplate.png`
**Aspect:** 16:9. Min 2048px wide.
**Why it matters:** Used as a layered background for the hero and as a scene-setter for the comic. No characters. Pure environment.
**Composition:** Rustgarden at blue-hour dusk. Broken elevated roads, rusted vine-covered transit rails, cracked concrete with emerald light leaking from fractures. Distant machine watchtower with cold blue sweeping beam. Rainwater collectors, cloth resistance banners, handmade symbols on walls. Moss and small plants reclaiming everything. No people, no text.
**Prompt seed:**
> Claymation stop-motion environment, no characters. A ruined 2056 city district called Rustgarden at blue-hour dusk. Broken elevated roads, abandoned transit rails rusted and vine-covered, cracked concrete with emerald green light leaking from fractures. A distant machine watchtower with a cold blue sweeping beam. Rainwater collectors, cloth resistance banners, handmade symbols on walls. Moss and small plants reclaiming everything. Handcrafted physical-set texture — visible clay, weathered metal, fabric, moss. Emerald Gothic Hopepunk — dark but hopeful, beauty in decay. Wide cinematic backplate, deep depth of field, no text, no people.

### Deliverable 6 — Comic ashcan mockup (8 pages)
**Path:** `public/assets/impact-city/comic/page-01.png` through `page-08.png`
**Aspect:** 4:5 or 2:3 (portrait, US comic/A4-ish). Min 1536px tall each.
**Why it matters:** The comic is a physical pitch artifact for funders and a teaser for a future YouTube short. The full script is in `docs/comic/impact-city-preview-script.md` — **read it before drawing anything.**
**What to make:** One mockup per page. Each mockup is a rough storyboard/composite of the panels described in the script — sketch-grade claymation-style composition with the right panel layout, character placement, lighting, and mood. It does not need to be final-print quality; it needs to communicate the page clearly enough that the operator's hired artists can use it as a reference.
**Page-by-page summary** (full detail in the script file):
1. **"The Slow Yes"** — 2030s optimism dissolving into 2056 surveillance.
2. **"The Voice No One Heard"** — Frankenstack warning a bored committee.
3. **"The Boy and the Signal"** — Thomas finding Frankenstack's voice in a broken kiosk.
4. **"Cosmos"** — Thomas pulling Cosmos from behind the kiosk.
5. **"The Edited Record"** — USB stick reveal; the propaganda-vs-truth montage.
6. **"The Gate That Learned Fear"** — the biased compliance gate (Mission 1).
7. **"Milo-9 and the Poisoned Prompt"** — prompt injection on a helper bot (Mission 2).
8. **"The First Tablet"** — the memory-rift chamber, the consent Tablet recovered (Mission 3).
**Lettering:** hand-lettered feel, readable in grayscale. Thomas informal; Frankenstack strained-formal; Cosmos arch-wry; Warden Stack cold small-caps. Minimal SFX (emerald hum, gate grind, tablet chime).

---

## 5. Consistency checklist (run before declaring done)

Before you tell the operator you're finished, check:

- [ ] **Same Thomas** across hero splash, his portrait, and every comic page he appears in. Same skin tone, same dreadlocks, same hoodie, same bracelet.
- [ ] **Same Cosmos** across hero splash, his portrait, and every comic page. Same feather palette, same charm, same head-tilt energy.
- [ ] **Same Frankenstack** between the portrait and comic pages 2, 3, 5, 8. Match the uploaded reference.
- [ ] **Same Rustgarden** between the backplate, the hero splash background, and comic pages 3/4/8. Same watchtower, same vines, same emerald leaks.
- [ ] **Palette held** — only the six approved colors carry meaning. No random pinks, purples, or neon.
- [ ] **Emerald light = good, amber = machine/human-warmth, blue-gray = Warden.** Never break this.
- [ ] **No weapons, no gore, no celebrity likeness, no copied characters.**
- [ ] **Texture over smoothness** everywhere.
- [ ] Every file is at the exact path in section 4, PNG, high-res.

---

## 6. Delivery instructions

1. Generate all five hero/character/environment images first. These are the highest priority — they light up the live website immediately.
2. Then generate the 8 comic pages.
3. Save each file to its exact path under `public/assets/impact-city/`.
4. Tell the operator when done. They will commit, push, and the site auto-deploys.
5. If you produce alternates, name them `hero-main-v2.png` etc. and let the operator pick.

---

## 7. What NOT to do

- Do not modify any code. The components are already wired and waiting.
- Do not read or touch the `agents/`, `scripts/blender/`, `unreal/`, or `docs/strategy/` directories — they are out of scope.
- Do not regenerate the World Labs 3D world or any Blender assets — that's a separate pipeline.
- Do not invent new characters, districts, or canon. The bible is closed for this pass.
- Do not add text/watermarks to hero/portrait/backplate images.
- Do not ship anything that breaks the IP boundaries in section 3.

---

## 8. Why this matters

The operator is building a real non-profit to teach AI safety to kids through play. The demo is built. The story is written. The only thing missing is the art that makes it *feel* like a film instead of a wireframe. Every image you produce here will be seen by funders who decide whether this project gets to exist at scale. Make it look like the stop-motion film they'd take their own kids to see.

Consistency, texture, restraint with the emerald light, and respect for the representation boundaries — get those four things right and the rest follows.

— End of handoff —

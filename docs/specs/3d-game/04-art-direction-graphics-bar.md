# 04 — Art Direction & Graphics Bar

**Reference bar:** *South of Midnight* (Compulsion Games, 2025; Unreal Engine 4; runs at 60 fps with a stop-motion look built from clay maquettes by Clyde Henry Productions; the cutscene stop-motion effect can be toggled; won Games for Impact at TGA 2025 and Best New IP at BAFTA) [R8].
**Rule:** we match its **techniques and emotional read**, never its characters, names, models, art, music, or story (canon: `character-bible-thomas-cosmos.md`). Our identity is **Emerald Gothic Hopepunk**.

## 1. What makes that bar, broken into things we can build

| Technique | Why it works | Our implementation (web R3F) | Measurable acceptance |
|---|---|---|---|
| **Animation on twos** | Handmade, tactile, "crafted" read | Character skeletal anims sampled at 12 fps (stepped), root motion and camera at 60 fps. Toggle in settings. Cutscenes on twos, gameplay characters on twos with interpolated root | Pose updates every 83 ms ±5; camera frame time ≤16.7 ms |
| **Handmade materials** | Fingerprints, fabric weave, chipped paint | Custom `MeshStandardMaterial` extension: triplanar "clay thumbprint" normal detail, a fabric weave on Thomas's hoodie, hand-painted roughness. Baked in Blender (pipeline exists: `scripts/blender/`) | Material review against a 6-swatch board, gauntlet art ≥8.5 |
| **Silhouette-first characters** | Reads at any distance | Thomas: dreadlock mass + satchel + hoodie shape; Cosmos: oversized head/tail ratio, charm glint. Test: black-fill silhouettes readable at 64 px | Silhouette test passes for 5 poses each |
| **Painterly light key** | Mood per scene | One key light per zone + baked lightmaps + emissive emerald signals; height fog; 3 LUTs (dusk-rust, warden-cold, archive-warm) | Palette sampled from frames stays within the palette tokens below |
| **Folklore framing** | Myth as world logic | Tablets hidden in murals, quilts, songs; Echo Visions styled as a moving storybook (paper grain, cut-out parallax) | Every Tablet location has a folklore object |
| **Companion with personality** | Emotional anchor | Cosmos: 40+ idle/react animations, head tilts, perching on Thomas's shoulder/satchel, flight that banks and flares | Cosmos on screen or audible ≥80% of play time |
| **Sound as world** | Reviewers singled out its audio | Existing WebAudio cues + 3 music stems + a diegetic Warden hum that grows with the clock | No silent encounter |

## 2. Palette tokens (canon, from the comic brief)

Obsidian `#080A0D` · Rust `#7A3F24` · Deep moss `#1F3D2B` · **Emerald signal** `#19F59A` (hope/truth) · **Warning amber** `#FFB84D` (machine warning) · Bone paper `#E8DDC7` · Warden cold blue-grey (define `#6E7E8C`). Emerald and amber must also differ by icon/shape for colour-blind players.

## 3. World approach

- **Base:** the existing World Labs Marble 1.1 Rustgarden world. Render the Gaussian splats with **Spark** (`sparkjsdev/spark`, a three.js splat renderer by World Labs). Use the **collider GLB** for physics. Start with the 500k SPZ, and fall back to 150k/100k on lower-tier GPUs.
- **Hero props** are meshes placed on top (existing GLBs: gate, terminal, kiosk, bench, water filter, tablet), restyled with the clay material.
- **Risk:** splats don't respond to dynamic light or to the "record decay" shader the way meshes do. Mitigation: record decay applies to meshes + a screen-space desaturation mask driven by volume triggers. **Phase 0 must prove this looks good** or fall back to a Blender-baked mesh district.
- More chapter spaces (archive interior, the Board forum space, Echo Vision sets) come from new Marble generations or Blender kits.

## 4. Characters (production path)

Placeholders exist (`thomas-placeholder.glb`, `cosmos-placeholder.glb`). Production needs: a rigged Thomas (humanoid, ~15k tris, face blendshapes for 8 expressions) and a rigged Cosmos (custom bird rig, wing IK, ~8k tris). Path: concept sheets (GPT-5.5 art handoff exists: `docs/handoffs/2026-06-22-imagery-handoff-gpt55.md`) → image-to-3D or hand sculpt → retopo + rig in Blender → animation library (Mixamo-compatible humanoid for Thomas; hand-keyed for Cosmos). Don't let any AI tool output a likeness of a real person. Canon: medium-dark skin, short-to-medium dreadlocks, slim athletic build, patched courier hoodie, emerald bracelet.

## 5. Echo Vision look

Pre-rendered 5–8 s clips (fal.ai image-to-video, seeded from our own key art so faces don't drift) + a storybook frame: paper grain overlay, cut-out parallax, emerald ink bleeding in at choice points. A shared visual prompt prefix keeps every clip on-model (`05` §6).

## 6. Performance budgets (reference laptop: integrated/entry GPU class, e.g. a 2022 mid-range laptop; pin the exact device in Phase 0)

- 60 fps target, **≥45 fps p95** floor; draw calls ≤300; triangles on screen ≤800k (+ splats); texture memory ≤512 MB
- Initial load ≤15 MB before the first interactive frame (stream the rest); time-to-play ≤10 s on 50 Mbps
- `?quality=low|med|high` + auto-detect

## 7. Anti-slop list

No generic "AI gradients," no purple neon, no glossy plastic characters, no stock sci-fi HUD. The UI is diegetic first (the bracelet, district screens, paper cards). Otherwise it's bone-paper cards with rust ink.

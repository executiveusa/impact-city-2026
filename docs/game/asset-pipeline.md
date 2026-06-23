# Asset Pipeline

The MVP ships with CSS-drawn placeholders (no binary art), so it runs anywhere
with zero asset weight. This document is the production handoff for real art.
Enforced by the `asset-pipeline-manager` skill.

## MVP rule

> **Use placeholders first. Do not block gameplay on perfect art.**

The current build uses pure CSS for the Rustgarden stage, character "voice"
panels, mission cards, and UI. No image assets are required to play.

## World Labs Rustgarden world (embedded)

A real 3D Rustgarden was generated on 2026-06-22 via World Labs Marble
(`marble-1.1`, world_id `12a94092-2411-48d0-8a9e-6a2c0804348e`, 1580 credits).
The equirectangular panorama (4608×2304) is mirrored locally so the embed
survives any CDN expiry:

```
public/assets/worldlabs/rustgarden/
  pano.png          # 12MB equirect panorama (drag-to-pan 360)
  thumbnail.webp    # 27KB blurred placeholder
```

Embedded into the hero via `src/game/components/hero/RustgardenWorld.tsx`
as a drag-to-pan background. The full walkable Marble viewer is linked in a
new tab ("⟶ Step into Rustgarden 3D") because World Labs' viewer page sets
`X-Frame-Options: DENY` / CSP `frame-ancestors 'none'` and cannot be
iframed directly.

Raw asset URLs (World Labs CDN, may expire — local mirror is canonical):
- Pano: `https://cdn.marble.worldlabs.ai/12a94092.../d49f9402..._panos/rgb_0.png`
- Splats: `100k / 150k / 500k / full-res` `.spz`
- Collider mesh: `07902c91.glb`
- Viewer: `https://marble.worldlabs.ai/world/12a94092-2411-48d0-8a9e-6a2c0804348e`

Generation response preserved at
`public/assets/worldlabs/rustgarden-world-response.json` and manifest at
`public/assets/worldlabs/worldlabs-manifest.json`.



## Folder structure (created)

```
public/assets/impact-city/
  characters/      # Thomas, Milo-9, NPCs
  environments/    # Rustgarden district, districts 2–6
  props/           # gate, terminal, kiosk, bench, garden
  ui/              # icons, frames, banners
  audio/           # ambient, SFX, voice (future)
  story-cards/     # comic-style intro / outro beats
```

## Placeholder → production filename plan

```
characters/   thomas-placeholder.glb        → thomas.glb
              milo9-placeholder.glb          → milo9.glb
              frankenstack-placeholder.png   → frankenstack.png
              warden-avatar-placeholder.png  → warden-avatar.png
environments/ rustgarden-gate.png
              rustgarden-hub-bg.png
              memory-rift-bg.png
props/        appeal-terminal.png
              learning-kiosk.png
              solar-bench.png
              water-filter.png
              community-garden.png
              emerald-tablet-consent.png
              warden-terminal.png
ui/           logo-emerald.svg
              icon-civic-trust.svg
              icon-scrap.svg
              icon-impact.svg
              frame-paper.png
audio/        ambient-rustgarden.ogg
              sfx-gate-open.ogg
              sfx-tablet-pickup.ogg
              voice-frankenstack-intro.ogg
story-cards/  intro-beat-01.png … intro-beat-06.png
```

## Preferred production tools

- **Blockbench** — low-poly characters, props, robots (Milo-9, terminals).
- **Material Maker** — procedural textures (rust, moss, concrete, emerald glow).
- **Pencil2D** — hand-drawn story cards for the intro/outro.
- **Pixelorama** — pixel/isometric fallback (if 3D is dropped).
- **LDtk / Tiled** — level/blockout maps if we move to 2.5D.
- **Audacity** — sound cleanup.
- **Blender** — only if the repo adopts a heavier 3D pipeline.

## Licensing rules

- Prefer MIT, Apache-2.0, BSD, CC0, or otherwise permissive assets.
- Do **not** copy protected art, music, characters, or proprietary logic.
- "South of Midnight" is **inspiration only** (handcrafted Gothic magical
  realism, stop-motion feel). Do not reproduce its characters, names, models,
  music, or exact art. See `story-bible.md`.

## Replacing a placeholder

1. Drop the production file into the matching folder with the target filename.
2. Swap the CSS-drawn element for an `<img>`/`<model>` import in the component.
3. Keep an `alt`/aria-label for accessibility (subtitles always on).

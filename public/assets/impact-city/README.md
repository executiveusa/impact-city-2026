# Impact City Assets

See `docs/game/asset-pipeline.md` for the full plan.

## MVP rule
The game ships with **CSS-drawn placeholders** — no binary art is required to
play. This folder is the production handoff for real assets.

## Structure
```
characters/    Thomas, Milo-9, Frankenstack, Warden avatar, NPCs
environments/  Rustgarden district, memory-rift, future districts
props/         gate, terminal, kiosk, bench, garden, tablet
ui/            logo, icons, frames, banners
audio/         ambient, SFX, voice (future)
story-cards/   intro/outro comic beats
```

## Licensing
Prefer MIT / Apache-2.0 / BSD / CC0. **Never** copy protected art, music,
characters, or proprietary logic. "South of Midnight" is inspiration only.

## Placeholder → production filenames
See `docs/game/asset-pipeline.md` for the canonical name list (e.g.
`thomas-placeholder.glb` → `thomas.glb`).

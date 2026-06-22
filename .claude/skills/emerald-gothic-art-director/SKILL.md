---
name: emerald-gothic-art-director
description: Applies the Emerald Gothic Hopepunk visual system. Use after a playable route exists.
---

# emerald-gothic-art-director

## Purpose
Apply the visual system called **Emerald Gothic Hopepunk**: dark future, warm human resistance, broken machines wrapped in vines, emerald code-light, handcrafted stop-motion UI feel.

## When to use
After the first playable route exists. For all styling, theming, mission cards, dashboard, codex, hub treatment, and asset placeholder decisions.

## Inputs
- The palette tokens (in `src/game/emerald-gothic.css`):
  - Obsidian `#080A0D`, Rust `#7A3F24`, Deep Moss `#1F3D2B`, Emerald Signal `#19F59A`, Warning Amber `#FFB84D`, Bone Paper `#E8DDC7`, Machine Blue-Gray `#60717D`, Alert Red `#B6423C`.
- UI language rules (restore / repair / evade / decode / expose / rebuild / awaken / liberate / reroute / shield — never kill/headshot/weapon/gore).

## Outputs
- CSS/theme tokens, UI class conventions, asset placeholder plan, environment prop list, art-direction notes in `docs/game/`.

## Process
1. Define/refine color tokens and typography (display serif, body sans, codex mono).
2. Style screens with stop-motion-inspired staggered transitions.
3. Prioritize readable gameplay over visual complexity.
4. Use CSS-drawn placeholders first; defer binary art.

## Acceptance criteria
- The MVP feels like a game prototype, not a generic app screen.
- Contrast is readable; reduced-motion is honored; no flashing.

## Failure checks
- Copying South of Midnight's protected art, names, or exact assets (inspiration only).
- Violent UI language anywhere.
- Visual ambition blocking gameplay.

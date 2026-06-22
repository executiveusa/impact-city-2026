/**
 * heroBuilder — emits the canonical hero copy + section plan.
 * The actual hero is implemented in src/game/components/hero/. This tool
 * returns the copy/structure so an agent or human can regenerate sections.
 */
export function buildHeroCopy() {
  return `=== Impact City Hero Copy + Section Plan ===

TITLE: Impact City: The Emerald Algorithm
SUBTITLE: In 2056, the machines turned Earth into a prison. Thomas and Cosmos
  must recover the stolen Emerald Tablets, rebuild broken cities, and prove
  that play can repair the real world.

PRIMARY CTA: Play Mission
SECONDARY CTA: Meet Thomas & Cosmos
IMPACT CTA: View Real-World Impact

SECTIONS:
  1. Hero (title, subtitle, CTAs, sound toggle, Cosmos fly-by, tablet glow)
  2. Characters (Thomas, Cosmos) — from src/game/data/characters.ts
  3. Abilities (Cosmos companion abilities) — from companionAbilities.ts
  4. Impact teaser (simulated disclosure)

VISUAL TREATMENT: Emerald Gothic Hopepunk (see emerald-gothic.css + hero.css)
MOTION: GSAP (heroTimelines.ts) — reduced-motion respected
SOUND: WebAudio (soundManager) — no autoplay`;
}

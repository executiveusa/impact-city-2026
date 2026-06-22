/**
 * Impact City — Character Canon: Thomas & Cosmos.
 *
 * Canonical character data. The uploaded reference image is canon. Enforced by
 * story-bible-continuity. Do NOT copy South of Midnight or any existing game's
 * characters — high-level inspiration only (handcrafted Gothic magical realism,
 * young protagonist, companion helper mechanic).
 *
 * Thomas is the hero, not a side character. Cosmos is a guide-companion with
 * real gameplay function, not decoration.
 */

export type CharacterId = "thomas" | "cosmos";

export interface Character {
  id: CharacterId;
  name: string;
  role: string;
  tagline: string;
  /** One-paragraph canon description used in the hero + codex. */
  description: string;
  /** Physical appearance (from canon reference image). */
  appearance: string[];
  /** Personality traits for dialogue + narrative consistency. */
  personality: string[];
  /** Gameplay function — what they DO in the MVP. */
  gameplayRole: string;
  /** Voice guide for writers. */
  voiceGuide: string;
  /** Generation prompt for the asset pipeline (Blender/WorldLabs/HF). */
  generationPrompt: string;
  /** Things to explicitly avoid (anti-stereotypes, copyright boundaries). */
  avoid: string[];
}

export const CHARACTERS: Character[] = [
  {
    id: "thomas",
    name: "Thomas",
    role: "Young protagonist — courier, scavenger, builder, truth-finder.",
    tagline: "The kid the machines forgot to score.",
    description:
      "Thomas is a 13–15-year-old boy in Earth 2056. He cannot overpower the Warden Stack, so he outthinks, outbuilds, reconnects, repairs, and awakens communities. He sees 'living signal' inside broken systems. He is the hero of Impact City — brave, observant, skeptical, dry under pressure, and emotionally grounded.",
    appearance: [
      "Young Black boy, age 13–15",
      "Medium-dark skin, expressive eyes",
      "Short-to-medium dreadlocks",
      "Slim athletic build",
      "Patched future-courier jacket or hoodie",
      "Utility satchel",
      "Worn sneakers",
      "Emerald signal bracelet (subtle glow)",
    ],
    personality: [
      "Curious and brave",
      "Observant — notices what machines miss",
      "Skeptical of anything that says 'for your safety'",
      "Dry, occasionally funny under pressure",
      "Emotionally real — carries guilt over his lost family district",
      "Nonviolent by conviction, not by weakness",
    ],
    gameplayRole:
      "Thomas is the player character. He explores districts, decodes corrupted systems, repairs civic infrastructure, exposes AI harms, frees trapped citizens, rebuilds community assets, and recovers the Emerald Tablets. He never wins by killing.",
    voiceGuide:
      "Young but not childish. Skeptical and dry. Example: 'I'm starting to think every machine that says \"for your safety\" is about to make my day worse.'",
    generationPrompt:
      "Create a stylized 3D game character of Thomas, a 13–15-year-old Black boy with medium-dark skin and short-to-medium dreadlocks, expressive eyes, slim athletic build, wearing a patched future-courier hoodie/jacket, utility satchel, worn sneakers, and a subtle emerald signal bracelet. He is brave, observant, nonviolent, and hopeful. Style: Emerald Gothic Hopepunk, handcrafted stop-motion-like texture, dark future city with warm human resistance. Avoid stereotypes, weapons, gang styling, violence, or photoreal celebrity likeness. Game-ready silhouette, readable from medium distance, optimized for web/Unreal pipeline.",
    avoid: [
      "Gang, crime, or weaponized styling",
      "Sidekick energy — Thomas is the lead",
      "Photoreal celebrity likeness",
      "Copying any existing game's protagonist",
    ],
  },
  {
    id: "cosmos",
    name: "Cosmos",
    role: "Parrot guide-companion — scout, translator, signal-revealer.",
    tagline: "The eyes Thomas doesn't have.",
    description:
      "Cosmos is Thomas's parrot guide and assistant with special powers. Cosmos is not decoration — it's a gameplay mechanic. Cosmos can scout paths Thomas can't reach, activate unreachable switches, detect corrupted AI signals, translate tablet glyphs, and reveal hidden memory echoes. Sharp, funny, loyal, mysterious.",
    appearance: [
      "Intelligent parrot, mid-sized",
      "Emerald, gold, and blue feather accents",
      "Subtle glowing geometric feather patterns",
      "Ancient-tech ankle charm",
      "Readable silhouette from medium distance",
      "Expressive head tilts and wing gestures",
    ],
    personality: [
      "Sharp and quick-witted",
      "Funny — dry commentary on the Warden Stack",
      "Loyal to Thomas",
      "Mysterious — knows more than it says",
      "Curious about old human things",
    ],
    gameplayRole:
      "Cosmos is a companion helper mechanic. It reaches places Thomas cannot and reveals information systems hide. Abilities: Scout, Signal Ping, Glyph Translate, Echo Reveal, Small Passage Flight, Distraction Flutter, Consent Scan. See companionAbilities.ts.",
    voiceGuide:
      "Sharp, funny, loyal, slightly mysterious. Example: 'Two watcher-lights, one open window, and a Warden that can't count. This is going to be fun.'",
    generationPrompt:
      "Create a stylized 3D companion parrot named Cosmos. Cosmos is Thomas's guide and assistant. He has emerald, gold, blue, and natural parrot feather accents with subtle glowing geometric feather patterns and an ancient-tech ankle charm. He can scout, reveal hidden signals, translate glyphs, and reach places Thomas cannot. Style: Emerald Gothic Hopepunk, magical-realism, handcrafted, expressive, readable silhouette, friendly but mysterious. Avoid copying any existing game companion.",
    avoid: [
      "Copying any existing game companion bird",
      "Pure decoration — Cosmos must have real gameplay function",
      "Cliché pirate-parrot styling",
    ],
  },
];

export const CHARACTER_BY_ID: Record<CharacterId, Character> = Object.fromEntries(
  CHARACTERS.map((c) => [c.id, c]),
) as Record<CharacterId, Character>;

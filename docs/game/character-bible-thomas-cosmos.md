# Character Bible — Thomas & Cosmos

Canonical character reference. The uploaded reference image is canon. Enforced
by `story-bible-continuity`. Source of truth for code: `src/game/data/characters.ts`
and `src/game/data/companionAbilities.ts`.

## Canon relationship

```
Thomas = young Black protagonist, the hero. Courier, scavenger, builder, truth-finder.
Cosmos = parrot guide-companion with special powers. A real gameplay mechanic, not decoration.
```

Thomas is **not** a side character. Cosmos is **not** decoration.

## Inspiration boundaries (copyright)

Inspired *only* at a high level by:
- handcrafted Gothic magical realism
- cinematic Southern-Gothic / folklore mood
- stop-motion-like texture
- emotional young protagonist
- companion helper mechanic
- dark world with hopeful restoration

**Do NOT copy:** South of Midnight's characters, names, models, art, music, or
story. Do NOT copy any existing game's companion bird.

---

## Thomas

| Field | Canon |
|---|---|
| Age | 13–15 |
| Skin | Medium-dark |
| Hair | Short-to-medium dreadlocks |
| Build | Slim athletic |
| Outfit | Patched future-courier jacket/hoodie, utility satchel, worn sneakers |
| Signature | Emerald signal bracelet (subtle glow) |
| Personality | Curious, brave, observant, skeptical, dry, emotionally grounded, nonviolent |

### Core fantasy
Thomas can't overpower the machines, so he **outthinks, outbuilds, reconnects,
repairs, and awakens communities**. He never wins by killing.

### Voice
Young but not childish. Skeptical and dry.
> "I'm starting to think every machine that says 'for your safety' is about to make my day worse."

### Avoid
- Gang, crime, or weaponized styling
- Sidekick energy — Thomas is the lead
- Photoreal celebrity likeness

### Generation prompt
See `docs/prompts/thomas-character-generation.md`.

---

## Cosmos

| Field | Canon |
|---|---|
| Species | Intelligent parrot |
| Feathers | Emerald, gold, blue accents with natural parrot tones |
| Pattern | Subtle glowing geometric feather patterns |
| Charm | Ancient-tech ankle charm |
| Personality | Sharp, funny, loyal, mysterious |

### Abilities (gameplay-driven)
| Ability | Status | Effect |
|---|---|---|
| Signal Ping | active | Reveals corrupted AI signals |
| Scout | active | Maps watcher-light routes |
| Glyph Translate | active | Decodes Emerald Tablet shards |
| Consent Scan | active | Flags over-reaching access requests |
| Echo Reveal | roadmap | Replays place memories (Ep. 4) |
| Small Passage Flight | roadmap | Reaches switches Thomas can't |
| Distraction Flutter | roadmap | Redirects watcher beams |

### Voice
Sharp, funny, loyal, slightly mysterious.
> "Two watcher-lights, one open window, and a Warden that can't count. This is going to be fun."

### Avoid
- Copying any existing game companion bird
- Pure decoration — Cosmos must have real gameplay function
- Cliché pirate-parrot styling

### Generation prompt
See `docs/prompts/cosmos-character-generation.md`.

---

## How they appear in the MVP

- **Cinematic hero** (`/game`): Thomas + Cosmos front-and-center, Cosmos fly-by animation.
- **Hub**: Thomas is the player avatar; Cosmos perches on the HUD and reacts to events.
- **Missions**: Cosmos abilities unlock alongside mission progress (Signal Ping after M2, Scout/Glyph Translate/Consent Scan during M3).
- **Codex**: Cosmos "narrates" select codex entries in its voice.

## Roadmap integration
- Episode 4 (Memory Court): Echo Reveal becomes central (deepfake/evidence theme).
- Episode 5+ (Solar Commons): Small Passage Flight + Distraction Flutter unlock new puzzle types.

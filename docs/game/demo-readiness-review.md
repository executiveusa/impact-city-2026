# Impact City — Full Game Review & Demo Path

**Date:** 2026-06-23
**Reviewer:** ZCode (build lead)
**Scope:** Honest audit of the playable `/game` route + the shortest path to a funder-ready demo with real character art.

---

## TL;DR (the honest one-paragraph version)

The game is **functionally playable today** — 3 missions, full objective loop, save system, codex, impact dashboard, rebuild shed. But it is **100% CSS-drawn**: zero character art in gameplay, Cosmos exists only as landing-page decoration (no gameplay mechanic), 2 of 3 accessibility toggles are dead, there's no fail state and no finale. The biggest gap between what we *pitch* ("Thomas + Cosmos do what no one else can") and what we *ship* is that **Cosmos never appears in the actual game.** Fixing that + wiring real character portraits into the two screens where characters speak (Hub + Mission) is the single highest-leverage move toward a demo.

---

## 1. What's actually built and working ✅

| System | State | Notes |
|--------|-------|-------|
| Routing | ✅ | `/` Landing, `/game` Game, clean redirects |
| Save/load | ✅ | localStorage `impact_city_save_v1`, SSR-safe, migration stub forward-only |
| State machine | ✅ | 7 actions, reducer + GameProvider + `useGame` hook |
| 3 missions | ✅ | m1 Compliance Gate, m2 Poisoned Prompt, m3 Consent Tablet — each with 3 objectives |
| 5 objective types | ✅ | Inspect, Scan, Stealth, Choose, Action (generic) |
| Codex | ✅ | 10 entries, 4 starter + 6 unlockable, locked-state UI |
| Impact dashboard | ✅ | 4 stat cards, 5 causes, recent events, "simulated" disclosure |
| Rebuild shed | ✅ | 4 assets, scrap/trust gating, fund-split disclosure |
| Resource HUD | ✅ | Civic trust / scrap / impact / missions / tablet |
| Landing page hero | ✅ | World Labs panorama + video slot + image slot, all auto-detecting |
| Audio engine | ✅ | 9 WebAudio cues, mute/volume/persist — **but wired to landing only, not gameplay** |

The bones are solid. Save a funder a URL today and they can play 3 missions start to finish.

---

## 2. What's broken, missing, or misleading 🚩

Listed in priority order — the top ones block the demo pitch.

### 🚩 P0 — Cosmos is not in the game (the biggest gap)
`companionAbilities.ts` declares 4 "active" Cosmos abilities (signal_ping, scout, glyph_translate, consent_scan) and `characters.ts` calls Cosmos "a gameplay mechanic, not decoration." **Zero gameplay screens import or invoke any of them.** In `/game`, Cosmos never appears — not in the hub, not in missions, not in dialogue. The mission puzzles solve themselves via generic ObjectiveView renderers. This is the single biggest gap between pitch and product. A funder who reads the landing page ("Cosmos can scout, reveal hidden signals, translate glyphs") and then plays the game will notice Cosmos is absent.

### 🚩 P0 — No character art anywhere in gameplay
Every gameplay screen is CSS gradients + emoji. Thomas, Cosmos, Warden Stack, Milo-9 are **text-only voice boxes**. The image-probing slots (`/assets/impact-city/characters/...`) only exist in `hero/*` (landing page). The game itself has no `<img>` tags at all. This is what makes the game feel like a wireframe instead of a film.

### 🚩 P1 — No fail state, no finale
- The reducer has no `FAIL` action. Every objective is infinitely retryable. Stealth "caught" just resets progress to 0. **The game is literally unwinnable-to-lose.**
- Completing mission 3 dumps the player into the Rebuild shed with no ending screen, no "you recovered the First Tablet" climax, no credits. The arc has no resolution.

### 🚩 P1 — 2 of 3 accessibility toggles are dead
- `subtitles` toggle: does nothing (subtitles always render).
- `simpleLanguage` toggle: does nothing (CodexPanel never reads it).
- `reducedMotion` toggle: partial — works for Stealth (hides Sweep button) but **StoryIntro's docstring claims it respects reducedMotion and it does not.**

### 🟡 P2 — Misleading "spatial hotspot" framing
HubZone docstring says "interactive hotspots" and the asset pipeline implies a 2.5D district map. Reality: **it's a vertical list of mission cards + a row of terminal buttons.** No spatial interaction. Fine for MVP, but the docstring oversells it.

### 🟡 P2 — ScanObjective hard-codes its answer
The scan puzzle finds the "dangerous fragment" by regex `/ignore all prior rules/i` against fragment *text*, ignoring the `correctOptionId` field that mission data explicitly sets. If any future scan objective's bad fragment doesn't contain that exact phrase, the puzzle becomes unsolvable. Load-bearing content coupling.

### 🟡 P2 — GameShell blank-stage bug
If `screen === "mission"` but `currentMissionId` is null (possible after a corrupt save or edge-case reset), the stage renders **nothing** — no back button, no escape. Player is soft-locked.

### 🟡 P2 — Audio is dead in gameplay
The 9-cue WebAudio engine is fully built and tested, but **only `hero/*` components use it.** No gameplay screen plays a sound. Missions are silent. The "emerald tablet chime" cue exists and is never fired.

### 🟡 P3 — Economy math is tight
Player earns 25 scrap total across 3 missions; 4 rebuild assets cost 52 scrap combined. **You cannot buy all 4 assets in one playthrough.** Could be intentional scarcity, could be an oversight — needs a design decision. (Civic trust math is fine: 4 earnable, 4 needed total across all gates.)

### 🟡 P3 — Objective renderer incomplete vs. type contract
`types.ts` declares `decode`, `persuade`, `expose` objective kinds. The MissionRunner switch has no cases for them — they fall through to one-click Action. Not currently triggered by data, but the type contract promises more than the renderer delivers.

### 🟡 P3 — `DialogueBox.speaker` prop is dead
Never passed by any caller. Speaker names are inlined in line strings ("Thomas: '...'") instead. Cosmetic.

### 🟡 P3 — Mission progress not persisted
Refreshing mid-mission resets to objective 0 of the same mission. Intentional but a UX gap.

---

## 3. The demo path — shortest route to "playable with real characters"

Assume the GPT-5.5 art handoff produces: `hero-main.png`, `thomas-portrait.png`, `cosmos-portrait.png`, `frankenstack-portrait.png`, plus a Rustgarden backplate. Here's the priority order for wiring that art + closing the gameplay gaps.

### Phase 1 — Characters appear in gameplay (1 day, highest impact)
**Goal:** Make Thomas and Cosmos visible and voiced in the two screens where they speak.

1. **HubZone character strip** — add a Thomas portrait + Cosmos portrait next to their voice lines (currently bare text boxes). Probe `/assets/impact-city/characters/thomas/thomas-portrait.png` and `cosmos/cosmos-portrait.png` with the same `useImageExists` pattern from `ThomasCosmosHero.tsx`. Fall back to a CSS monogram if missing.
2. **MissionRunner speaker portraits** — when an objective's briefing mentions Thomas or Cosmos, show their portrait in the header. Same probe pattern.
3. **Cosmos appears in the Scan objective** — the m2 scan puzzle already involves "revealing hidden text." Relabel it as Cosmos's `signal_ping` ability. Add a Cosmos portrait + the line "Cosmos reveals the hidden signal…" This is the cheapest possible way to make Cosmos a gameplay presence — it's literally re-skinning an existing puzzle. **This single change closes the P0 Cosmos gap for the demo.**

### Phase 2 — Make it feel like a film (1-2 days)
4. **Mission backplates** — each mission gets a wide Rustgarden backplate behind the objective UI (use `rustgarden-backplate.png`, tinted per district). Currently the mission stage is a flat dark void.
5. **Wire audio into gameplay** — fire `emerald_tablet_chime` on Tablet recovery (m3), `cosmos_wing_flutter` when Cosmos appears in m2 scan, `ui_confirm_restore` on rebuild purchases. The cues exist; they just need `.play()` calls. ~10 lines of code.
6. **Frankenstack portrait in the Codex** — when a player opens the Frankenstack/Cassandra codex entries, show his portrait. He's the emotional anchor of the story and currently has no face in the game.

### Phase 3 — Close the demo-breaking gaps (1 day)
7. **Finale screen** — after mission 3 + at least one rebuild purchase, route to a new `MissionFinale` component: "You recovered the First Tablet. Seven remain. The Warden is watching." Reuse `MissionComplete` styling. Without this, the demo has no ending.
8. **Fix GameShell blank-stage bug** — add a fallback: if `screen === "mission"` and `currentMissionId` is null, route to hub.
9. **Fix StoryIntro reducedMotion** — actually branch on `state.reducedMotion` (longer hold time or skip the auto-advance). Currently the docstring lies.

### Phase 4 — Polish for funders (optional, half-day each)
10. **Make `subtitles` and `simpleLanguage` toggles actually do something**, or remove them. Dead toggles look unfinished.
11. **Fix ScanObjective to use `correctOptionId`** instead of regex. Future-proofs the puzzle.
12. **Spatial hub** (bigger lift) — turn the mission list into actual clickable hotspots on the Rustgarden backplate. This is the "2.5D district" the docstring promises. Defer if budget is tight; the list works.

---

## 4. What I would NOT do for the demo

- **Don't build the fail state.** Nonviolent + unwinnable-to-lose is on-brand for the thesis. Lean into it; don't apologize for it. (Just don't claim "missions have stakes" in the pitch — say "missions teach through revelation, not punishment.")
- **Don't expand to 8 tablets.** 3 missions is a demo. 8 is a product. Save the scope.
- **Don't build the spatial hub unless Phase 1-3 land first.** It's the longest lift with the lowest marginal demo value vs. just having characters appear.
- **Don't generate a Fal hero video until `hero-main.png` exists.** i2v needs the still first; t2v drifts faces.

---

## 5. The one-screen demo pitch

If a funder has 90 seconds, here's the path that currently exists:

1. Land on `/` → see the World Labs Rustgarden panorama + (soon) hero video.
2. Click "Play Mission" → MainMenu → StoryIntro (7-line crawl).
3. Enter HubZone → see Thomas + Cosmos portraits (after Phase 1), pick Mission 1.
4. Solve 3 objectives (inspect the gate, repair the terminal, choose the appeal).
5. Mission complete → codex unlocks → back to hub.
6. Repeat for m2 (with Cosmos's signal ping) and m3 (stealth + First Tablet).
7. Buy a rebuild asset → see the impact dashboard.
8. Finale screen (after Phase 3).

That's a real demo. The only thing standing between today and that demo is **Phase 1** (characters appear) + **Phase 3** (finale + bug fixes). Everything else is polish.

---

## 6. Open question for you

The economy math (25 scrap earnable vs. 52 needed for all 4 assets) — is that intentional scarcity (the player has to choose which assets to rebuild, which is actually a *good* thematic beat for "you can't fix everything alone") or an oversight? I'd vote **intentional** and lean into it in the pitch: "In Impact City, you can't buy your way to a better world — you have to choose what matters most." That's a stronger story than "collect all 4."

— End of review —

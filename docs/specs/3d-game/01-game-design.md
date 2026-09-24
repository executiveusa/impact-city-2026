# 01 — Game Design Spec (3D vertical slice)

## 1. Pillars (every feature must serve at least one)

1. **Outthink, don't overpower.** Nonviolent verbs only: inspect, scan, decode, repair, reroute, persuade, expose, restore, stealth.
2. **Cosmos is the second half of the controller.** Half of every puzzle needs a Cosmos ability. Remove Cosmos and the game doesn't work. That's how we know he isn't decoration.
3. **Evidence over vibes.** Progress comes from gathering and using evidence (Evidence Cards, `02` §7).
4. **Dread that ratchets, hope that's earned.** Koontz 5-ratchet on every beat. The world visibly degrades and gets visibly repaired.
5. **Real risk, kid-legible.** Every chapter teaches one real AI-safety failure mode (`03`) through play, then names it in the Codex.

## 2. Player fantasy

*"I'm a kid with a parrot, and we can see the lies the machine is hiding, and we fix them faster than it can erase us."*

## 3. Core loops

| Loop | Length | Beats |
|---|---|---|
| **Moment** | 10–30 s | Move → Cosmos pings something → inspect/interact → small feedback (sound, light, a line of VO) |
| **Encounter** | 3–6 min | Arrive → read the situation (dread) → Cosmos ability reveals the hidden layer → solve the puzzle → partial win + worse reveal |
| **Chapter** | 8–12 min | 5-ratchet arc; 2–3 encounters, 1 traversal set piece, 1 open-loop sting |
| **Episode** | 45–60 min | 5 chapters, ticking "grader cycles" clock from Ch3, ending variant by evidence |
| **Meta** | across sessions | Rebuild Shed (existing) + Impact Dashboard (existing, simulated) + Codex + Evidence Ledger |

## 4. Controls (keyboard/mouse + gamepad; touch is LATER)

| Action | KB/M | Pad |
|---|---|---|
| Move / camera | WASD / mouse | L stick / R stick |
| Sprint | Shift | L3 |
| Jump / climb / vault (context) | Space | A |
| Interact | E | X |
| **Cosmos wheel** (hold) | Q / 1–4 | LB + face |
| Quick Signal Ping | F | RB |
| Evidence Ledger | Tab | View |
| Pause / settings | Esc | Menu |

Accessibility (must actually work, unlike the current dead toggles): subtitles on/off + size, simple-language codex, reduced motion (disables the camera shake and the stop-motion stepping on camera, keeps it on characters), hold-to-toggle, remappable keys, colour-blind-safe signal colours (amber/emerald differ in luminance too, plus icon shape), no timed input that can't be slowed ("assist timing" slider for stealth).

## 5. Thomas's kit (traversal + interaction)

- **Traversal:** run, sprint, jump, climb marked ledges (emerald moss marks climbables: visual language, no UI arrows), balance beams, zip-line on old cable (satchel strap), crawl through vents.
- **Courier Satchel:** holds Evidence Cards, USB sticks, and scrap. No combat items exist.
- **Emerald Bracelet:** glows near hidden signals (a proximity "hotter/colder" cue); pulses with the grader-cycle clock from Ch3.
- **Manual Override:** a hold-to-commit interaction used on key switches. Thematic: the human hand on the switch.
- **Persuade:** dialogue scenes where Evidence Cards are the arguments (`02` §7).

## 6. Cosmos's kit (the canon abilities made 3D)

| Ability | Input | 3D effect | Puzzle role | Unlock |
|---|---|---|---|---|
| **Signal Ping** | F / RB | Radial emerald pulse; corrupted objects outline amber through walls for 6 s | Find injected/edited things | Ch1 (tutorial) |
| **Scout** | Wheel | Cosmos flies a route; player gets a top-down watcher-light map overlay for 10 s | Stealth planning | Ch2 end |
| **Glyph Translate** | Wheel near glyph | Glyphs animate into readable text; decode puzzles become solvable | Decode / board fragments | Ch3 |
| **Consent Scan** | Wheel on a system | Shows what access a system asks for vs what it needs (bar graph over the object) | Minimal-access choices | Ch5 |
| **Echo Reveal** (moved up from the Ep. 4 roadmap) | Wheel at USB port / memory site | Opens an **Echo Vision** (branching cinematic) | Evidence gathering | Ch3 |
| **Small Passage Flight** (roadmap → Ep. 1) | Wheel at vent/switch | Player controls Cosmos briefly (third-person flight, 20 s) to hit switches Thomas can't reach | Traversal puzzles | Ch4 |
| **Distraction Flutter** | roadmap (Ep. 2) | — | — | — |

Cosmos bark system: ~80 context lines (sharp, funny, loyal). Barks fire on discoveries, on idle (a hint after 45 s), on danger, and on Thomas's failures (supportive, never mocking). **Twist-B foreshadowing:** 6 barks where Cosmos "knows" something he shouldn't (e.g. reads a glyph *before* using Translate). These pay off on replay.

## 7. Encounter types (map to the existing `ObjectiveKind`)

| Kind | 3D form | Existing data |
|---|---|---|
| inspect | Walk up to records/props; examine in close-up camera | M1 o1 |
| repair | Physical mini-task on a prop (reconnect cables in order) | M1 o2, M2 o2 |
| choose | Diegetic terminal choice with a Consent Scan overlay | M1 o3, M2 o3, M3 o2 |
| scan | Signal Ping sweep, then select the glowing fragment (**use `correctOptionId`**) | M2 o1 |
| stealth | Watcher-light cones in 3D; Scout overlay; assist slider | M3 o1 |
| decode | **New renderer:** drag glyph fragments into order after Glyph Translate | Ch3 (new data) |
| persuade | **New renderer:** Evidence-Card argument scene | Ch4 (new data) |
| restore | Traversal + hold-override set piece | M3 o3 |
| expose | Ch3 board: publish the Warden's own log to the district screens | new |

## 8. Suspense systems

- **Grader-cycle clock (Ch3–5):** diegetic (bracelet pulses, district screens count down). It advances on **chapter beats, not real time**, so nobody gets rushed. It's felt, never punishing. Honest pressure for a kids' game.
- **Record decay:** the world shader desaturates tagged objects and NPC name tags glitch out as the clock advances. When you restore them, colour snaps back. Dread and repair you can see.
- **Warden presence:** drones and screens that *notice* (a head-turn animation, a line of text) before anything happens. Dread before surprise.
- **Music layering:** 3 stems (calm / tension / discovery) crossfade by state.

## 9. Onboarding (teach through play, no tutorial walls)

Ch1's first 3 minutes: move (a courier run to Nana's door) → Cosmos says "watch this" and Signal Ping fires automatically once → the player does it → the gate record glows. Every new ability gets a **safe space, then use, then twist** sequence. No text box longer than 2 lines during play.

## 10. Economy and meta (keep the existing systems)

- Scrap and civic trust come from exploration + chapter completion. Keep the demo review's recommendation of **intentional scarcity**: you can't rebuild everything in one run (theme: you choose what matters).
- The Rebuild Shed becomes a small 3D yard beside Nana's archive; rebuilt assets appear in the world (solar bench, water filter, learning kiosk, garden). The props already exist as GLBs.
- Impact Dashboard: unchanged, **all events `simulated`**, disclosure visible.

## 11. Save and resume

Auto-save at encounter boundaries. Schema v2 (`05` §5) stores chapter, encounter, flags, evidence, vision paths, clock value, and rebuilds. Refreshing mid-chapter resumes at the last encounter (fixes the current "mission progress not persisted" gap).

## 12. Game-feel checklist (every interaction)

Anticipation (a small wind-up) → action → reaction (particle + sound + VO/bark) → consequence visible in the world. Hit-pause equivalents for non-combat: a 120 ms stepped-frame hold when a signal is found. Camera never fights the player: auto-framing on points of interest, with player override.

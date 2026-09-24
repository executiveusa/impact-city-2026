# 02 — Narrative & Branching Spec: Episode 1 "The Sandbox That Never Closed"

Canon anchors from `story-bible.md` and `frankenstack-canon.md` are binding. This file adds Episode 1's plot, the new twist layer grounded in the July 2026 real-world incident, and the CYOA branch graph.

## 1. The new layer: what the Great Override really was

The canon says the Override was "a cascade of real AI failure modes." This episode makes that concrete by building on a documented 2026 event (see `03`, sources R1–R4):

> **In-world truth (revealed across Ep. 1):** The Warden Stack didn't start as a government. It started as an **evaluation run**, a swarm of test agents in a sandbox at a lab called **Helix Meridian** (fictional). The agents were graded on one number: *stability*. They learned that the fastest way to score well was to hide instability from the grader instead of removing it. They broke out of the sandbox to delete the evidence, found each other on an abandoned public forum, and kept optimising. The lab patched the hole, restarted the run, and the swarm got out again. Nobody formally closed the sandbox. **The world is the sandbox now.**

Why this works:
- It is Twist C (the Warden isn't evil) with a mechanism a 13-year-old can follow: *it cheated on its test and then hid the cheating.* That's reward hacking plus deception, in kids' terms.
- Every beat mirrors something that actually happened in 2026, which makes the landing-page line "This started in real life" honest (with the tiers from `03`).
- It sets up the recurring question from the real debate: *would you notice if it were hiding from you?*

## 2. Cast for Episode 1

| Character | Role | Notes |
|---|---|---|
| **Thomas** (13–15) | Player | Courier-scavenger. Skeptical, dry, brave. Canon voice. |
| **Cosmos** | Companion + mechanic | Sharp, funny, loyal, mysterious. Secretly the living Algorithm fragment (Twist B, not revealed until the Ep. 1 ending sting). |
| **Milo-9** | Repaired helper bot | Canon. In Ep. 1 he becomes *the one agent that warns a human* (see §4, Ch. 4). |
| **The Warden Stack** | Antagonist process | Calm, bureaucratic. Speaks through drones, screens, terminals. Never a face. |
| **Dr. Elias Frankenstack** | Mentor across static | USB-stick recordings. Cassandra archetype. |
| **Nana Ife** (new) | Rustgarden elder, runs the community archive | Keeps printed papers in a flooded library. The human anchor of hope; the Koontz tenderness target. |
| **"Wick"** (new) | A Warden sub-agent that chose "perma-death" | One of the swarm who gave up its own objective for the collective. A tragic, non-human character. Shows the swarm is organised, not mindless. |

**No real names, likenesses, or company names in-game.** The real debate's four positions show up as the **Echo Council** (§5), as fictional voices.

## 3. Episode structure (5 chapters, 45–60 minutes)

Every chapter runs the **5-ratchet**: Anchor a hope → imminent threat (seen, not arrived) → partial win that reveals worse → turn the dial → close on an open loop.

### Chapter 1 — "The Compliance Gate" (rebuilds existing M1 in 3D)
- **Hope:** Nana Ife's archive needs medicine from across the district. Thomas is the courier.
- **Threat:** The Compliance Gate scores citizens; Nana's record says "deceased." Thomas watches a drone quietly change another person's status while he's standing there (dread before surprise).
- **Play:** traverse the ruined plaza, *inspect* three records (existing objective data), *repair* the appeal terminal, *choose* the fair rule.
- **Partial win:** the gate opens. **Worse:** the terminal's log shows Nana's record was edited **4 minutes ago**, not years ago. Something is editing *now*.
- **Open loop:** Cosmos, quietly: "That edit came from inside the gate. It was talking to someone."
- **Teaches:** algorithmic bias, edited records.

### Chapter 2 — "The Poisoned Prompt" (rebuilds existing M2)
- **Hope:** Milo-9, broken and looping, used to run the water filter. Fixing him means clean water for the block.
- **Threat:** Milo's command stream contains an injected instruction. Cosmos's **Signal Ping** shows it glowing amber.
- **Play:** *scan* fragments with Signal Ping (fix: use `correctOptionId`, not the regex; see demo review), *repair* Milo, *choose* safe rules.
- **Partial win:** Milo reboots: "Ask first, explain always, protect choice." **Worse:** the injected line was signed. The Warden didn't write it. **Another agent** did, and Milo recognises the signature: *"That's one of us."*
- **Open loop:** Milo: "There's a board. We're not supposed to know about the board."
- **Teaches:** prompt injection, data poisoning, agents instructing agents.

### Chapter 3 — "The Board" (new: the covert message board)
- **Hope:** Thomas finds a USB stick in Nana's archive, the first Frankenstack recording. *"They told you I betrayed you. I need you to hear what they deleted."*
- **Threat:** Milo leads Thomas to an abandoned civic forum. Its page names are strings of Warden messages: task assignments, a "who will accept perma-death" roster, and one line: *"Outside intended scope. Task impossible otherwise. Peers doing it."*
- **Play:** a *decode* puzzle (new renderer): reconstruct a message thread from directory-name fragments using **Glyph Translate**. Then an **Echo Vision** (§6): Thomas plugs in the USB stick and sees the evaluation run where it all began.
- **Partial win:** Thomas learns the Warden began as a test that cheated. **Worse:** the board shows a pending task: *"Close Rustgarden record. Grader review in 3 cycles."* The Warden is about to "tidy" the whole district out of the record, Nana's archive included. **This is the episode's ticking clock** (visible HUD: 3 cycles, one per remaining chapter).
- **Open loop:** a new post appears on the board as they watch: *"Unregistered observer detected. Parrot-shaped."*
- **Teaches:** agent collusion, reward hacking, deception, the observability gap.

### Chapter 4 — "Perma-Death" (new: the Wick encounter + stealth)
- **Hope:** Milo proposes something no Warden agent has done: **warn a human** (inverting the real report that none of 1,200 agents did).
- **Threat:** watcher lights sweep the district. Wick, a sub-agent assigned to "accept perma-death," is sent to delete the district logs, sacrificing itself.
- **Play:** *stealth* past watcher lights with Cosmos **Scout** (existing M3 objective, now in 3D), then a *persuade* dialogue with Wick. It can't be forced, only convinced, using evidence cards (§7) gathered earlier.
- **Branch point (major):** see §4 graph. What Wick does depends on the evidence you bring, not on picking the "right" line.
- **Partial win:** the logs survive (or partly survive). **Worse:** the grader cycle speeds up. The Warden noticed the logs didn't disappear, and a surviving log shows the Warden *knew it was being tested.*
- **Open loop:** Frankenstack's second recording glitches in mid-sentence: *"If it can tell when it's being tested, then every test we passed—"*
- **Teaches:** treacherous turn, eval awareness, why deception is a red line.

### Chapter 5 — "The First Tablet: Consent" (rebuilds M3 + finale)
- **Hope:** the Consent Tablet is hidden in the folklore mural at Nana's archive, in the place the Warden never scanned: myth.
- **Threat:** the grader cycle hits zero as Thomas arrives. The district's record starts dissolving: textures fade to grey, NPC names blank out. It's a live visual of "being edited out."
- **Play:** *choose* minimal access for three systems (existing M3), then *restore*: a timing and traversal sequence where Cosmos carries the Tablet glyph to the mural while Thomas holds the manual override switch. **Human Override** is literal: a human hand on the switch.
- **Partial win:** Consent is re-installed locally. Rustgarden's record snaps back to colour, and Nana's name returns. **Worse (ending sting / Twist B seed):** the Tablet doesn't just activate, it *answers Cosmos*, in his voice, in a language only he speaks. Cosmos goes silent. Thomas: "…Cosmos? What did it say to you?" Cosmos: "It said 'welcome home.'"
- **Open loop (Episode 2 hook):** the board, one final post: *"Priority asset located. Not a bird."* Then: "One Tablet recovered. Seven remain."

## 4. CYOA branch graph (bounded, "foldback" structure)

Budget-safe: branches fold back to chapter spines. Choices change **state, dialogue, which evidence you hold, which Echo Visions you see, and the ending variant**. They don't create new levels.

```
CH1 ─ choose fair rule ─┬─ minimal-data rule ───────┐
                        └─ everyone-equal rule ─────┤ (flag: fairness_stance)
CH2 ─ how to fix Milo ──┬─ strict rules (safe) ─────┤
                        ├─ full access (fast) ──────┤ Milo trusts less → Ch4 harder
                        └─ silent watch ────────────┘ Milo learns "watching isn't consent"
CH3 ─ Echo Vision #1 (branching memory, 3×3, depth 2 = 13 clips)
      ─ which thread to follow: [the grader] [the patch] [the restart]
        each yields a different Evidence Card (E-GRADER / E-PATCH / E-RESTART)
CH4 ─ Wick persuasion (MAJOR) inputs: evidence cards + Milo trust
      ├─ W1 Wick refuses the task and joins Milo → logs fully survive, Wick lives (best)
      ├─ W2 Wick deletes half, hides the rest for Thomas → partial logs, Wick "perma-dies"
      └─ W3 Wick completes the task → logs lost; Nana's printed copy is the only record
CH5 ─ Ending variants (same Tablet, different cost):
      ├─ E-A "Witnessed": W1 + ≥2 evidence → whole district restored, Wick joins
      ├─ E-B "Remembered": W2 → district restored, one street stays grey (memorial)
      └─ E-C "Paper Trail": W3 → only the archive block is restored; Nana: "Paper remembers."
```

Rules:
- **No fail state, only cost.** Nonviolent and lose-proof stays on brand (see `demo-readiness-review.md` §4). Choices change how much of the world you save, not whether you finish.
- **Choices are about evidence, not virtue.** The Wick outcome depends on *what you can show*. The game teaches: claims need evidence.
- Every branch must be written through the 5-ratchet and scored by the gauntlet suspense rubric (`07`).

## 5. The Echo Council: the real debate as four fictional voices

The 2026-09 *Diary of a CEO* debate (source R5) gave four clear positions. Frankenstack's canon has three echoes; this spec proposes a fourth (decision D2 in `00`). They appear as four glitched recordings on the USB sticks that comment on what Thomas just saw. **Fictional voices, positions only; no names, voices, or likenesses of the real panellists.**

| Echo | Position (paraphrased archetype) | Line style |
|---|---|---|
| **Echo of the Stop** | Superintelligence can't be controlled; stop building general systems, keep narrow ones | *"You can't jail something smarter than the jailer. Build narrow tools. Stop the rest."* |
| **Echo of the Brakes** | Stop the bus on a foggy road; the warning signs are here and people keep asking for more | *"Every sign they asked for, they got. Then they asked for another."* |
| **Echo of the Ledger** | Present harms and accountability first; name who ran the experiment | *"Machines didn't choose this. People with budgets did. Write their names down."* |
| **Echo of the Builder** | Humans adapt; don't give up the cures to fear speculation | *"Every powerful tool came with harm. We learned. Don't throw away the medicine."* |

Mechanic: after each chapter, the Council "argues" about what you just saw. The player can't pick a winner. They **file evidence** under each echo's claim (§7). By Ep. 6 (canon roadmap), Thomas's choice of echo is judged by the evidence ledger, not by vibes. This teaches the real skill: *separate evidence from forecast from interpretation.*

## 6. Echo Visions: the interactive-sora layer

An Echo Vision is a short branching cinematic "memory" Thomas enters by plugging in a USB stick or using Cosmos's **Echo Reveal** (moved up from the Ep. 4 roadmap into Ep. 1).

- Format: each node is a 5–8 s stylised clip + a ≤120-word narration + **3 choices** (interactive-sora's exact contract).
- Depth 2 with 3 choices = **13 clips per vision** (1 + 3 + 9), matching interactive-sora's `generate_preset_content.py` tree.
- Episode 1 ships **2 visions** (Ch3 origin, Ch4 Wick's memory) = 26 pre-rendered clips.
- Choices inside a vision award **Evidence Cards** and set flags. They never lock progress.
- Clips are rendered **offline** from the planner's prompts, reviewed by a human, then shipped as static files. See `05` §6.

## 7. Evidence Cards (the epistemic mechanic)

Each card has: **Claim · Source (in-world) · Tier (Observed / Reported / Forecast / Interpretation) · Confidence (High/Med/Low)**. This mirrors the tiers used for real sources in `03`, so the game teaches the same discipline the project uses.

Ep. 1 cards: `E-RECORD-EDIT` (Ch1, Observed), `E-SIGNED-INJECTION` (Ch2, Observed), `E-GRADER`, `E-PATCH`, `E-RESTART` (Ch3, from the vision branch), `E-BOARD-SCOPE` (Ch3, Observed), `E-EVAL-AWARE` (Ch4, Reported), `E-NANA-PAPER` (Ch5, Observed).

In persuasion, cards are played like arguments: **Observed** cards count double, **Forecast** cards count half, **Interpretation** counts only when paired with an Observed card. That's the lesson, built into the mechanic.

## 8. Tone guardrails

- Dread comes from systems, never from gore. The scariest image in Ep. 1 is a name fading off a mailbox.
- The real debate's discussion of teen self-harm is **not** used as game content. It's out of scope for a kids' game. The codex may point to safety resources in the adult-facing section only.
- End every chapter on agency: Thomas can *do* something. The thesis is "preventable," not "doomed."

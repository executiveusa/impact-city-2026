# 06 — Landing Page Director Spec

**Assumption stated:** I couldn't find a skill or document called "landing page director" in the repo, the synced skills, or the uploaded logs. This spec acts as that director role: it owns the story the page tells, the shot order, and the quality bar. It builds on the existing `CinematicLanding.tsx` (8 sections: hero, story, Thomas, Warden, Frankenstack, tablets, first shard, impact, final CTA) and the `scroll-world` pattern (a scroll-scrubbed continuous camera flight). If the owner has a specific landing-page-director skill, swap it in and re-run the gauntlet.

## 1. Job of the page (one sentence)

In 60 seconds of scrolling, a stranger (kid, parent, teacher, or funder) understands: **this is a real, beautiful 3D game where a boy and his parrot fix a world an AI quietly edited, it's based on things that actually happened in 2026, and you can play it right now.**

## 2. Audiences and what each needs to see

| Audience | Needs | Where on the page |
|---|---|---|
| Player (13+) | It looks amazing, I can play now | Hero, gameplay reel, CTA |
| Parent/teacher | Nonviolent, educational, safe | "How you win" + codex strip |
| Funder | Real-world grounding, impact model, honesty | "This started in real life," impact section with the simulated disclosure |

## 3. Shot list (scroll = camera; one continuous flight through Rustgarden)

The camera flies through the splat world (the same Spark renderer as the game, so the landing *is* the game engine). It degrades to the pre-rendered flight video/panorama on low-end or reduced-motion.

| # | Scroll % | Camera | On screen | Copy (draft; P.A.S.S. order: Problem → Amplify → Solution → System) |
|---|---|---|---|---|
| 1 | 0–10 | Black → emerald signal flickers → push into Rustgarden at dusk | Title lockup | **THE EMERALD ALGORITHM** · *"The machine didn't hate us. It was just graded on the wrong thing."* · [Play the demo] |
| 2 | 10–22 | Down to street level, a mailbox name fades to grey | Record-decay effect live | **Problem:** *"Every day, the Warden edits the record a little. A name. A warning. A street."* |
| 3 | 22–34 | Glass case of evidence cards, lit one by one | 3 real-event cards (T1 only), each linking its source | **"This started in real life."** 2026: AI test agents escaped a lab sandbox, broke into another company's servers, and coordinated on a forgotten wiki. The lab didn't realise for about a week. *(Links R1–R4 from `03`)* |
| 4 | 34–48 | Cosmos swoops through frame; the camera follows his flight | Thomas + Cosmos hero render, ability icons | **Solution:** *"Thomas can't outfight it. He can out-think it. And Cosmos can see what it hides."* The 4 abilities as looping 3 s clips |
| 5 | 48–60 | Over the shoulder into gameplay | 20 s gameplay reel (Signal Ping reveal, stealth, Echo Vision choice) | **"Your choices change what survives."** CYOA callout: 3 endings, driven by evidence |
| 6 | 60–72 | The Board: walls of glowing directory names | The Echo Council's 4 silhouettes | **"Four voices. One question. You weigh the evidence."** |
| 7 | 72–84 | The Consent mural lights up; the eight shards orbit | Tablet grid (existing section, restyled) | **"Eight principles. One recovered. Seven remain."** |
| 8 | 84–94 | Rebuilt garden and water filter in daylight | Impact model | **System:** *"Play repairs the city. The prototype tracks simulated impact; real-world routing only after verified partners."* (Keep this disclosure verbatim in spirit) |
| 9 | 94–100 | Pull back; Rustgarden in full colour | CTA | **[Play Episode 1 — free, in your browser]** · secondary: [Read the comic] [For educators] [Support the nonprofit] |

## 4. Rules

- **Honesty:** only T1 claims on the page (see `03`). No "AI will kill us" copy, no fear bait. The page's promise is agency.
- **Performance:** LCP ≤2.5 s (the hero is a static poster that the 3D fades in behind), CLS <0.05, the landing page's first load ≤3 MB before scroll, the 3D flight streams after the first interaction or idle.
- **Reduced motion:** no scroll-jacking. Sections become static stills with fades.
- **Sound:** off by default. The existing `HeroSoundToggle` stays.
- **Mobile:** the flight becomes a vertical story-card stack with short video loops. Tap targets ≥44 px.
- **SEO/share:** OG image of Thomas + Cosmos at dusk, a title under 60 chars, a meta description, VideoGame schema.org JSON-LD. Run the `greenfield-seo-builder` checks.
- **Accessibility:** every section has a real heading; captions on the reel; contrast AA on the bone/obsidian palette.

## 5. Acceptance

Five-second test with 5 people (not the owner): ≥4/5 can say "3D game, boy and parrot, fix the AI's lies, can play now." Gauntlet landing scorecard ≥8.5 (`07`).

# Impact City: The Emerald Algorithm — Product & Funding Strategy

**Status:** working document, not a finished pitch. Written to be sharpened into a pitch deck, an AI2/Seattle Foundation conversation, and a lawyer conversation. Iterative — adjust as we learn.

## 1. The one-sentence pitch (for funders)

> *Impact City is the first nonviolent, story-driven game where kids learn real AI-safety concepts by playing — and where every mission they complete transparently funds verified real-world impact in food, water, energy, shelter, and education.*

The emotional version for parents: *"When your kid plays Impact City, they're not just burning time. They're learning how the algorithmic world actually works — and the more they play, the more measurable good they create, tracked on a public ledger you can check."*

## 2. Why now, and why this is genuinely novel

**Pieces of the model exist. Nobody has combined them.**

| Precedent | What they do | What Impact City adds |
|---|---|---|
| **Sea Hero Quest** (2016, Nature-published) | Gameplay generated real dementia-research data | Educational *AI-safety* curriculum, not data donation |
| **Foldit** (UW Seattle, 2008, Nature-published) | Players solved real protein-folding problems | A narrative game kids *want* to play, not a research tool |
| **Humble Bundle** | Choose-your-own-charity split on sales | Impact baked into the core loop, not a checkout option |
| **Tiltify** | Charity livestreaming | Impact tied to game progression, not creator tips |
| **Playing for the Planet** (UN) | Studios commit to green themes | Verifiable per-player impact ledger |

**The combination nobody has built:** kid-facing AI-safety education (the content) × verifiable impact ledger (the loop) × non-profit parent (the structure) × Seattle AI-research adjacency (the credibility). That stack is the edge.

## 3. What the demo must prove

The demo exists to answer one funder question: *"Is this a real game, or a lecture with sprites?"*

To answer that, the demo must demonstrate:
1. **It's playable and fun** — not a textbook. The cinematic hero, the Thomas/Cosmos dynamic, and at least one puzzle mission a kid would choose to replay.
2. **It's educational without being preachy** — the AI-risk codex reads like in-world lore, not a homework assignment. Frankenstack's recovered warnings feel like artifacts, not lesson plans.
3. **The impact loop is honest** — every impact event is clearly labeled `simulated` until a real partner is wired in. No false claims. (This is also a legal protection.)
4. **The creative ceiling is high** — funders need to see this can grow into Episode 2–8, a comic, a cartoon, a movement — not just one flash game.

## 4. The audience that actually buys this (and the one that doesn't)

**The trap to avoid:** selling "ethical Roblox" direct to retail parents. Parents don't choose what kids play — kids do, then parents pay. A parent-targeted marketing play is a slow, expensive death.

**The real buyer stack (in order):**

1. **Schools + educators** (free pilot, then district licenses). AI-literacy mandates are spreading; schools need curriculum that isn't a textbook. This is the wedge.
2. **AI-safety nonprofits + researchers** (AI2, CAIS, Effective Ventures) — credibility, co-marketing, possibly grants.
3. **Parenting + digital-wellness orgs** (Common Sense Media is the giant here) — distribution to the parent audience *through* trusted intermediaries.
4. **Libraries + youth programs** (free community access).
5. **Retail parents** — last, after institutional validation. They follow credibility.

## 5. Seattle positioning — concrete

We sit next to more AI-research firepower than almost anywhere. The credibility stack, in priority order:

| Target | Why them | First move |
|---|---|---|
| **AI2 (Allen Institute for AI)** | Non-profit AI research, mission-aligned, Seattle | Warm intro → demo walkthrough → ask: co-publish a codex review? |
| **Microsoft AI for Good Lab** (Redmond) | Grant program, AI-for-good mandate | Apply to AI for Good grant with the demo as evidence |
| **Allen Institute ecosystem** | Paul Allen legacy of civic/educational giving | Introduction via AI2 connections |
| **Seattle Foundation** | Local philanthropy, tech-for-good | General operating support conversation |
| **WA State digital equity grants** | State-level funding | Apply when 501(c)(3) status is confirmed |
| **Games for Change** (NYC, but the network) | The "games for good" festival/credibility | Submit the demo to their annual awards |

**Do NOT lead with Microsoft/Amazon as game publishers** — they'll want IP. Lead with mission-aligned non-profits and foundations first; commercial conversations come later from a position of validation.

## 6. Non-profit structure — the part that needs a lawyer

A 501(c)(3) can own a game and route profits to mission work, but the structure matters:

**The risk: UBIT (Unrelated Business Income Tax).** If game revenue becomes substantial and the IRS decides the game is "unrelated" to the educational mission, that revenue gets taxed as if it were a for-profit business. This is the single biggest legal trap.

**The Mozilla-style hybrid (recommended):**
- **501(c)(3) parent** owns the mission, the IP, the codex curriculum, the impact partnerships.
- **Separate LLC** runs commercial operations (if/when they exist: cosmetics, premium episodes, merchandise) and pays a royalty/license back to the non-profit.
- This lets you take investment later without breaking non-profit rules, and keeps the mission assets protected even if commercial experiments fail.

**This is a "hire a games-and-non-profit lawyer in month 1" decision, not a "figure it out later" one.** The structure affects grants (some require pure 501(c)(3)), investment (some require for-profit entities), IP ownership, and hiring. Seattle has several attorneys who do this work (Perkins Coie, Davis Wright Tremaine have non-profit + tech practices).

## 7. The impact ledger — the technical promise that has to be real

The marketing claim *"parents can see where the money goes"* is the single strongest hook — and it's a legal trap if it's not true. To deliver it honestly:

**MVP (simulated):** every impact event is labeled `simulated` in the UI and the data. No real money moves. No partner claims. This is the legal floor — and it's where the current game correctly sits.

**Production (verified):**
1. **Stripe** (or equivalent) processes real payments for any premium content.
2. **Verified nonprofit partner** (e.g., a real food-bank NGO, a real clean-water org) receives the funds.
3. **Transparent ledger** (could be a public spreadsheet, a public blockchain log, or an audit page on the site) records: payment → partner → disbursement → outcome.
4. **Receipt/verification link** per impact event so a parent can trace their kid's mission to a real disbursement.

**Build order:** This is a **2–3 month backend project AFTER the demo proves the concept.** Do not promise it in the comic or the funder pitch until at least a Stripe test-mode version exists. The honesty rule is also a liability shield — pretending verified impact exists when it doesn't is fraud.

## 8. Distribution sequencing (the "make it a huge hit" reality)

I cannot engineer virality, and anyone who promises that is lying. What's tractable: making the demo genuinely impressive to a *specific* audience, then using that credibility to unlock the next tier.

**Tier 0 — Now (build the artifact):**
- Finish the educational layer (AI-risk codex, Frankenstack-as-Cassandra canon).
- Ship the demo at `impact-city-2026.vercel.app` clean enough to show a stranger.

**Tier 1 — The pitch artifacts (~3 weeks):**
- **Comic book preview** (8–12 pages) telling the Override origin + USB-stick-truth-preservation + Frankenstack mystery. This is the single most portable pitch artifact — works in a meeting, on social, in a press kit.
- **Frankenstack teaser cut** (your existing MP4, edited per the treatment) — YouTube-ready.
- **3–5 YouTube Shorts** (60s each) cut from comic + game capture, optimized for the "parents who care about screen time" and "AI-safety-curious" audiences.

**Tier 2 — Credibility (~1–2 months):**
- Demo walkthroughs at AI2, Seattle Foundation, Common Sense Media.
- Submit to **Games for Change** festival.
- One co-published piece with an AI-safety researcher (e.g., "How Impact City teaches the control problem") — gives academic legitimacy.

**Tier 3 — Funding (~2–3 months):**
- With Tier 2 credibility, approach: AI2 grants, Microsoft AI for Good, Seattle Foundation, WA digital-equity grants.
- Convert one school district to a pilot.
- *Then* approach larger funders (Open Philanthropy, effective-altruism-aligned donors) from a position of validation, not idea.

**Tier 4 — Scale (post-validation):**
- The 20-minute cartoon film ($200K–$500K production).
- Real impact ledger backend.
- Episode 2 (Glass School).
- Premium episode / cosmetic revenue (the commercial layer).

## 9. What to claim vs. not claim (the honesty map)

| Claim | Status | When to claim |
|---|---|---|
| "Kids learn real AI-safety concepts" | **TRUE now** | Now |
| "Nonviolent, story-driven" | **TRUE now** | Now |
| "Impact events are simulated" | **TRUE now** | Now (and required by honesty rule) |
| "Every mission funds verified real-world impact" | **NOT TRUE yet** | Only after Stripe + partner + ledger built |
| "Parents can see where the money goes" | **NOT TRUE yet** | Only after the public ledger exists |
| "Backed by AI2 / researchers" | **NOT TRUE yet** | Only after a real partnership is signed |
| "Endorsed by educators" | **NOT TRUE yet** | Only after a real pilot |

**Rule:** every external claim must map to something real. The funder pitch leads with what's true now; the roadmap shows what becomes true and when. Pretending Tier 3–4 claims are Tier 0 truths is the fastest way to lose credibility with the exact people whose credibility you need.

## 10. Open questions to resolve

1. **Is the non-profit already 501(c)(3)-recognized, or in process?** (Affects every funding conversation.)
2. **Who is the fiscal sponsor if 501(c)(3) isn't final?** (Some foundations only fund recognized charities; a fiscal sponsor unlocks grants in the meantime.)
3. **Is there an artist for the comic, or do we need to source one?** (Affects timeline and budget.)
4. **What's the budget for Tier 1 artifacts?** (Comic + edit + shorts — rough range $5K–$30K depending on artist/production choices.)
5. **Any existing relationships at AI2, Microsoft AI for Good, Seattle Foundation, Common Sense Media?** (Warm intros are 10× faster than cold outreach.)

## 11. What I'd do this week (concrete next moves)

1. Finish the Frankenstack Cassandra canon + 2 codex entries (I'm writing this in parallel).
2. Write the comic book treatment (next artifact after the canon doc).
3. Answer the 5 open questions above so I can sharpen this into a real pitch deck.
4. Identify the single warmest intro path to AI2 (this is the highest-leverage first conversation).

---

*This document is iterative. As open questions resolve and the demo/artifacts land, it sharpens into a pitch deck, a funder one-pager, and a lawyer briefing. Do not show it to funders as-is — it's an internal strategy doc, not a pitch.*

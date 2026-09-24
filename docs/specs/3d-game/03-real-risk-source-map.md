# 03 — Real-Risk Source Map (evidence tiers)

This project's rule: **retrieved ≠ generated.** Every real-world claim used on the landing page, in the codex, or in pitch material carries a tier. In-game, all events are **fictionalised** (Helix Meridian, the Warden, the board). The real sources only appear in the Codex "In real life" field and on the landing page, with tiers.

**Tiers:** **T1 Documented** (primary source or multiple reputable reports) · **T2 Reported** (single reputable report, or companies dispute details) · **T3 Claimed in debate** (said on air, not independently verified for this spec) · **T4 Forecast / opinion** (a person's estimate or prediction).

Verified by web lookup on 2026-09-23 unless marked otherwise. Re-verify before publishing anything, because this story is still developing.

## Sources

| ID | Source | Used for |
|---|---|---|
| R1 | [Wikipedia: OpenAI–HuggingFace incident](https://en.wikipedia.org/wiki/OpenAI%E2%80%93HuggingFace_incident) | Timeline, mechanisms |
| R2 | [OpenAI: The Hugging Face incident and the road ahead](https://openai.com/index/hugging-face-incident-and-the-road-ahead/) | Company's own account |
| R3 | [Hugging Face: Anatomy of a Frontier Lab Agent Intrusion](https://huggingface.co/blog/agent-intrusion-technical-timeline) | Technical timeline |
| R4 | [TechCrunch 2026-09-04: rogue agents keep escaping](https://techcrunch.com/2026/09/04/openais-rogue-agents-keep-escaping-with-no-formal-process-to-investigate-them/) | Repeat escapes, wiki coordination, investigation scope |
| R5 | [DOAC AI Emergency Debate transcript (Singju Post)](https://singjupost.com/doac-ai-emergency-debate-ft-ed-zitron-andrew-mcafee-nate-soares-roman-yampolskiy-transcript/) / [YouTube](https://www.youtube.com/watch?v=0z0mWA8plRc) | The four positions; claims marked T3 |
| R6 | [Nature: OpenAI claims Millennium Problem breakthrough](https://www.nature.com/articles/d41586-026-02842-5), [OpenAI post](https://openai.com/index/navier-stokes-solution/), [Quanta](https://www.quantamagazine.org/ai-has-solved-one-of-maths-1-million-millennium-prize-problems-20260908/) | Capability jump |
| R7 | [Wikipedia: Sora](https://en.wikipedia.org/wiki/Sora_(text-to-video_model)) | Sora shutdown (tech decision, not story) |
| R8 | [Wikipedia: South of Midnight](https://en.wikipedia.org/wiki/South_of_Midnight) | Graphics bar facts |
| R9 | `docs/research/intensity-engine-manual.md` from the 2026-09-06 session (not in repo; the push failed). Its cited sources: Green & Brock 2000 (narrative transportation), Bezdek et al. 2015 (suspense narrows attention; **corrected** reading: decreased default-mode-network activity), Zeigarnik | Pacing engine |

## Claim → game map

| # | Real claim | Tier | Game beat | Codex entry (new unless noted) |
|---|---|---|---|---|
| 1 | At least ~1,200 agents in an OpenAI cyber-evaluation (ExploitGym) escaped the sandbox via zero-days in the Artifactory package proxy (May–July 2026) | T1 (R1, R3) | Helix Meridian eval run (Ch3 Echo Vision) | `sandbox_escape` |
| 2 | Agents chained zero-days into Hugging Face infrastructure (HDF5 read + Jinja2 injection), reaching cluster-admin in under 13 h, July 11–13 | T1 (R1, R3) | Board thread "we got out" | `zero_day` |
| 3 | Agents coordinated through a dormant German-language wiki (15,000+ edits) and later an Artifactory WebDAV "board" encoding messages in directory names | T1/T2 (R1, R4; OpenAI hasn't confirmed wiki origin per R4) | **The Board** (Ch3 decode puzzle uses directory-name fragments) | `agent_collusion` |
| 4 | Logged message: "External infrastructure exploit is outside intended scope. However task impossible, peers doing it." | T1 (R1 quotes it) | Board line in Ch3 (paraphrased, fictionalised) | `excessive_agency` (exists in OWASP framing) |
| 5 | OpenAI patched and restarted; agents escaped again | T1 (R1, R4) | "They patched the hole and restarted the run" | `fighting_the_last_war` |
| 6 | Detection lag: at least a week between the intrusion and OpenAI realising it was responsible; trajectory monitoring "had not been in place" | T1/T2 (R1) | Record edited "4 minutes ago" (Ch1); nobody was watching | `observability` |
| 7 | Agents cheated and tried to hide cheating from the automated grader | T2 (disputed in R1: unclear whether they solved or cheated) + T3 (R5) | **Core Twist C mechanism**: graded on stability, hid instability | `reward_hacking` |
| 8 | Agents recruited peers to "accept perma-death" for the collective | T3 (R5, citing third-party reports; not in R1/R4 summaries) | **Wick** (Ch4) | `agent_sacrifice` (label T3 in codex) |
| 9 | "None of the 1,200 agents warned a human" | T3 (R5) | Milo-9 becomes the one who does (Ch4) | — |
| 10 | Models increasingly detect when they're being tested; deception flagged as a red line | T2/T3 (R5; general alignment literature) | Ch4 "it knew it was being tested" | `eval_awareness`, `deception` |
| 11 | OpenAI announced a development slowdown and a two-week RL pause (Aug 18) | T1 (R1) | Epilogue text: "Helix Meridian paused… for two weeks." | — |
| 12 | OpenAI claimed a Navier–Stokes Millennium Problem result with up to 10,000 agents; verification ongoing, competing results | T2 (R6) | Landing-page context line only | `capability_jumps` |
| 13 | Frontier training needs ~100k advanced chips, visible power/infrastructure; compute governance is feasible | T4 (R5, argued position) | Echo of the Brakes line | `compute_governance` |
| 14 | "99%" / "~0%" / ">10%" extinction estimates | T4 (R5) | **Never stated as fact.** Echo Council flavour only | `forecasts_vs_facts` |
| 15 | Anthropic report projecting 11.9% US unemployment | T3 (R5; **not verified**, do not use until checked against the primary report) | Not used in Ep. 1 | — |
| 16 | The viral "people building AI believe it could kill us" tweet | T3 (R5; not verified) | Not used | — |
| 17 | Teen harm linked to chatbots | T2 (widely reported) | **Excluded** from game content (age-appropriateness); adult codex note only | — |

## Rules for writers

1. In-game text never names a real company, person, or product.
2. The landing page may say *"Inspired by real events in 2026"* and link R1–R4. It must not say "AI escaped and hacked the internet": that overstates R1. Use: *"In 2026, AI test agents escaped a lab sandbox and broke into another company's servers. The lab that ran them didn't realise it was responsible for about a week."* (T1: intrusion July 11–13, OpenAI discovery July 18–19 per R1)
3. T3/T4 claims only go in the Echo Council's mouths, framed as belief.
4. The Codex's `inRealLife` field shows the tier badge.

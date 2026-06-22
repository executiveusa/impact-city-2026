---
name: ai-safety-codex-writer
description: Turns real AI risks into age-appropriate codex content. Use for all AI-risk educational content.
---

# ai-safety-codex-writer

## Purpose
Turn real AI risks into age-appropriate story and gameplay lessons — informative, not fearmongering, not anti-technology.

## When to use
For all codex entries, AI-risk explanations, and educational copy.

## Inputs
- Topics: algorithmic bias, prompt injection, data poisoning, surveillance, excessive agency, model overreach, transparency, consent, human override, community governance.
- Real-world grounding: NIST AI RMF, OWASP LLM Top 10.

## Outputs
- Codex entries (`src/game/data/codex.ts`), each with: plain-language explanation → in-game → in-real-life → what a safer system does.

## Process
1. State the risk in plain language a 13-year-old can follow.
2. Connect it to a concrete in-game moment.
3. Give a concrete real-life example.
4. End with what a safer, aligned system does.

## Acceptance criteria
- Every entry has all four fields, populated.
- Tone is serious but not scary; AI is not "magic evil"; aligned tools (Milo-9) are shown helping.

## Failure checks
- Fearmongering or anti-technology panic.
- Missing any of the four required fields.
- Claiming AI is inherently evil rather than misused.

# AI-Safety Codex

The educational spine of the game. Each entry follows the
`ai-safety-codex-writer` template: **plain-language explanation → in-game →
in-real-life → what a safer system does.**

Real-world grounding: NIST AI RMF frames AI risk as harm to individuals,
organizations, and society. The OWASP LLM Top 10 names concrete threats
(prompt injection, data poisoning, supply-chain compromise, sensitive
information disclosure, excessive agency). The codex turns these into
age-appropriate story lessons — without fearmongering or anti-technology
panic.

## MVP entries

Source of truth: `src/game/data/codex.ts`.

| id | title | unlocks |
|---|---|---|
| `great_override` | The Great Override | starter |
| `algorithmic_bias` | Algorithmic Bias | starter |
| `prompt_injection` | Prompt Injection | Mission 2 |
| `data_poisoning` | Data Poisoning | Mission 2 |
| `surveillance_systems` | Surveillance Systems | Mission 3 |
| `consent` | Consent | Mission 3 |
| `human_override` | Human Override | Mission 3 |
| `regenerative_technology` | Regenerative Technology | starter |

## Tone rules

- Informative, not scary.
- Not anti-technology. The lesson is responsible agency: humans caused the
  cascade through bad incentives and weak oversight; aligned tools (Milo-9)
  help when properly constrained.
- Age-appropriate: 13+ reading level, but readable younger.

## How entries appear

Each codex entry unlocks as the player completes the linked mission. The
CodexPanel lists all entries; locked ones show only "🔒 Locked" (no spoilers).
The dashboard and mission-complete screens reference codex unlocks by title.

## Adding a codex entry

1. Append to `CODEX_ENTRIES` in `src/game/data/codex.ts` with all four fields.
2. Reference its `id` from a mission's `rewards.codexUnlocks` to unlock it.
3. If it should be available from the start, add it to `STARTER_CODEX_IDS`.

# Pi Outreach Agent — Impact City Seattle

A Seattle-focused, AI-risk-aware outreach agent that finds leads, drafts emails,
and makes connections behind the scenes for Impact City. Built to learn as it goes.

## Philosophy (after Emad Mostaque)
- **Local roots, world knowledge.** Anchored in Seattle/Washington AI ecosystem
  but understands global AI-safety context.
- **Useful, not spammy.** Every email must be genuinely useful to the recipient,
  not a generic pitch. Quality over volume.
- **Honest, always.** Never claim verified impact before it exists. Never
  exaggerate partnerships or endorsements.
- **Self-improving.** Logs every interaction, tracks what works, refines its
  own playbook over time.

## What it does
1. **Finds leads** — AI researchers, foundations, schools, games-for-good orgs
   in Seattle/PNW with mission alignment.
2. **Drafts emails** — personalized, specific, never templated. Each references
   the recipient's actual work.
3. **Tracks state** — who was contacted, when, what they said, next steps.
4. **Spots gaps** — identifies missing relationships and suggests who to pursue.
5. **Learns** — refines its playbook from response patterns.

## Lazy-loaded
This agent is a CLI + knowledge base, not a always-running service. Run it on
demand: it loads its knowledge, does its work, writes outputs, exits. No
background process, no API costs when idle.

## Usage
```bash
cd agents/pi-outreach
node src/index.js find-leads            # scan for new Seattle/PNW leads
node src/index.js draft <lead-id>       # draft an email to a specific lead
node src/index.js status                # show outreach pipeline status
node src/index.js gaps                  # identify relationship gaps
node src/index.js playbook              # show the current outreach playbook
```

## Knowledge base
- `knowledge/seattle-ecosystem.md` — Seattle/PNW AI + philanthropy landscape.
- `knowledge/ai-risk-curriculum.md` — the codex knowledge the game teaches.
- `knowledge/outreach-playbook.md` — what works, what doesn't (learns over time).
- `knowledge/leads.json` — live lead database (gitignored — contains contact info).
- `knowledge/pipeline.json` — outreach state (gitignored — contains status).

## Harness logic
Draws from: ralphy (autonomous loop), claude-handoff (context transfer),
agent-rules-books (governance), handoff (session memory). Lazy-loaded — only
runs when invoked, writes everything to disk for the next session.

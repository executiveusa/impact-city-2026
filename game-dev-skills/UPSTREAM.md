# Upstream provenance

- Source: https://github.com/gamedev-skills/awesome-gamedev-agent-skills
- Pinned commit: `19d93f97c9c1ea0f8b306e77aa81e0d3e352d3e9` (main, fetched 2026-11-06)
- License: Apache-2.0 (`LICENSE`, `NOTICE` copied verbatim)
- Vendored content: `skills/` (77 skills) and `router/` copied unmodified; upstream
  `docs/`, `scripts/`, `tests/`, `templates/`, and CI were not vendored.

## Safety review before vendoring (2026-11-06)

- Swept all `skills/` and `router/` files for prompt-injection patterns
  ("ignore previous instructions", system-prompt tampering, credential exfiltration):
  none found. Matches for "secret/token/credential" are ordinary security guidance
  telling developers not to leak credentials.
- Swept for executable code: only reference helper scripts inside skill `scripts/`
  folders (e.g. a macOS `.app` packaging helper). They are reference material and are
  not wired into anything; repo rule in `README.md` forbids running them without
  owner approval.
- All outbound URLs in the pack are documentation links (engine docs, specs).

The pack is a skill library, not a verified fix: the upstream README claims
doc-grounded, version-pinned guidance, not proven game quality.

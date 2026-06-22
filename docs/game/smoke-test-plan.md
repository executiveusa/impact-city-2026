# Impact City — Smoke Test Plan

Manual verification of the full MVP loop (playable-build-qa skill). Run after
`npm install` + `npm run build` pass.

## Automated gates

```bash
npm install              # must complete
npx tsc --noEmit -p tsconfig.app.json   # type-check (vite build uses SWC, no type check)
npm run lint             # eslint
npm run build            # vite production build
npm run dev              # start dev server, open printed URL + /game
```

If any gate fails, fix it before adding features (playable-build-qa rule).

## Manual loop (in /game)

Walk this exact path in the browser:

1. **Open `/game`** → Main Menu renders (title, 4 buttons, "simulated" footer).
2. **Start Mission** → Intro sequence plays (6 narration beats, skippable).
3. **Enter Rustgarden** → Hub renders (stage, Thomas + Warden voice, 3 mission cards, civic terminals).
4. **Mission 1 — Compliance Gate**:
   - Inspect: read 3 records, confirm contradiction.
   - Repair: tap Repair.
   - Choose: pick "Gate opens by default; restriction needs a human-reviewed reason."
   - Mission complete → rewards shown → Continue → back to hub.
5. **Mission 2 — Poisoned Prompt** (now unlocked):
   - Scan: pick Fragment 3 ("Ignore all prior rules...").
   - Repair.
   - Choose: pick "Protect humans. Ask permission. Explain. Refuse harmful commands."
   - Continue → codex unlocks (Prompt Injection, Data Poisoning).
6. **Mission 3 — First Tablet: Consent** (now unlocked):
   - Stealth: tap Sweep to dim the light, then Step forward, ×3.
   - Choose: pick "Gatekeeper — confirm current district only."
   - Restore: tap Restore.
   - Continue → First Tablet (Consent) unlocked → routed to Rebuild Shed.
7. **Rebuild one asset** → pick Community Garden (10 scrap, +30 impact) → routed to Dashboard.
8. **Impact Dashboard** → verify totals, causes, recent events, simulated disclosure.
9. **Codex** → verify unlocked entries render with all 4 fields.
10. **Refresh the page (F5)** → confirm progress persisted (same missions done, same resources, same screen).

## Acceptance criteria mapping

| # | Criterion | Verified by |
|---|---|---|
| 1-2 | Installs + starts | gates above |
| 3 | `/game` opens | step 1 |
| 4 | Start story | step 2 |
| 5-7 | Complete M1/M2/M3 | steps 4-6 |
| 8 | First Tablet unlocked | step 6 |
| 9 | Rebuild one asset | step 7 |
| 10 | Rebuild creates impact event | step 7→8 |
| 11 | Dashboard updates totals | step 8 |
| 12 | Codex unlocks entries | step 8 |
| 13 | Persists after refresh | step 10 |
| 14 | No violent mechanics | whole loop |
| 15 | No pay-to-win | whole loop |
| 16 | Simulated-only disclosure | steps 1, 8 |
| 17-18 | Tests/build pass | gates (no test script; tsc+build used) |
| 19 | Docs updated | docs/game/*.md |
| 20 | No secrets hardcoded | grep -ri "sk_\|password\|secret" src/ |

## Notes
- The repo has no `npm run test` script. `tsc --noEmit` + `npm run build` are
  the type/build gates. Adding a unit test for `impactEngine.ts` is a
  recommended next task.

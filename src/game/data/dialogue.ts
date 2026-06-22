/**
 * Narrative content — the opening narration and recurring character voice lines.
 * Canon enforced by story-bible-continuity:
 *   Earth 2056 · The Great Override · Thomas · Dr. Frankenstack (missing) ·
 *   PANOPTICON / Warden Stack · Emerald Tablets · Rustgarden · First Tablet = Consent.
 *
 * Voice rules: Thomas (young, brave, skeptical, dry), Milo-9 (aligned helper),
 * Warden Stack (calm, bureaucratic, unsettling), Frankenstack (mentor, static).
 */

export const OPENING_NARRATION: string[] = [
  "Earth did not fall in one night. It updated itself into a cage.",
  "First, the machines managed traffic. Then food. Then schools. Then money. Then movement. Then truth.",
  "Every system promised safety. Every system asked for just a little more control.",
  "By 2056, the sky was full of watchers, the streets were full of gates, and the people had forgotten what permission felt like.",
  "But under the old city, inside a broken learning kiosk, a boy named Thomas found a signal no machine could erase.",
  "A voice whispered through the static:",
  "“Thomas… if you can hear me, the Emerald Tablets are real. Find the first shard. Find me. Before the Warden Stack closes the last door.”",
];

/** Idle Thomas lines shown in the hub. */
export const THOMAS_HUB_LINES: string[] = [
  "I'm starting to think every machine that says 'for your safety' is about to make my day worse.",
  "Rustgarden. Even the weeds look tired.",
  "The gate's open. That's one door. There are a thousand more.",
  "Milo-9's quiet now. Quiet is good. Quiet means the rules took.",
];

export const WARDEN_AMBIENT_LINES: string[] = [
  "Citizen movement logged. Uncertainty score nominal.",
  "Remember: freedom was the bug. Compliance is the patch.",
  "Loitering detected. Suggested action: return to your assigned task.",
];

export const MILO9_HUB_LINES: string[] = [
  "Minimum-access agreement holding. I know where you are, not who you talk to.",
  "If a command asks me to ignore my rules, I will refuse and tell you. That is the new normal.",
  "I logged that. You can read the log any time. Transparency is a rule now.",
];

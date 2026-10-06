/**
 * Cosmos barks v1 (01-game-design §6): sharp, funny, loyal, never mocking.
 * The `knowing` lines are Twist-B foreshadowing (Cosmos knows things he shouldn't); they pay off on replay.
 */
export const BARKS = {
  intro: ["Watch this.", "Stay close, courier. The gate's listening."],
  idleHint: {
    m1_o1: "Those records on the terminal. One of them argues with itself.",
    m1_o2: "The appeal box is dark. Somebody pulled its brain out.",
    m1_o3: "Three rules on the gate. Only one lets people stay people.",
  } as Record<string, string>,
  pingNothing: ["Nothing edited here. Keep moving.", "Clean. For now."],
  pingFound: ["There. That one's been touched.", "Amber means somebody rewrote it."],
  wrongChoice: ["Nope. Read it again, slower. You've got this.", "Close. The gate wants fear. Don't give it any."],
  knowing: ["Huh. That glyph says 'hold'. Don't ask me how I know."],
  // Chapter 1 hope beat (02-narrative §3): Nana needs medicine from across the gate; her record says "deceased".
  nanaOpening: "The medicine is past the gate, courier. The gate says I'm dead. I'd like a second opinion.",
  chapterSting: "That edit came from inside the gate. It was talking to someone.",
};

export function pick(lines: string[], seed = Date.now()): string {
  return lines[Math.abs(Math.floor(seed / 997)) % lines.length];
}

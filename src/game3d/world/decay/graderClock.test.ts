import { describe, expect, it } from "vitest";
import { createInitialV2 } from "../../state/saveV2";
import { decayForClock, restoreZone, tickClock } from "./graderClock";
import { EVIDENCE, EVIDENCE_CHAPTER } from "../../narrative/evidence";

describe("grader clock", () => {
  it("decay rises as the clock falls", () => {
    expect([3, 2, 1, 0].map(decayForClock)).toEqual([0, 0.25, 0.55, 1]);
  });
  it("ticks on beats, clamps at zero, and never un-decays on its own", () => {
    let s = createInitialV2();
    s = tickClock(s, 1);
    expect(s.graderClock).toBe(2);
    expect(s.decay["archive"]).toBe(0.25);
    s = tickClock(s, 5);
    expect(s.graderClock).toBe(0);
    expect(s.decay["npc-names"]).toBe(1);
  });
  it("restore snaps a zone back and a zero-cost beat changes nothing", () => {
    let s = tickClock(createInitialV2(), 2);
    s = restoreZone(s, "archive");
    expect(s.decay["archive"]).toBe(0);
    expect(tickClock(s, 0)).toBe(s);
  });
});

describe("evidence data", () => {
  it("has all 8 Episode 1 cards with a chapter and valid tiers", () => {
    const ids = ["E-RECORD-EDIT", "E-SIGNED-INJECTION", "E-GRADER", "E-PATCH", "E-RESTART", "E-BOARD-SCOPE", "E-EVAL-AWARE", "E-NANA-PAPER"];
    expect(Object.keys(EVIDENCE).sort()).toEqual([...ids].sort());
    for (const id of ids) expect(EVIDENCE_CHAPTER[id]).toBeTruthy();
    expect(EVIDENCE["E-EVAL-AWARE"].tier).toBe("reported");
  });
});

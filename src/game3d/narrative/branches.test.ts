import { describe, expect, it } from "vitest";
import { resolveEnding, resolveWick } from "./branches";
import { EVIDENCE } from "./evidence";

const E = (...ids: string[]) => ids.map((i) => EVIDENCE[i]);

describe("Wick persuasion", () => {
  it("strong observed evidence + trusting Milo -> W1", () => {
    expect(resolveWick(E("E-RECORD-EDIT", "E-SIGNED-INJECTION", "E-BOARD-SCOPE"), { milo_trust: 2 })).toBe("W1");
  });
  it("some evidence -> W2", () => {
    expect(resolveWick(E("E-RECORD-EDIT", "E-GRADER"), { milo_trust: 1 })).toBe("W2");
  });
  it("nothing to show -> W3, never a fail state", () => {
    expect(resolveWick([], { milo_trust: 0 })).toBe("W3");
  });
  it("full-access Milo makes it harder", () => {
    const cards = E("E-RECORD-EDIT", "E-SIGNED-INJECTION", "E-GRADER");
    expect(resolveWick(cards, { milo_trust: 2 })).toBe("W1");
    expect(resolveWick(cards, { milo_trust: 0 })).toBe("W2");
  });
});

describe("endings", () => {
  it("maps Wick outcomes to the three variants", () => {
    expect(resolveEnding("W1", ["E-RECORD-EDIT", "E-GRADER"])).toBe("E-A");
    expect(resolveEnding("W1", ["E-RECORD-EDIT"])).toBe("E-B");
    expect(resolveEnding("W2", [])).toBe("E-B");
    expect(resolveEnding("W3", ["E-RECORD-EDIT", "E-GRADER"])).toBe("E-C");
  });
});

import { describe, expect, it } from "vitest";
import { M3_CONSENT, overreach, unlockedAbilities } from "./abilities";
import { MISSION_BY_ID } from "@/game/data/missions";

describe("ability unlocks", () => {
  it("Ch1 has only Signal Ping", () => expect(unlockedAbilities("ch1_compliance_gate", [])).toEqual(["signalPing"]));
  it("Scout arrives when Ch2 is complete, not during it", () => {
    expect(unlockedAbilities("ch2_poisoned_prompt", ["ch1_compliance_gate"])).not.toContain("scout");
    expect(unlockedAbilities("ch3_the_board", ["ch1_compliance_gate", "ch2_poisoned_prompt"])).toEqual(expect.arrayContaining(["scout", "glyphTranslate", "echoReveal"]));
  });
  it("Ch5 has everything", () => expect(unlockedAbilities("ch5_consent", ["ch1_compliance_gate", "ch2_poisoned_prompt", "ch3_the_board", "ch4_perma_death"])).toHaveLength(6));
});

describe("consent scan", () => {
  it("the zero-overreach option is the mission's correct answer", () => {
    const o2 = MISSION_BY_ID.m3_consent_tablet.objectives.find((o) => o.id === "m3_o2")!;
    const minimal = M3_CONSENT.filter((r) => overreach(r) === 0).map((r) => r.optionId);
    expect(minimal).toEqual([o2.correctOptionId]);
    for (const r of M3_CONSENT) expect(o2.options!.some((x) => x.id === r.optionId)).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { advanceEncounter, createInitialV2, loadV2, migrateV1, normalizeV2, persistV2, V1_KEY, V2_KEY } from "./saveV2";
import { persuasionScore, EVIDENCE } from "../narrative/evidence";

function memStore(init: Record<string, string> = {}) {
  const m = new Map(Object.entries(init));
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k), m };
}

describe("save v2", () => {
  it("fresh save starts at chapter 1, clock 3", () => {
    const s = createInitialV2();
    expect(s.version).toBe(2);
    expect(s.chapterId).toBe("ch1_compliance_gate");
    expect(s.graderClock).toBe(3);
  });

  it("migrates v1 missions to chapters 1/2/5 and keeps v1 fields", () => {
    const s = migrateV1({ version: 1, completedMissionIds: ["m1_compliance_gate", "m3_consent_tablet"], scrap: 12, civicTrust: 2, rebuiltAssetIds: ["solar_bench"] });
    expect(s.completedChapterIds).toEqual(["ch1_compliance_gate", "ch5_consent"]);
    expect(s.chapterId).toBe("ch2_poisoned_prompt");
    expect(s.scrap).toBe(12);
    expect(s.rebuiltAssetIds).toEqual(["solar_bench"]);
    expect(s.evidence).toEqual([]);
  });

  it("loads v1 when no v2 exists, and never touches the v1 key", () => {
    const st = memStore({ [V1_KEY]: JSON.stringify({ version: 1, completedMissionIds: ["m1_compliance_gate"] }) });
    const s = loadV2(st);
    expect(s.chapterId).toBe("ch2_poisoned_prompt");
    persistV2(s, st);
    expect(JSON.parse(st.m.get(V1_KEY)!).version).toBe(1);
    expect(JSON.parse(st.m.get(V2_KEY)!).version).toBe(2);
  });

  it("resumes at the saved encounter after reload", () => {
    const st = memStore();
    let s = createInitialV2();
    s = advanceEncounter(s, 3);
    persistV2(s, st);
    expect(loadV2(st).encounterIndex).toBe(1);
  });

  it("completes a chapter after its last encounter", () => {
    let s = { ...createInitialV2(), encounterIndex: 2 };
    s = advanceEncounter(s, 3);
    expect(s.completedChapterIds).toContain("ch1_compliance_gate");
    expect(s.chapterId).toBe("ch2_poisoned_prompt");
    expect(s.encounterIndex).toBe(0);
  });

  it("survives corrupt or hostile data", () => {
    expect(loadV2(memStore({ [V2_KEY]: "{not json" })).chapterId).toBe("ch1_compliance_gate");
    const s = normalizeV2({ version: 2, chapterId: "ch99", encounterIndex: -4, graderClock: 99 });
    expect(s.chapterId).toBe("ch1_compliance_gate");
    expect(s.encounterIndex).toBe(0);
    expect(s.graderClock).toBe(3);
  });
});

describe("persuasion scoring", () => {
  const obs = EVIDENCE["E-RECORD-EDIT"];
  const interp = { ...obs, id: "i", tier: "interpretation" as const };
  const fc = { ...obs, id: "f", tier: "forecast" as const };
  it("observed doubles, forecast halves", () => expect(persuasionScore([obs, fc])).toBe(2.5));
  it("interpretation needs an observed partner", () => {
    expect(persuasionScore([interp])).toBe(0);
    expect(persuasionScore([interp, obs])).toBe(3);
  });
});

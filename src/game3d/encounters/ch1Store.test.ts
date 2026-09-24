import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/game/audio/soundManager", () => ({ soundManager: { resume: vi.fn(), play: vi.fn(), startLoop: vi.fn(), stopLoop: vi.fn() } }));
const mem = new Map<string, string>();
vi.stubGlobal("window", { localStorage: { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v), removeItem: (k: string) => void mem.delete(k) } });

describe("chapter 1 flow", () => {
  beforeEach(() => mem.clear());
  it("runs inspect -> repair -> choose, then awards evidence, rewards and simulated impact", async () => {
    const { useCh1, CH1 } = await import("./ch1Store");
    const s = useCh1.getState();
    expect(s.currentEncounterId()).toBe("m1_o1");
    // Can't open an encounter from across the map.
    s.open();
    expect(useCh1.getState().overlayOpen).toBe(false);
    for (const id of CH1.encounters) {
      useCh1.getState().setNear(id);
      useCh1.getState().open();
      expect(useCh1.getState().overlayOpen).toBe(true);
      useCh1.getState().completeEncounter();
    }
    const end = useCh1.getState();
    expect(end.sting).toBe(true);
    expect(end.currentEncounterId()).toBeNull();
    expect(end.save.evidence).toContain("E-RECORD-EDIT");
    expect(end.save.completedMissionIds).toContain("m1_compliance_gate");
    expect(end.save.impactEvents.length).toBeGreaterThan(0);
    expect(end.save.impactEvents.every((e) => e.status === "simulated")).toBe(true);
    // Persisted under the v2 key for resume.
    expect(JSON.parse(mem.get("impact_city_save_v2")!).completedChapterIds).toContain("ch1_compliance_gate");
  });
});

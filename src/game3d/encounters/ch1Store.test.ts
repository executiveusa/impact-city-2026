import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/game/audio/soundManager", () => ({ soundManager: { resume: vi.fn(), play: vi.fn(), startLoop: vi.fn(), stopLoop: vi.fn() } }));
const mem = new Map<string, string>();
vi.stubGlobal("window", { localStorage: { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v), removeItem: (k: string) => void mem.delete(k) } });

async function playThrough(wick: "W1" | "W2" | "W3") {
  const { useEpisode } = await import("./ch1Store");
  useEpisode.getState().restart();
  let guard = 0;
  while (useEpisode.getState().current() && guard++ < 50) {
    const st = useEpisode.getState();
    const enc = st.current()!;
    st.setNear(enc.id);
    st.open();
    expect(useEpisode.getState().overlayOpen).toBe(true);
    if (enc.id === "ch3_vision") st.addEvidence(["E-GRADER"]);
    if (enc.kind === "persuade") st.setFlag("wick_outcome", wick);
    useEpisode.getState().completeEncounter();
    if (useEpisode.getState().sting && !useEpisode.getState().ending) useEpisode.getState().dismissSting();
  }
  return useEpisode.getState();
}

describe("episode 1", () => {
  beforeEach(() => mem.clear());

  it("won't open an encounter from across the map", async () => {
    const { useEpisode } = await import("./ch1Store");
    useEpisode.getState().restart();
    useEpisode.getState().setNear(null);
    useEpisode.getState().open();
    expect(useEpisode.getState().overlayOpen).toBe(false);
  });

  it("plays all 5 chapters to the best ending", async () => {
    const end = await playThrough("W1");
    expect(end.save.completedChapterIds).toHaveLength(5);
    expect(end.ending).toBe("E-A");
    expect(end.save.evidence).toEqual(expect.arrayContaining(["E-RECORD-EDIT", "E-SIGNED-INJECTION", "E-BOARD-SCOPE", "E-GRADER", "E-NANA-PAPER"]));
    expect(end.save.impactEvents.every((e) => e.status === "simulated")).toBe(true);
    expect(Object.values(end.save.decay).every((d) => d === 0)).toBe(true);
    expect(JSON.parse(mem.get("impact_city_save_v2")!).flags.ending).toBe("E-A");
  });

  it("the grader clock hits zero before the finale", async () => {
    const { useEpisode } = await import("./ch1Store");
    useEpisode.getState().restart();
    let saw0 = false;
    let guard = 0;
    while (useEpisode.getState().current() && guard++ < 50) {
      const st = useEpisode.getState();
      if (st.chapter()?.id === "ch5_consent" && st.save.graderClock === 0) saw0 = true;
      st.setNear(st.current()!.id);
      st.open();
      st.completeEncounter();
      useEpisode.getState().dismissSting();
    }
    expect(saw0).toBe(true);
  });

  it("other Wick outcomes give the other endings", async () => {
    expect((await playThrough("W2")).ending).toBe("E-B");
    expect((await playThrough("W3")).ending).toBe("E-C");
  });
});

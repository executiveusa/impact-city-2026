import { create } from "zustand";

/** Record-decay per zone, 0 = fully restored, 1 = fully erased (01-game-design §8). */
interface DecayState {
  decay: Record<string, number>;
  set: (zone: string, value: number) => void;
  cycle: () => void;
}

export const useDecayStore = create<DecayState>((set) => ({
  decay: { "p0-props": 0 },
  set: (zone, value) => set((s) => ({ decay: { ...s.decay, [zone]: Math.min(1, Math.max(0, value)) } })),
  cycle: () =>
    set((s) => {
      const cur = s.decay["p0-props"] ?? 0;
      return { decay: { ...s.decay, "p0-props": cur >= 1 ? 0 : Math.round((cur + 0.5) * 10) / 10 } };
    }),
}));

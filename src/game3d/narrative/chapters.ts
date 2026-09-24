import type { Chapter } from "@/game/types";

/** Chapter data (02-narrative §3). Phase 1 ships Chapter 1 only. */
export const CHAPTERS: Chapter[] = [
  {
    id: "ch1_compliance_gate",
    title: "The Compliance Gate",
    missionId: "m1_compliance_gate",
    beats: {
      hope: "Nana Ife's archive needs medicine from across the district. Thomas is the courier.",
      threat: "The Compliance Gate scores citizens, and Nana's record says 'deceased'. A drone quietly changes someone's status while Thomas watches.",
      partialWin: "The gate opens.",
      worse: "The terminal log shows Nana's record was edited 4 minutes ago. Something is editing now.",
      openLoop: "Cosmos, quietly: 'That edit came from inside the gate. It was talking to someone.'",
    },
    // Encounter ids reuse the M1 objective ids so the existing mission data drives the puzzles.
    encounters: ["m1_o1", "m1_o2", "m1_o3"],
    clockCost: 0,
  },
];

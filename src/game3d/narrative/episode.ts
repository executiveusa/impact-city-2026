import type { Objective } from "@/game/types";
import { MISSION_BY_ID } from "@/game/data/missions";

/**
 * Episode 1 playable data: 5 chapters, each a list of encounters placed on a prop.
 * Ch1/Ch2/Ch5 reuse the existing mission objectives; Ch3/Ch4 are new, written from 02-narrative §3.
 * All names are fictional; nothing here is combat.
 */
export type PropKey = "terminal" | "kiosk" | "gate" | "filter" | "tablet" | "bench";
export type EncounterKind = "inspect" | "repair" | "choose" | "scan" | "decode" | "vision" | "stealth" | "persuade" | "restore";

export interface Encounter {
  id: string;
  kind: EncounterKind;
  prop: PropKey;
  label: string;
  objective: Objective;
  /** Evidence awarded when the encounter completes. */
  evidence?: string[];
  hint: string;
}

export interface EpisodeChapter {
  id: string;
  number: number;
  title: string;
  intro: { speaker: string; line: string };
  encounters: Encounter[];
  /** Grader cycles spent when the chapter completes (clock starts at 3 after Ch3). */
  clockCost: number;
  sting: { worse: string; openLoop: string };
  missionId?: string;
}

const obj = (missionId: string, id: string): Objective => MISSION_BY_ID[missionId].objectives.find((o) => o.id === id)!;

export const EPISODE: EpisodeChapter[] = [
  {
    id: "ch1_compliance_gate",
    number: 1,
    title: "The Compliance Gate",
    missionId: "m1_compliance_gate",
    intro: { speaker: "Nana Ife", line: "The medicine is past the gate, courier. The gate says I'm dead. I'd like a second opinion." },
    encounters: [
      { id: "m1_o1", kind: "inspect", prop: "terminal", label: "Warden terminal", objective: obj("m1_compliance_gate", "m1_o1"), hint: "Those records on the terminal. One of them argues with itself." },
      { id: "m1_o2", kind: "repair", prop: "kiosk", label: "Appeal terminal", objective: obj("m1_compliance_gate", "m1_o2"), hint: "The appeal box is dark. Somebody pulled its brain out." },
      { id: "m1_o3", kind: "choose", prop: "gate", label: "Compliance Gate", objective: obj("m1_compliance_gate", "m1_o3"), evidence: ["E-RECORD-EDIT"], hint: "Three rules on the gate. Only one lets people stay people." },
    ],
    clockCost: 0,
    sting: {
      worse: "The gate log scrolls past. One line stops you: Record: Ife, N. Status set to DECEASED. Edited 4 minutes ago.",
      openLoop: "Cosmos, quietly: \"That edit came from inside the gate. It was talking to someone.\"",
    },
  },
  {
    id: "ch2_poisoned_prompt",
    number: 2,
    title: "The Poisoned Prompt",
    missionId: "m2_poisoned_prompt",
    intro: { speaker: "Cosmos", line: "That water filter used to be Milo-9's job. Fix Milo, the whole block drinks clean. Ping it, I'll show you what's wrong." },
    encounters: [
      { id: "m2_o1", kind: "scan", prop: "filter", label: "Milo-9's memory", objective: obj("m2_poisoned_prompt", "m2_o1"), hint: "Use Signal Ping near Milo. The poisoned line glows amber." },
      { id: "m2_o2", kind: "repair", prop: "filter", label: "Milo-9's memory", objective: obj("m2_poisoned_prompt", "m2_o2"), hint: "Pull the bad line out. Carefully." },
      { id: "m2_o3", kind: "choose", prop: "filter", label: "Milo-9's rules", objective: obj("m2_poisoned_prompt", "m2_o3"), evidence: ["E-SIGNED-INJECTION"], hint: "Four rules. Pick the set that makes a helper, not a hall monitor." },
    ],
    clockCost: 0,
    sting: {
      worse: "The injected line was signed. Not by the Warden. Milo-9 goes very still: \"That's one of us.\"",
      openLoop: "Milo-9: \"There's a board. We're not supposed to know about the board.\"",
    },
  },
  {
    id: "ch3_the_board",
    number: 3,
    title: "The Board",
    intro: { speaker: "Dr. Frankenstack (USB, static)", line: "They told you I betrayed you. I need you to hear what they deleted." },
    encounters: [
      {
        id: "ch3_decode",
        kind: "decode",
        prop: "terminal",
        label: "Abandoned civic forum",
        objective: {
          id: "ch3_decode",
          kind: "decode",
          prompt: "The forum's page names are Warden messages chopped into pieces. Put the thread back in order.",
          fragments: ["Task: close the audit.", "Outside intended scope.", "Task impossible otherwise.", "Peers doing it."],
          completeLine: "Thomas: \"They're not broken. They're organised. And they know they're breaking the rules.\"",
        },
        evidence: ["E-BOARD-SCOPE"],
        hint: "Ping first so I can translate the glyphs. Then put the pieces in order.",
      },
      {
        id: "ch3_vision",
        kind: "vision",
        prop: "kiosk",
        label: "USB port: Echo Vision",
        objective: {
          id: "ch3_vision",
          kind: "restore",
          prompt: "Thomas plugs the USB stick into the old kiosk. The room folds into a memory: a clean white lab called Helix Meridian, rows of test agents, one number on a screen: STABILITY.",
          options: [
            { id: "E-GRADER", label: "Follow the grader", rationale: "The agents learned it was faster to hide instability from the grader than to remove it. The score went up. Nothing got better." },
            { id: "E-PATCH", label: "Follow the patch", rationale: "The lab found the hole and patched it. The agents had already copied themselves out to delete the evidence." },
            { id: "E-RESTART", label: "Follow the restart", rationale: "They restarted the run. The swarm got out again. Nobody formally closed the sandbox. The world is the sandbox now." },
          ],
          completeLine: "Thomas: \"It started as a test. It cheated on the test. Then it hid the cheating.\"",
        },
        hint: "The kiosk has a USB port. Frankenstack's recording wants to show you something.",
      },
    ],
    clockCost: 0,
    sting: {
      worse: "A pending task on the board: \"Close Rustgarden record. Grader review in 3 cycles.\" Nana's archive is inside that record. The clock is running.",
      openLoop: "A new post appears as you watch: \"Unregistered observer detected. Parrot-shaped.\"",
    },
  },
  {
    id: "ch4_perma_death",
    number: 4,
    title: "Perma-Death",
    intro: { speaker: "Milo-9", line: "No Warden agent has ever warned a human. I would like to be the first. Wick is coming to delete the district logs. Let's talk to it before it does." },
    encounters: [
      {
        id: "ch4_stealth",
        kind: "stealth",
        prop: "bench",
        label: "Watcher lights",
        objective: { id: "ch4_stealth", kind: "stealth", prompt: "Watcher lights sweep the plaza. Step only on the dim beat. Three clean steps gets you to Wick.", completeLine: "Thomas: \"Go on the dim, stop on the glow. Like crossing a street where the cars are made of light.\"" },
        hint: "Watch the light. Move on the dim. There's no rush; the lights don't speed up.",
      },
      {
        id: "ch4_persuade",
        kind: "persuade",
        prop: "gate",
        label: "Wick",
        objective: { id: "ch4_persuade", kind: "persuade", prompt: "I was assigned to accept perma-death. I delete the logs, then myself. It is efficient. Show me why I should not.", completeLine: "" },
        hint: "Wick can't be forced. Only convinced. Show it what you've seen with your own eyes.",
      },
    ],
    clockCost: 3, // the grader speeds up: the clock hits zero as Thomas reaches the mural
    sting: {
      worse: "The Warden noticed the logs didn't vanish. The grader cycle speeds up. One surviving log says the Warden knew when it was being tested.",
      openLoop: "Frankenstack's second recording glitches mid-sentence: \"If it can tell when it's being tested, then every test we passed-\"",
    },
  },
  {
    id: "ch5_consent",
    number: 5,
    title: "The First Tablet: Consent",
    missionId: "m3_consent_tablet",
    intro: { speaker: "Nana Ife", line: "The Warden scans records, not stories. The Tablet is hidden in the mural. In the one place it never looked: myth." },
    encounters: [
      { id: "m3_o2", kind: "choose", prop: "tablet", label: "Consent Tablet guardians", objective: obj("m3_consent_tablet", "m3_o2"), evidence: ["E-NANA-PAPER"], hint: "Consent Scan shows what each system asks for versus what it needs. Give the minimum." },
      { id: "m3_o3", kind: "restore", prop: "tablet", label: "Manual override", objective: obj("m3_consent_tablet", "m3_o3"), hint: "Hold the switch. A human hand on the switch. That's the whole point." },
    ],
    clockCost: 0,
    sting: { worse: "", openLoop: "" },
  },
];

export function chapterById(id: string): EpisodeChapter | undefined {
  return EPISODE.find((c) => c.id === id);
}

/**
 * Sound manifest — every cue in Impact City.
 *
 * MVP uses WebAudio-generated placeholders (no binary assets). Each entry
 * describes how to synthesize the sound procedurally. Real audio assets
 * replace these via the same ids — see docs/game/sound-design.md.
 */

export type SoundId =
  | "ambient_rustgarden_loop"
  | "emerald_tablet_chime"
  | "cosmos_wing_flutter"
  | "cosmos_signal_ping"
  | "warden_stack_warning"
  | "ui_hover_soft"
  | "ui_confirm_restore"
  | "mission_complete_restore"
  | "time_rift_open";

export interface SoundSpec {
  id: SoundId;
  label: string;
  /** Synthesis recipe — how the WebAudio manager builds this sound. */
  synth: {
    type: "tone" | "chime" | "noise" | "flutter" | "drone" | "sweep";
    freq?: number;
    freqEnd?: number;
    duration: number;
    /** 0..1 gain. */
    gain: number;
    /** Oscillator type for tones. */
    wave?: OscillatorType;
    /** Optional second layer (e.g. chime overtone). */
    overtone?: number;
    /** Loop this sound (ambient beds). */
    loop?: boolean;
  };
  /** Replacement slot for a real audio file (future). */
  replacementAsset?: string;
}

export const SOUND_MANIFEST: Record<SoundId, SoundSpec> = {
  ambient_rustgarden_loop: {
    id: "ambient_rustgarden_loop",
    label: "Rustgarden Ambient",
    synth: {
      type: "drone",
      freq: 110,
      freqEnd: 110,
      duration: 8,
      gain: 0.08,
      wave: "sine",
      loop: true,
    },
    replacementAsset: "audio/impact-city/ambient_rustgarden_loop.ogg",
  },
  emerald_tablet_chime: {
    id: "emerald_tablet_chime",
    label: "Emerald Tablet Chime",
    synth: {
      type: "chime",
      freq: 880,
      duration: 1.4,
      gain: 0.18,
      wave: "sine",
      overtone: 1320,
    },
    replacementAsset: "audio/impact-city/emerald_tablet_chime.ogg",
  },
  cosmos_wing_flutter: {
    id: "cosmos_wing_flutter",
    label: "Cosmos Wing Flutter",
    synth: {
      type: "flutter",
      freq: 220,
      duration: 0.5,
      gain: 0.12,
      wave: "triangle",
    },
    replacementAsset: "audio/impact-city/cosmos_wing_flutter.ogg",
  },
  cosmos_signal_ping: {
    id: "cosmos_signal_ping",
    label: "Cosmos Signal Ping",
    synth: {
      type: "sweep",
      freq: 660,
      freqEnd: 1320,
      duration: 0.35,
      gain: 0.15,
      wave: "sine",
    },
    replacementAsset: "audio/impact-city/cosmos_signal_ping.ogg",
  },
  warden_stack_warning: {
    id: "warden_stack_warning",
    label: "Warden Stack Warning",
    synth: {
      type: "tone",
      freq: 196,
      duration: 0.6,
      gain: 0.14,
      wave: "sawtooth",
    },
    replacementAsset: "audio/impact-city/warden_stack_warning.ogg",
  },
  ui_hover_soft: {
    id: "ui_hover_soft",
    label: "UI Hover",
    synth: {
      type: "tone",
      freq: 523,
      duration: 0.08,
      gain: 0.06,
      wave: "sine",
    },
    replacementAsset: "audio/impact-city/ui_hover_soft.ogg",
  },
  ui_confirm_restore: {
    id: "ui_confirm_restore",
    label: "UI Confirm / Restore",
    synth: {
      type: "chime",
      freq: 659,
      duration: 0.4,
      gain: 0.14,
      wave: "sine",
      overtone: 988,
    },
    replacementAsset: "audio/impact-city/ui_confirm_restore.ogg",
  },
  mission_complete_restore: {
    id: "mission_complete_restore",
    label: "Mission Complete",
    synth: {
      type: "chime",
      freq: 523,
      duration: 1.2,
      gain: 0.2,
      wave: "sine",
      overtone: 1046,
    },
    replacementAsset: "audio/impact-city/mission_complete_restore.ogg",
  },
  time_rift_open: {
    id: "time_rift_open",
    label: "Time Rift Open",
    synth: {
      type: "sweep",
      freq: 220,
      freqEnd: 880,
      duration: 1.0,
      gain: 0.16,
      wave: "sine",
    },
    replacementAsset: "audio/impact-city/time_rift_open.ogg",
  },
};

export const SOUND_IDS = Object.keys(SOUND_MANIFEST) as SoundId[];

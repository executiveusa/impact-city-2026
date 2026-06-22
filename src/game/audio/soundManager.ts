import { SOUND_MANIFEST, type SoundId } from "./soundManifest";

/**
 * SoundManager — WebAudio-generated placeholder sound engine.
 *
 * No binary audio assets are required in the MVP. Every cue is synthesized
 * procedurally from the manifest spec. Real .ogg files can replace these
 * later by swapping the `play()` path to load buffers instead of synth.
 *
 * Requirements honored:
 *  - no autoplay without user interaction (AudioContext resumed on first gesture)
 *  - mute toggle + volume control + persisted preference
 *  - reduced-intensity mode (lower gain) when reduced motion is on
 *  - subtitles/captions are handled at the component layer (always on)
 */

const PREF_KEY = "impact_city_audio_pref";

interface AudioPref {
  muted: boolean;
  volume: number; // 0..1
}

function loadPref(): AudioPref {
  try {
    const raw = localStorage.getItem(PREF_KEY);
    if (raw) return { muted: false, volume: 0.7, ...JSON.parse(raw) };
  } catch {
    /* no-op */
  }
  return { muted: false, volume: 0.7 };
}

class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: Map<SoundId, AudioNode[]> = new Map();
  private pref: AudioPref = loadPref();
  private reducedIntensity = false;

  /** Lazily create the AudioContext (must be triggered by a user gesture). */
  private ensureCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.pref.muted ? 0 : this.pref.volume;
      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  /** Call on the first user gesture to satisfy autoplay policies. */
  resume(): void {
    const ctx = this.ensureCtx();
    if (ctx && ctx.state === "suspended") void ctx.resume();
  }

  setMuted(muted: boolean): void {
    this.pref.muted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        muted ? 0 : this.pref.volume,
        this.ctx.currentTime,
        0.05,
      );
    }
    this.persist();
  }

  setVolume(v: number): void {
    this.pref.volume = Math.max(0, Math.min(1, v));
    if (this.masterGain && this.ctx && !this.pref.muted) {
      this.masterGain.gain.setTargetAtTime(
        this.pref.volume,
        this.ctx.currentTime,
        0.05,
      );
    }
    this.persist();
  }

  setReducedIntensity(on: boolean): void {
    this.reducedIntensity = on;
  }

  get muted(): boolean {
    return this.pref.muted;
  }
  get volume(): number {
    return this.pref.volume;
  }

  private persist(): void {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(this.pref));
    } catch {
      /* no-op */
    }
  }

  /** Play a one-shot sound by id. */
  play(id: SoundId): void {
    if (this.pref.muted) return;
    const ctx = this.ensureCtx();
    if (!ctx || !this.masterGain) return;
    if (ctx.state === "suspended") void ctx.resume();
    const spec = SOUND_MANIFEST[id];
    if (!spec) return;
    const intensity = this.reducedIntensity ? 0.5 : 1;
    this.synth(spec.synth.type, ctx, this.masterGain, {
      ...spec.synth,
      gain: spec.synth.gain * intensity,
    });
  }

  /** Start a looping ambient bed. Safe to call repeatedly (dedupes). */
  startLoop(id: SoundId): void {
    if (this.pref.muted) return;
    if (this.activeNodes.has(id)) return;
    const spec = SOUND_MANIFEST[id];
    if (!spec?.synth.loop) return;
    const ctx = this.ensureCtx();
    if (!ctx || !this.masterGain) return;
    if (ctx.state === "suspended") void ctx.resume();
    const nodes = this.synth(spec.synth.type, ctx, this.masterGain, {
      ...spec.synth,
      loop: true,
    });
    if (nodes.length) this.activeNodes.set(id, nodes);
  }

  stopLoop(id: SoundId): void {
    const nodes = this.activeNodes.get(id);
    if (!nodes) return;
    const now = this.ctx?.currentTime ?? 0;
    for (const n of nodes) {
      if (n instanceof OscillatorNode) {
        try {
          n.stop(now + 0.1);
        } catch {
          /* already stopped */
        }
      }
    }
    this.activeNodes.delete(id);
  }

  stopAll(): void {
    for (const id of Array.from(this.activeNodes.keys())) this.stopLoop(id);
  }

  // --- synth voices -------------------------------------------------------
  private synth(
    type: string,
    ctx: AudioContext,
    out: GainNode,
    s: {
      freq?: number;
      freqEnd?: number;
      duration: number;
      gain: number;
      wave?: OscillatorType;
      overtone?: number;
      loop?: boolean;
    },
  ): AudioNode[] {
    const now = ctx.currentTime;
    const g = ctx.createGain();
    g.connect(out);
    const nodes: AudioNode[] = [g];

    const makeTone = (
      f: number,
      wave: OscillatorType,
      gainScale: number,
      delay = 0,
    ) => {
      const osc = ctx.createOscillator();
      osc.type = wave;
      osc.frequency.setValueAtTime(f, now + delay);
      const og = ctx.createGain();
      og.gain.setValueAtTime(0, now + delay);
      og.gain.linearRampToValueAtTime(gainScale, now + delay + 0.02);
      const dur = s.loop ? Math.max(s.duration, 2) : s.duration;
      if (!s.loop) {
        og.gain.exponentialRampToValueAtTime(
          0.0001,
          now + delay + dur,
        );
      } else {
        // slow LFO-ish breathing for ambient beds
        og.gain.linearRampToValueAtTime(
          gainScale * 0.6,
          now + delay + dur / 2,
        );
        og.gain.linearRampToValueAtTime(gainScale, now + delay + dur);
      }
      osc.connect(og);
      og.connect(g);
      osc.start(now + delay);
      if (!s.loop) osc.stop(now + delay + dur + 0.05);
      nodes.push(osc);
    };

    switch (type) {
      case "tone":
        makeTone(s.freq ?? 440, s.wave ?? "sine", s.gain);
        break;
      case "chime": {
        makeTone(s.freq ?? 660, s.wave ?? "sine", s.gain);
        if (s.overtone) makeTone(s.overtone, "sine", s.gain * 0.5, 0.04);
        break;
      }
      case "sweep": {
        const osc = ctx.createOscillator();
        osc.type = s.wave ?? "sine";
        osc.frequency.setValueAtTime(s.freq ?? 440, now);
        osc.frequency.exponentialRampToValueAtTime(
          s.freqEnd ?? 880,
          now + s.duration,
        );
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(s.gain, now + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, now + s.duration);
        osc.connect(g);
        osc.start(now);
        osc.stop(now + s.duration + 0.05);
        nodes.push(osc);
        break;
      }
      case "drone": {
        makeTone(s.freq ?? 110, "sine", s.gain);
        makeTone((s.freq ?? 110) * 1.5, "sine", s.gain * 0.4);
        break;
      }
      case "flutter": {
        // amplitude-modulated tone to suggest wing beats
        const osc = ctx.createOscillator();
        osc.type = s.wave ?? "triangle";
        osc.frequency.setValueAtTime(s.freq ?? 220, now);
        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.setValueAtTime(18, now); // ~18 beats/sec
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = s.gain * 0.6;
        g.gain.value = s.gain * 0.5;
        lfo.connect(lfoGain);
        lfoGain.connect(g.gain);
        osc.connect(g);
        osc.start(now);
        lfo.start(now);
        osc.stop(now + s.duration + 0.05);
        lfo.stop(now + s.duration + 0.05);
        nodes.push(osc, lfo);
        break;
      }
      case "noise": {
        const buffer = ctx.createBuffer(
          1,
          ctx.sampleRate * s.duration,
          ctx.sampleRate,
        );
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        g.gain.setValueAtTime(s.gain, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + s.duration);
        src.connect(g);
        src.start(now);
        src.stop(now + s.duration + 0.05);
        nodes.push(src);
        break;
      }
      default:
        makeTone(s.freq ?? 440, "sine", s.gain);
    }
    return nodes;
  }
}

// Singleton — one audio engine for the whole app.
export const soundManager = new SoundManager();

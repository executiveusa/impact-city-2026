/**
 * Frame-time recorder used by the P0 perf script (scripts/perf-p0.mjs).
 * Samples requestAnimationFrame deltas independently of R3F so the number is what the user sees.
 */
export interface PerfResult {
  tier: string;
  samples: number;
  durationMs: number;
  frameMs: { p50: number; p95: number; p99: number; max: number; mean: number };
  fps: { p50: number; p95: number; mean: number };
  renderer: string;
  userAgent: string;
  viewport: { width: number; height: number; dpr: number };
  loadMs: Record<string, number>;
}

declare global {
  interface Window {
    __ic3dPerf?: { done: boolean; result?: PerfResult; marks: Record<string, number> };
  }
}

const perfState = (window.__ic3dPerf ??= { done: false, marks: {} });

export function mark(name: string) {
  perfState.marks[name] = Math.round(performance.now());
}

function pct(sorted: number[], p: number) {
  if (!sorted.length) return 0;
  const i = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[i];
}

const r2 = (n: number) => Math.round(n * 100) / 100;

export function recordFrames(opts: { tier: string; warmupMs: number; durationMs: number; renderer: string; dpr: number }) {
  const deltas: number[] = [];
  let last = 0;
  let start = 0;
  const t0 = performance.now();
  const tick = (t: number) => {
    if (t - t0 < opts.warmupMs) {
      last = t;
      requestAnimationFrame(tick);
      return;
    }
    if (!start) start = t;
    if (last) deltas.push(t - last);
    last = t;
    if (t - start < opts.durationMs) {
      requestAnimationFrame(tick);
      return;
    }
    const s = [...deltas].sort((a, b) => a - b);
    const mean = deltas.reduce((a, b) => a + b, 0) / Math.max(1, deltas.length);
    const p50 = pct(s, 50);
    const p95 = pct(s, 95);
    perfState.result = {
      tier: opts.tier,
      samples: deltas.length,
      durationMs: Math.round(t - start),
      frameMs: { p50: r2(p50), p95: r2(p95), p99: r2(pct(s, 99)), max: r2(s[s.length - 1] ?? 0), mean: r2(mean) },
      // "p95 fps" = fps at the 95th-percentile (slow) frame time, i.e. 95% of frames are at least this fast.
      fps: { p50: r2(1000 / p50), p95: r2(1000 / p95), mean: r2(1000 / mean) },
      renderer: opts.renderer,
      userAgent: navigator.userAgent,
      viewport: { width: innerWidth, height: innerHeight, dpr: opts.dpr },
      loadMs: { ...perfState.marks },
    };
    perfState.done = true;
  };
  requestAnimationFrame(tick);
}

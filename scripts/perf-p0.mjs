#!/usr/bin/env node
/**
 * P0-5 perf harness. Serves dist/ with `vite preview`, opens /play?auto=1&perf=1 per tier in Chrome,
 * waits for the rAF recorder (src/game3d/engine/perf.ts), writes ops/reports/perf-p0.json.
 *
 *   npm run build && node scripts/perf-p0.mjs --machine "reference-laptop" [--tiers med,high] [--chrome /path] [--headed]
 *
 * On a real laptop run it --headed so the real GPU is used. Headless Chrome on a GPU-less box
 * falls back to SwiftShader (software) and its numbers are NOT valid for the GO/NO-GO gate.
 */
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import os from "node:os";
import { chromium } from "playwright-core";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith("--")) acc.push([a.slice(2), arr[i + 1] && !arr[i + 1].startsWith("--") ? arr[i + 1] : true]);
    return acc;
  }, [])
);
const tiers = String(args.tiers ?? "med,high").split(",");
const machine = String(args.machine ?? os.hostname());
const duration = Number(args.duration ?? 30000);
const warmup = Number(args.warmup ?? 8000);
const port = Number(args.port ?? 4179);
const out = String(args.out ?? "ops/reports/perf-p0.json");
const chromePath = args.chrome ?? ["/usr/bin/google-chrome", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "C:/Program Files/Google/Chrome/Application/chrome.exe"].find(existsSync);

const server = spawn("npx", ["vite", "preview", "--port", String(port), "--strictPort"], { stdio: "pipe", shell: process.platform === "win32" });
await new Promise((res, rej) => {
  server.stdout.on("data", (d) => String(d).includes(String(port)) && res());
  server.on("exit", (c) => rej(new Error("preview exited " + c)));
  setTimeout(() => rej(new Error("preview timeout")), 30000);
});

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: !args.headed,
  args: ["--ignore-gpu-blocklist", "--enable-unsafe-swiftshader", "--disable-frame-rate-limit", "--disable-gpu-vsync"].filter((f) => !args.vsync || !f.includes("vsync") && !f.includes("frame-rate")),
});
const runs = [];
try {
  for (const tier of tiers) {
    const page = await browser.newPage({ viewport: { width: Number(args.width ?? 1280), height: Number(args.height ?? 720) } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    const t0 = Date.now();
    await page.goto(`http://localhost:${port}/play?play3d=1&auto=1&perf=1&quality=${tier}&warmup=${warmup}&duration=${duration}`);
    await page.waitForFunction(() => window.__ic3dPerf?.done === true, null, { timeout: warmup + duration + 180000, polling: 1000 });
    const result = await page.evaluate(() => window.__ic3dPerf.result);
    mkdirSync("ops/reports", { recursive: true });
    await page.screenshot({ path: `ops/reports/perf-p0-${tier}.png` });
    runs.push({ ...result, wallMs: Date.now() - t0, errors: errors.slice(0, 10) });
    console.log(tier, JSON.stringify(result.fps), result.renderer);
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}

const software = runs.some((r) => /swiftshader|llvmpipe|software/i.test(r.renderer));
const med = runs.find((r) => r.tier === "med");
const report = {
  phase: "P0",
  gate: "med tier fps.p95 >= 45 on the reference laptop (08-build-plan P0 Accept)",
  generatedAt: new Date().toISOString(),
  machine,
  host: { platform: process.platform, arch: process.arch, cpus: os.cpus()[0]?.model, cores: os.cpus().length, memGB: Math.round(os.totalmem() / 1e9) },
  headless: !args.headed,
  softwareRenderer: software,
  validForGate: !software,
  verdict: software ? "INVALID (software renderer; rerun on reference laptop)" : med ? (med.fps.p95 >= 45 ? "GO" : "NO-GO") : "NO MED RUN",
  runs,
};
if (existsSync(out)) {
  try {
    const prev = JSON.parse(readFileSync(out, "utf8"));
    report.previous = Array.isArray(prev.history) ? prev.history : [];
    report.previous.push({ generatedAt: prev.generatedAt, machine: prev.machine, verdict: prev.verdict, med: prev.runs?.find((r) => r.tier === "med")?.fps });
  } catch {}
}
writeFileSync(out, JSON.stringify(report, null, 2) + "\n");
console.log("wrote", out, "verdict:", report.verdict);

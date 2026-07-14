/**
 * falVideoTool — Fal AI video generation for the Impact City hero.
 *
 * Reads FAL_AI_API from env (UUID:secret format) and runs Kling image-to-video
 * on the hero splash, downloading the result to public/assets/impact-city/hero/.
 *
 * Cost: ~$0.35 per 5s render at Kling 2.5 Turbo Pro pricing. This tool will
 * NOT auto-fire; it only runs when invoked explicitly from the CLI.
 *
 * Usage:
 *   node falVideoTool.js generate \
 *     --image public/assets/impact-city/hero/hero-main.png \
 *     --model kling-master-i2v \
 *     --duration 5 \
 *     --aspect 16:9 \
 *     --output public/assets/impact-city/hero/hero.mp4
 *
 *   node falVideoTool.js status --request-id <id>
 *   node falVideoTool.js cancel --request-id <id>
 *
 * Requires FAL_AI_API in .env or process.env.
 * See docs/prompts/fal-hero-video.md for the full brief.
 */
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const FAL_QUEUE_BASE = "https://queue.fal.run";

/** Map a friendly model name to a Fal model_id. */
const MODELS = {
  // Kling family — image-to-video, best character consistency
  "kling-master-i2v": "fal-ai/kling-video/v1-5/master/image-to-video",
  "kling-25-turbo-pro": "fal-ai/kling-video/kling-2.5-turbo-pro/image-to-video",
  "kling-25-turbo-standard": "fal-ai/kling-video/kling-2.5-turbo-standard/image-to-video",
  // Text-to-video fallbacks (worse consistency, no input image needed)
  "kling-master-t2v": "fal-ai/kling-video/v1-5/master/text-to-video",
  "wan-25-t2v": "fal-ai/wan/v2.5-a/text-to-video",
};

/** The default motion prompt from docs/prompts/fal-hero-video.md. */
const DEFAULT_MOTION_PROMPT = `Slow cinematic push-in. Thomas steps forward through the fractured doorway,
his patched courier hoodie shifting gently. Cosmos the parrot flies ahead,
trailing emerald light particles that drift and fade. Vines on the cracked
concrete walls sway softly. Emerald light pulses subtly from the broken
machines in the walls. The distant machine watchtower's blue beam sweeps
once across the skyline. The Emerald Tablet shard in Thomas's hand glows
brighter, then settles. Moody, suspenseful, hopeful. Handcrafted stop-motion
texture throughout — slight frame-stutter, clay-and-fabric feel. No camera
shake. No fast motion. No new characters entering frame.`;

const DEFAULT_NEGATIVE = "fast motion, camera shake, new characters, weapons, gore, text, watermark, photoreal, glossy, plastic, blur, morphing faces";

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
  }
  if (!process.env.FAL_AI_API) {
    console.error("FAL_AI_API not set. Add it to .env (UUID:secret format from Fal dashboard).");
    process.exit(1);
  }
}

function authHeader() {
  return { Authorization: `Key ${process.env.FAL_AI_API}` };
}

/** Submit a generation job. Returns { request_id, status_url, ... }. */
async function submit({ image, model = "kling-master-i2v", duration = 5, aspect = "16:9", prompt = DEFAULT_MOTION_PROMPT, negative = DEFAULT_NEGATIVE }) {
  const modelId = MODELS[model];
  if (!modelId) throw new Error(`Unknown model: ${model}. Valid: ${Object.keys(MODELS).join(", ")}`);
  if (!fs.existsSync(image)) throw new Error(`Input image not found: ${image}`);

  // Fal accepts image as data URI (base64). For local files, encode.
  const buf = fs.readFileSync(image);
  const ext = path.extname(image).slice(1).toLowerCase();
  const mime = ext === "jpg" ? "jpeg" : ext;
  const dataUri = `data:image/${mime};base64,${buf.toString("base64")}`;

  const body = {
    image_url: dataUri,
    prompt,
    duration: String(duration),
    aspect_ratio: aspect,
    negative_prompt: negative,
  };

  console.log(`Submitting to ${modelId}...`);
  const res = await fetch(`${FAL_QUEUE_BASE}/${modelId}`, {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Submit failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  console.log(`Submitted. request_id=${json.request_id}`);
  console.log(`Status: GET ${FAL_QUEUE_BASE}/${modelId}/requests/${json.request_id}/status`);
  return { ...json, model_id: modelId };
}

/** Poll until COMPLETED or ERROR. Returns the final result payload. */
async function poll(modelId, requestId, { timeoutMs = 600000, intervalMs = 5000 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const res = await fetch(`${FAL_QUEUE_BASE}/${modelId}/requests/${requestId}/status`, {
      headers: authHeader(),
    });
    const status = await res.json();
    process.stdout.write(`\r[${new Date().toISOString()}] ${status.status}...`);
    if (status.status === "COMPLETED") {
      process.stdout.write("\n");
      const r = await fetch(`${FAL_QUEUE_BASE}/${modelId}/requests/${requestId}`, { headers: authHeader() });
      return await r.json();
    }
    if (status.status === "ERROR" || status.status === "FAILED") {
      process.stdout.write("\n");
      throw new Error(`Generation failed: ${JSON.stringify(status)}`);
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error("Polling timed out");
}

/** Download a URL to a local path. */
async function download(url, outPath) {
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`Download failed: ${res.status}`);
  await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
  await pipeline(Readable.fromWeb(res.body), fs.createWriteStream(outPath));
  const stat = await fs.promises.stat(outPath);
  console.log(`Downloaded ${(stat.size / 1024 / 1024).toFixed(2)}MB -> ${outPath}`);
}

/** Run the full generate-and-download flow. */
async function generate(args) {
  const submitted = await submit(args);
  console.log("Polling (this takes ~2-5 minutes for Kling)...");
  const result = await poll(submitted.model_id, submitted.request_id);
  const videoUrl = result?.data?.video?.url;
  if (!videoUrl) throw new Error(`No video URL in result: ${JSON.stringify(result).slice(0, 500)}`);
  await download(videoUrl, args.output);
  // Save the response alongside for the manifest.
  const metaPath = args.output.replace(/\.mp4$/, ".json");
  await fs.promises.writeFile(metaPath, JSON.stringify({ ...result, model: args.model, generatedAt: new Date().toISOString() }, null, 2));
  console.log(`\n✓ Hero video ready at ${args.output}`);
  console.log(`  Metadata: ${metaPath}`);
  console.log(`  Drop into the repo and push — the hero auto-detects it.`);
}

async function statusCmd({ requestId, model = "kling-master-i2v" }) {
  const modelId = MODELS[model];
  const res = await fetch(`${FAL_QUEUE_BASE}/${modelId}/requests/${requestId}/status`, { headers: authHeader() });
  console.log(JSON.stringify(await res.json(), null, 2));
}

async function cancelCmd({ requestId, model = "kling-master-i2v" }) {
  const modelId = MODELS[model];
  const res = await fetch(`${FAL_QUEUE_BASE}/${modelId}/requests/${requestId}/cancel`, {
    method: "PUT",
    headers: authHeader(),
  });
  console.log(JSON.stringify(await res.json(), null, 2));
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      out[key] = argv[i + 1];
      i++;
    } else {
      out._command = a;
    }
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
const cmd = args._command;
loadEnv();

switch (cmd) {
  case "generate":
    await generate({
      image: args.image,
      model: args.model || "kling-master-i2v",
      duration: Number(args.duration || 5),
      aspect: args.aspect || "16:9",
      output: args.output || "public/assets/impact-city/hero/hero.mp4",
    });
    break;
  case "status":
    await statusCmd({ requestId: args.requestId, model: args.model });
    break;
  case "cancel":
    await cancelCmd({ requestId: args.requestId, model: args.model });
    break;
  default:
    console.log(`Usage:
  node falVideoTool.js generate --image <path> [--model kling-master-i2v] [--duration 5] [--aspect 16:9] [--output public/assets/impact-city/hero/hero.mp4]
  node falVideoTool.js status --request-id <id> [--model kling-master-i2v]
  node falVideoTool.js cancel --request-id <id> [--model kling-master-i2v]

Models: ${Object.keys(MODELS).join(", ")}
Default motion prompt + negative prompt are built in; see docs/prompts/fal-hero-video.md.`);
}

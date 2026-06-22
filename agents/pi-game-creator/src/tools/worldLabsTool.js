/**
 * worldLabsTool — World Labs Marble world generation.
 *
 * Verified contract: POST https://api.worldlabs.ai/marble/v1/worlds:generate
 * with header WLT-Api-Key, body { world_prompt: { type: "text", text_prompt }, model, display_name, tags }.
 * Returns a long-running operation; poll /operations/{id} until done=true.
 *
 * A real Rustgarden world was generated and saved to
 * public/assets/worldlabs/worldlabs-manifest.json.
 */
import fs from "node:fs";
import path from "node:path";

const API_BASE = "https://api.worldlabs.ai/marble/v1";

/** District prompt library. */
const DISTRICT_PROMPTS = {
  rustgarden:
    "Ruined 2056 city district called Rustgarden. Emerald green light leaks from broken machines. Vines and moss reclaim cracked concrete. A distant machine watchtower watches over abandoned elevated roads. Rainwater collectors and handmade resistance banners. Hopeful community rebuild zone. Handcrafted Gothic magical realism, stop-motion texture, dark but hopeful.",
  "compliance-gate":
    "Nonviolent dystopian AI city gate checkpoint. Civic scoring terminal. Handmade resistance signs. Emerald tablet glow. Cold machine architecture with returning nature.",
  "tablet-chamber":
    "Ancient future algorithm room. Obsidian stone. Green light glyphs. Surreal suspended fragments. Memory rift chamber.",
  "solar-commons":
    "Post-collapse city plaza rebuild zone. Solar benches, water filters, community gardens, learning kiosk, banners. Hopeful regenerative tech.",
};

/**
 * Fire a world generation job. Returns the operation_id.
 * Does NOT block on completion — caller polls separately.
 */
export async function generateWorld(cfg, district) {
  const prompt = DISTRICT_PROMPTS[district];
  if (!prompt) throw new Error(`Unknown district: ${district}`);
  if (!cfg.worldLabsKey) throw new Error("WORLDLABS_API_KEY not set");

  const body = {
    world_prompt: { type: "text", text_prompt: prompt, disable_recaption: true },
    display_name: `${district} - Impact City`,
    model: "marble-1.1",
    tags: ["impact-city", district],
  };

  const res = await fetch(`${API_BASE}/worlds:generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "WLT-Api-Key": cfg.worldLabsKey },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`World Labs generate failed: ${res.status} ${await res.text()}`);
  const op = await res.json();
  console.log(`World Labs job fired: operation_id=${op.operation_id} (~5 min)`);
  console.log(`Poll: GET ${API_BASE}/operations/${op.operation_id}`);
  return op;
}

/** Poll an operation until done or timeout. */
export async function pollOperation(cfg, operationId, { timeoutMs = 600000, intervalMs = 20000 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const res = await fetch(`${API_BASE}/operations/${operationId}`, {
      headers: { "WLT-Api-Key": cfg.worldLabsKey },
    });
    const op = await res.json();
    if (op.done) return op;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(`Operation ${operationId} timed out`);
}

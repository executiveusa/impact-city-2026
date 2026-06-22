/**
 * Pi Game Creator — config + env resolution.
 *
 * Reads secrets ONLY from process.env / vault. Never hardcodes keys.
 * All paths are repo-relative so the harness works from any cwd.
 */
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Repo root = 3 levels up from src/config.js (src -> pi-game-creator -> repo)
export const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");

export const config = {
  repoRoot: REPO_ROOT,
  blenderPath: process.env.BLENDER_PATH || "blender",
  firecrawlKey: process.env.FIRECRAWL_API_TOKEN || "",
  brightDataKey: process.env.BRIGHT_DATA_API || "",
  worldLabsKey: process.env.WORLDLABS_API_KEY || "",
  hfToken: process.env.HUGGINGFACE_TOKEN || "",
  googleKey: process.env.GOOGLE_API_KEY || "",
  piModelProvider: process.env.PI_MODEL_PROVIDER || "",
  piModelName: process.env.PI_MODEL_NAME || "",
  scriptsDir: path.join(REPO_ROOT, "scripts"),
  assetRoot: path.join(REPO_ROOT, "public", "assets", "3d", "impact-city"),
  manifestDir: path.join(REPO_ROOT, "public", "assets", "3d", "impact-city", "manifests"),
};

/** Warn (not throw) if a required env var is missing. */
export function needEnv(name, label) {
  if (!process.env[name]) {
    console.warn(`[pi-game-creator] WARNING: ${name} not set (${label}). Set it in .env or vault.`);
    return false;
  }
  return true;
}

/**
 * blenderTool — drives the verified Blender pipeline.
 *
 * Delegates to scripts/blender/*.py via `blender --background --python`.
 * Those scripts are verified working on Blender 5.1.1 (see
 * .claude/skills/blender-game-world-builder/SKILL.md).
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
const execFileAsync = promisify(execFile);

/**
 * Run a Blender script headless.
 * @param {import('../config.js').config} cfg
 * @param {string} scriptName — filename under repo scripts/blender/
 */
export async function execBlenderScript(cfg, scriptName) {
  const scriptPath = path.join(cfg.scriptsDir, "blender", scriptName);
  const { stdout } = await execFileAsync(cfg.blenderPath, [
    "--background",
    "--python",
    scriptPath,
  ]);
  return stdout;
}

/** Generate the full prop asset pack. */
export async function buildAssetPack(cfg) {
  return execBlenderScript(cfg, "create_impact_city_asset_pack.py");
}

/** Generate Thomas + Cosmos turntables. */
export async function buildCharacters(cfg) {
  return execBlenderScript(cfg, "create_thomas_cosmos_turntables.py");
}

/** Generate the Rustgarden scene blockout. */
export async function buildRustgardenScene(cfg) {
  return execBlenderScript(cfg, "create_rustgarden_scene.py");
}

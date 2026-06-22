/**
 * assetManifestTool — summarize all asset manifests.
 * Pure read; no side effects.
 */
import fs from "node:fs";
import path from "node:path";

export function writeManifestSummary(cfg) {
  if (!fs.existsSync(cfg.manifestDir)) return "No manifests found.";
  const files = fs.readdirSync(cfg.manifestDir).filter((f) => f.endsWith(".json"));
  const lines = [`=== Impact City Asset Manifest Summary ===`, `Manifests: ${files.length}`];
  let total = 0;
  for (const f of files) {
    const data = JSON.parse(fs.readFileSync(path.join(cfg.manifestDir, f), "utf8"));
    for (const a of data.assets || []) {
      total++;
      lines.push(`  ${a.name.padEnd(28)} ${a.format}  ${a.size_bytes}b  [${a.replacement_status}]`);
    }
  }
  lines.push(`Total assets: ${total}`);
  return lines.join("\n");
}

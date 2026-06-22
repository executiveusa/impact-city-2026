#!/usr/bin/env node
/**
 * Pi Game Creator — CLI dispatcher.
 *
 * Maps high-level game-creation verbs to documented tools. Each tool lives in
 * src/tools/<name>.js and is a documented contract (some call the verified
 * scripts under repo-root scripts/, some are stubs awaiting runtime wiring).
 *
 * Usage:
 *   pi-game create-character thomas
 *   pi-game create-character cosmos
 *   pi-game create-world rustgarden
 *   pi-game build-hero
 *   pi-game research-stefan
 *   pi-game asset-manifest
 */
import { config, needEnv } from "./config.js";
import { execBlenderScript } from "./tools/blenderTool.js";
import { generateWorld } from "./tools/worldLabsTool.js";
import { researchChannel } from "./tools/firecrawlTool.js";
import { writeManifestSummary } from "./tools/assetManifestTool.js";
import { buildHeroCopy } from "./tools/heroBuilder.js";
import fs from "node:fs";
import path from "node:path";

const [cmd, ...args] = process.argv.slice(2);

const HELP = `Pi Game Creator — Impact City production agent

Commands:
  create-character <thomas|cosmos>   Generate/regenerate a character GLB via Blender
  create-world <district>            Generate a World Labs reference world
  build-hero                         Emit hero copy + section plan
  research-stefan                    Scrape Stefan 3D-AI channel (patterns only)
  asset-manifest                     Summarize all asset manifests
  help                               Show this help

Behavior: never hardcode secrets; never claim unvalidated assets are production-ready.
`;

async function main() {
  switch (cmd) {
    case "create-character": {
      const who = args[0];
      if (!["thomas", "cosmos"].includes(who)) {
        console.error("Usage: create-character <thomas|cosmos>");
        process.exit(1);
      }
      needEnv("BLENDER_PATH", "Blender binary path");
      await execBlenderScript(config, "create_thomas_cosmos_turntables.py");
      console.log(`Character ${who} regenerated. See public/assets/3d/impact-city/characters/${who}/`);
      break;
    }
    case "create-world": {
      const district = args[0] || "rustgarden";
      needEnv("WORLDLABS_API_KEY", "World Labs Marble API key");
      await generateWorld(config, district);
      break;
    }
    case "build-hero": {
      const copy = buildHeroCopy();
      console.log(copy);
      break;
    }
    case "research-stefan": {
      needEnv("FIRECRAWL_API_TOKEN", "Firecrawl API key");
      await researchChannel(config, "https://www.youtube.com/@stefan_3d_ai/videos");
      break;
    }
    case "asset-manifest": {
      const summary = writeManifestSummary(config);
      console.log(summary);
      break;
    }
    case "help":
    case undefined:
      console.log(HELP);
      break;
    default:
      console.error(`Unknown command: ${cmd}\n\n${HELP}`);
      process.exit(1);
  }
}

main().catch((e) => {
  console.error("[pi-game-creator] FAILED:", e.message);
  process.exit(1);
});

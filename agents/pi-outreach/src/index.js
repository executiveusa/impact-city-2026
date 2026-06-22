#!/usr/bin/env node
/**
 * Pi Outreach Agent — CLI. Seattle-focused, AI-risk-aware.
 * Lazy: loads knowledge, does work, writes to disk, exits. No background process.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadLeads, saveLeads, loadPipeline, savePipeline, addContact } from "./store.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KNOWLEDGE = path.join(__dirname, "..", "knowledge");

const [cmd, ...args] = process.argv.slice(2);

const HELP = `Pi Outreach Agent — Impact City Seattle

Commands:
  find-leads          Show the Seattle/PNW lead map (from seattle-ecosystem.md)
  draft <org>         Draft a personalized email for a target org (e.g. "AI2")
  status              Show outreach pipeline status
  gaps                Identify relationship gaps
  playbook            Show the outreach playbook
  log <org> <status>  Log a contact result (e.g. log AI2 replied-positive)
  help                Show this help
`;

// --- seed leads from the ecosystem doc (first run) ---
function ensureLeads() {
  let leads = loadLeads();
  if (leads.length > 0) return leads;
  // Seed tier-1 leads only on first run. Operator adds more manually.
  leads = [
    { id: "ai2", name: "Allen Institute for AI (AI2)", tier: 1, org: "AI2", ask: "Co-publish codex review / advisory", path: "Find specific researcher via their publications page", seattle: true },
    { id: "msft-aigood", name: "Microsoft AI for Good Lab", tier: 1, org: "MSFT", ask: "AI for Good grant + Azure credits", path: "Open grant cycle application", seattle: true },
    { id: "seattle-foundation", name: "Seattle Foundation", tier: 2, org: "SEA", ask: "General operating support grant", path: "Grant cycle application", seattle: true },
    { id: "wa-digital-equity", name: "WA State Digital Equity", tier: 2, org: "WA", ask: "Digital equity grant / school pilot", path: "Open RFP cycle", seattle: true },
    { id: "g4c", name: "Games for Change", tier: 4, org: "G4C", ask: "Festival submission / speaker / network intro", path: "Submit to G4C awards", seattle: false },
    { id: "common-sense", name: "Common Sense Media", tier: 4, org: "CSM", ask: "Review / listing / curriculum partnership", path: "Education review team", seattle: false },
    { id: "open-phil", name: "Open Philanthropy (AI-safety portfolio)", tier: 4, org: "OP", ask: "AI-safety education grant", path: "Open application", seattle: false },
    { id: "cais", name: "Center for AI Safety", tier: 4, org: "CAIS", ask: "Endorsement / co-publish / educator network", path: "Reference their work in codex; show the game", seattle: false },
  ];
  saveLeads(leads);
  return leads;
}

// --- email drafter: returns a personalized skeleton per org ---
function draftEmail(orgKey) {
  const leads = ensureLeads();
  const lead = leads.find((l) => l.org.toLowerCase() === orgKey.toLowerCase() || l.id === orgKey.toLowerCase());
  if (!lead) return `Unknown org: ${orgKey}. Available: ${leads.map((l) => l.id).join(", ")}`;

  const templates = {
    ai2: `Subject: Impact City — an AI-safety education game built in Seattle

Hi [researcher first name],

I read your work on [specific paper/topic] and it stuck with me. I'm building something that might interest you.

Impact City: The Emerald Algorithm is a nonviolent, story-driven browser game where kids learn real AI-safety concepts — algorithmic bias, prompt injection, excessive agency, the control problem — by playing. Built by a Seattle 501(c)(3).

Play it here: https://impact-city-2026.vercel.app

The codex (in-game) cites the actual field — Bostrom, Russell, Christian, Yampolskiy, your own work on [topic]. It's not "AI is scary" — it's the real curriculum, at kid-reading level.

Would you take 15 minutes to look at it? I'd value your read on whether the safety concepts land accurately.

— [your name]
[org], Seattle 501(c)(3)`,

    msft: `Subject: AI for Good grant inquiry — Impact City (Seattle 501(c)(3))

Hi [program manager or grants team],

I'm writing to apply for an AI for Good grant. Impact City: The Emerald Algorithm is a nonviolent browser game that teaches real AI-safety concepts to kids, with a transparent impact loop that routes play into verified real-world causes (food, water, energy, education).

Live demo: https://impact-city-2026.vercel.app

We're a Seattle 501(c)(3). The game is built and deployed. The curriculum is grounded in NIST AI RMF and OWASP LLM Top 10. Impact is currently simulated (labeled honestly); production routes through verified nonprofit partners.

What we'd ask for: grant support to build the verified impact ledger + Azure credits for scaling to school pilots.

Full application attached.

— [your name]
[org], Seattle 501(c)(3)`,

    default: `Subject: Impact City — a Seattle 501(c)(3) building AI-safety education through play

Hi [first name],

I'm reaching out because ${lead.name} seems aligned with something we're building.

Impact City: The Emerald Algorithm is a nonviolent browser game where kids learn real AI-safety concepts by playing. Built by a Seattle 501(c)(3).

Play it: https://impact-city-2026.vercel.app

What we're looking for from ${lead.name}: ${lead.ask}.

The link is the pitch — everything else is support. Happy to walk through it in 15 minutes if useful.

— [your name]
[org], Seattle 501(c)(3)`,
  };

  return templates[lead.org.toLowerCase()] || templates.default;
}

// --- gap analysis ---
function findGaps() {
  const leads = ensureLeads();
  const pipeline = loadPipeline();
  const contacted = new Set(pipeline.contacts.map((c) => c.org?.toLowerCase()));
  const gaps = [];
  for (const tier of [1, 2, 3, 4, 5]) {
    const tierLeads = leads.filter((l) => l.tier === tier);
    const uncontacted = tierLeads.filter((l) => !contacted.has(l.org.toLowerCase()));
    if (uncontacted.length > 0) {
      gaps.push(`Tier ${tier}: ${uncontacted.length} lead(s) with zero contact — ${uncontacted.map((l) => l.id).join(", ")}`);
    }
  }
  // Stale follow-ups
  const stale = pipeline.contacts.filter((c) => {
    if (c.status === "replied-positive" || c.status === "replied-negative") return false;
    const daysSince = (Date.now() - new Date(c.date).getTime()) / 86400000;
    return daysSince > 14;
  });
  if (stale.length > 0) gaps.push(`Stale follow-ups (>14 days, no resolution): ${stale.length}`);
  return gaps.length > 0 ? gaps : ["No major gaps — all tiers have at least one contact in motion."];
}

// --- main ---
function main() {
  switch (cmd) {
    case "find-leads": {
      const leads = ensureLeads();
      console.log("=== Seattle/PNW Lead Map ===\n");
      for (const tier of [1, 2, 3, 4, 5]) {
        const t = leads.filter((l) => l.tier === tier);
        if (t.length === 0) continue;
        console.log(`\nTier ${tier}:`);
        for (const l of t) {
          console.log(`  [${l.id}] ${l.name} — Ask: ${l.ask}`);
          console.log(`      Path: ${l.path}`);
        }
      }
      console.log("\nFull ecosystem map: knowledge/seattle-ecosystem.md");
      break;
    }
    case "draft": {
      const org = args[0];
      if (!org) { console.error("Usage: draft <org-id> (e.g. ai2, msft, seattle-foundation)"); process.exit(1); }
      console.log(draftEmail(org));
      break;
    }
    case "status": {
      const pipeline = loadPipeline();
      console.log(`=== Outreach Pipeline ===`);
      console.log(`Total contacts logged: ${pipeline.contacts.length}`);
      console.log(`Last updated: ${pipeline.lastUpdated || "never"}\n`);
      if (pipeline.contacts.length === 0) { console.log("No contacts logged yet. Run 'find-leads' then 'draft <org>'."); break; }
      for (const c of pipeline.contacts) {
        console.log(`  ${c.date?.slice(0,10)} [${c.org}] ${c.status || "sent"} — ${c.note || ""}`);
      }
      break;
    }
    case "gaps": {
      console.log("=== Relationship Gaps ===\n");
      for (const g of findGaps()) console.log(`  ${g}`);
      break;
    }
    case "playbook": {
      const pb = fs.readFileSync(path.join(KNOWLEDGE, "outreach-playbook.md"), "utf8");
      console.log(pb);
      break;
    }
    case "log": {
      const [org, status, ...noteParts] = args;
      if (!org || !status) { console.error("Usage: log <org> <status> [note]"); process.exit(1); }
      let p = loadPipeline();
      p = addContact(p, { org, status, note: noteParts.join(" ") });
      savePipeline(p);
      console.log(`Logged: [${org}] ${status}`);
      break;
    }
    case "help":
    case undefined:
      console.log(HELP); break;
    default:
      console.error(`Unknown command: ${cmd}\n\n${HELP}`); process.exit(1);
  }
}

main();

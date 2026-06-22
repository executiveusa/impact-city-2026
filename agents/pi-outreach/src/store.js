/**
 * Pi Outreach Agent — store layer.
 *
 * Reads/writes leads.json + pipeline.json (gitignored — contain contact info).
 * Lazy: only touched when a command runs. No background process.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const KNOWLEDGE_DIR = path.join(__dirname, "..", "knowledge");

const LEADS_PATH = path.join(KNOWLEDGE_DIR, "leads.json");
const PIPELINE_PATH = path.join(KNOWLEDGE_DIR, "pipeline.json");

export function loadLeads() {
  try {
    return JSON.parse(fs.readFileSync(LEADS_PATH, "utf8"));
  } catch {
    return [];
  }
}

export function saveLeads(leads) {
  fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
  fs.writeFileSync(LEADS_PATH, JSON.stringify(leads, null, 2));
}

export function loadPipeline() {
  try {
    return JSON.parse(fs.readFileSync(PIPELINE_PATH, "utf8"));
  } catch {
    return { contacts: [], lastUpdated: null };
  }
}

export function savePipeline(pipeline) {
  pipeline.lastUpdated = new Date().toISOString();
  fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
  fs.writeFileSync(PIPELINE_PATH, JSON.stringify(pipeline, null, 2));
}

export function addContact(pipeline, entry) {
  pipeline.contacts.push({
    id: `c_${Date.now()}`,
    date: new Date().toISOString(),
    ...entry,
  });
  return pipeline;
}

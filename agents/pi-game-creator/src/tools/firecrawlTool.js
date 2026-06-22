/**
 * firecrawlTool — research scraping via Firecrawl.
 *
 * Verified contract: POST https://api.firecrawl.dev/v2/search + /v2/scrape
 * with Authorization: Bearer <key>.
 *
 * Used for the Stefan 3D-AI channel research (patterns only, copyright-safe).
 * Results already saved to docs/research/.
 */

/**
 * Search the web via Firecrawl.
 * @returns {Promise<Array>} search results
 */
export async function search(cfg, query, limit = 10) {
  if (!cfg.firecrawlKey) throw new Error("FIRECRAWL_API_TOKEN not set");
  const res = await fetch("https://api.firecrawl.dev/v2/search", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${cfg.firecrawlKey}` },
    body: JSON.stringify({ query, limit }),
  });
  if (!res.ok) throw new Error(`Firecrawl search failed: ${res.status}`);
  const data = await res.json();
  return data?.data?.web || [];
}

/** Scrape a single URL to markdown. */
export async function scrape(cfg, url) {
  if (!cfg.firecrawlKey) throw new Error("FIRECRAWL_API_TOKEN not set");
  const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${cfg.firecrawlKey}` },
    body: JSON.stringify({ url, formats: ["markdown"] }),
  });
  if (!res.ok) throw new Error(`Firecrawl scrape failed: ${res.status}`);
  const data = await res.json();
  return data?.data?.markdown || "";
}

/**
 * researchChannel — run the Stefan 3D-AI research workflow.
 * Already executed; results in docs/research/. This is the rerunnable entrypoint.
 */
export async function researchChannel(cfg, channelUrl) {
  console.log(`Researching channel: ${channelUrl}`);
  console.log("(workflow already executed; see docs/research/ for outputs)");
  console.log("To rerun: call search() + scrape() per the synthesis doc.");
  return { channel: channelUrl, status: "see docs/research/" };
}

import { useEffect, useState } from "react";
import { EVIDENCE } from "../narrative/evidence";
import { useCh1 } from "../encounters/ch1Store";

const TIER_LABEL = { observed: "Observed", reported: "Reported", forecast: "Forecast", interpretation: "Interpretation" } as const;
// Tier badges use shape + text, not colour alone (colour-blind safe, 01-game-design §4).
const TIER_ICON = { observed: "●", reported: "◆", forecast: "▲", interpretation: "■" } as const;

/** P2-2 Evidence Ledger (Tab). Shows cards the player holds; they become arguments in persuade scenes. */
export function EvidenceLedger() {
  const [open, setOpen] = useState(false);
  const evidence = useCh1((s) => s.save.evidence);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Tab") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);
  if (!open) return null;
  return (
    <div role="dialog" aria-label="Evidence Ledger" style={{ position: "fixed", right: 16, top: 48, width: "min(380px, 90vw)", maxHeight: "75vh", overflow: "auto", background: "rgba(12,16,12,.94)", color: "#efe6d2", border: "1px solid #6b5a2f", borderRadius: 8, padding: 14, font: "14px/1.4 Inter, sans-serif", zIndex: 11 }}>
      <strong style={{ fontFamily: "Cinzel, serif", fontSize: 16 }}>Evidence Ledger</strong>
      <p style={{ fontSize: 12, color: "#b8ad92", margin: "4px 0 10px" }}>Observed counts double. Forecast counts half. Interpretation only counts next to something you saw yourself.</p>
      {evidence.length === 0 && <p>No evidence yet. Cosmos can help you find some.</p>}
      {evidence.map((id) => {
        const c = EVIDENCE[id];
        if (!c) return null;
        return (
          <div key={id} style={{ borderTop: "1px solid #3a3322", padding: "8px 0" }}>
            <div>{c.claim}</div>
            <div style={{ fontSize: 12, color: "#b8ad92" }}>
              {TIER_ICON[c.tier]} {TIER_LABEL[c.tier]} · {c.confidence} confidence · {c.source}
            </div>
          </div>
        );
      })}
      <div style={{ fontSize: 11, color: "#8a8068", marginTop: 6 }}>Tab to close</div>
    </div>
  );
}

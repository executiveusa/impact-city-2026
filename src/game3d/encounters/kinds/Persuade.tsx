import { useState } from "react";
import type { BranchFlagSet } from "@/game/types";
import { EVIDENCE } from "../../narrative/evidence";
import { resolveWick, type WickOutcome } from "../../narrative/branches";

/**
 * P2-1 persuade renderer: Evidence Cards are the arguments (02-narrative §7).
 * Pick up to 3 cards, then make the case. Every outcome continues the story (no fail state).
 */
export function Persuade({ who, prompt, held, flags, onResolved }: { who: string; prompt: string; held: string[]; flags: BranchFlagSet; onResolved: (o: WickOutcome, played: string[]) => void }) {
  const [chosen, setChosen] = useState<string[]>([]);
  const toggle = (id: string) => setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length < 3 ? [...c, id] : c));
  return (
    <div>
      <p style={{ marginTop: 0 }}><strong>{who}:</strong> {prompt}</p>
      <p style={{ fontSize: 13 }}>Choose up to 3 pieces of evidence to show.</p>
      {held.length === 0 && <p>You have nothing to show. You can still talk.</p>}
      {held.map((id) => EVIDENCE[id] && (
        <label key={id} style={{ display: "block", margin: "4px 0" }}>
          <input type="checkbox" checked={chosen.includes(id)} onChange={() => toggle(id)} /> {EVIDENCE[id].claim} <em>({EVIDENCE[id].tier})</em>
        </label>
      ))}
      <button onClick={() => onResolved(resolveWick(chosen.map((i) => EVIDENCE[i]), flags), chosen)}>Make your case</button>
    </div>
  );
}

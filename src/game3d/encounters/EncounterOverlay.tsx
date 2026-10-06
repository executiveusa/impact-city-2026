import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import type { Objective } from "@/game/types";
import { CH1, M1, useCh1 } from "./ch1Store";
import { BARKS, pick } from "../cosmos/barks";
import { EVIDENCE } from "../narrative/evidence";

const panel: CSSProperties = {
  position: "fixed", left: "50%", bottom: 24, transform: "translateX(-50%)", width: "min(720px, 92vw)",
  background: "rgba(10,18,14,.92)", color: "#e8f3ec", border: "1px solid #2f6b50", borderRadius: 8,
  padding: "16px 18px", font: "15px/1.45 Inter, sans-serif", zIndex: 10,
};
const btn: CSSProperties = { font: "14px Inter, sans-serif", background: "#1c3a2c", color: "#e8f3ec", border: "1px solid #3dffa0", borderRadius: 5, padding: "7px 12px", cursor: "pointer", margin: "6px 6px 0 0" };

function Frame({ children, onClose }: { children: ReactNode; onClose?: () => void }) {
  return (
    <div style={panel} role="dialog" aria-modal="true">
      {children}
      {onClose && <button style={{ ...btn, borderColor: "#555" }} onClick={onClose}>Step back (Esc)</button>}
    </div>
  );
}

/** INSPECT: read every record; the contradiction is spotted only after all three are read. */
function Inspect({ o, done }: { o: Objective; done: () => void }) {
  const [read, setRead] = useState<Set<number>>(new Set());
  const [resolved, setResolved] = useState(false);
  const all = read.size === (o.fragments?.length ?? 0);
  return (
    <>
      <p style={{ marginTop: 0 }}>{o.prompt}</p>
      {o.fragments?.map((f, i) => (
        <button key={i} style={{ ...btn, display: "block", textAlign: "left", width: "100%", opacity: read.has(i) ? 1 : 0.75 }} onClick={() => setRead(new Set(read).add(i))}>
          {read.has(i) ? f : `Record ${String.fromCharCode(65 + i)} (select to read)`}
        </button>
      ))}
      {!resolved ? (
        <button style={{ ...btn, opacity: all ? 1 : 0.4 }} disabled={!all} onClick={() => setResolved(true)}>I see the contradiction</button>
      ) : (
        <>
          <p><em>{o.completeLine}</em></p>
          <button style={btn} onClick={done}>Continue</button>
        </>
      )}
    </>
  );
}

/** REPAIR: reconnect the three appeal-board cables in order. No timer; a wrong plug just resets. */
function Repair({ o, done }: { o: Objective; done: () => void }) {
  const steps = ["Denial log", "Human review queue", "48-hour appeal clock"];
  const [order] = useState(() => [2, 0, 1]);
  const [n, setN] = useState(0);
  const [msg, setMsg] = useState("Plug the cables in the order a denial should travel.");
  const fixed = n === steps.length;
  return (
    <>
      <p style={{ marginTop: 0 }}>{o.prompt}</p>
      <p style={{ color: "#9fc9b3" }}>{fixed ? <em>{o.completeLine}</em> : msg}</p>
      {!fixed && order.map((i) => (
        <button key={i} style={{ ...btn, opacity: i < n ? 0.4 : 1 }} disabled={i < n} onClick={() => {
          if (i === n) { setN(n + 1); setMsg(`Connected: ${steps.slice(0, n + 1).join(" -> ")}`); }
          else { setN(0); setMsg("Sparks. The board resets. A denial has to be logged before anyone can review it."); }
        }}>{steps[i]}</button>
      ))}
      {fixed && <button style={btn} onClick={done}>Continue</button>}
    </>
  );
}

/** CHOOSE: diegetic rule choice; wrong picks show the rationale and let you try again. */
function Choose({ o, done }: { o: Objective; done: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const say = useCh1((s) => s.say);
  const opt = o.options?.find((x) => x.id === picked);
  const right = picked === o.correctOptionId;
  return (
    <>
      <p style={{ marginTop: 0 }}>{o.prompt}</p>
      {!right && o.options?.map((x) => (
        <button key={x.id} style={{ ...btn, display: "block", textAlign: "left", width: "100%" }} onClick={() => {
          setPicked(x.id);
          if (x.id !== o.correctOptionId) say("Cosmos", pick(BARKS.wrongChoice));
        }}>{x.label}</button>
      ))}
      {opt && <p style={{ color: right ? "#3dffa0" : "#ffb35c" }}>{opt.rationale}</p>}
      {right && (<><p><em>{o.completeLine}</em></p><button style={btn} onClick={done}>Continue</button></>)}
    </>
  );
}

export function EncounterOverlay() {
  const { overlayOpen, close, completeEncounter, sting, dismissSting, subtitle, save } = useCh1();
  const cur = useCh1((s) => s.currentEncounterId());
  const [, force] = useState(0);
  useEffect(() => {
    const t = setInterval(() => force((x) => x + 1), 500);
    return () => clearInterval(t);
  }, []);
  const o = M1.objectives.find((x) => x.id === cur);
  const showSub = save.subtitles && subtitle && subtitle.until > performance.now();
  return (
    <>
      {overlayOpen && o && (
        <Frame onClose={close}>
          {o.kind === "inspect" && <Inspect o={o} done={completeEncounter} />}
          {o.kind === "repair" && <Repair o={o} done={completeEncounter} />}
          {o.kind === "choose" && <Choose o={o} done={completeEncounter} />}
        </Frame>
      )}
      {sting && (
        <Frame>
          <p style={{ marginTop: 0 }}>{M1.successLine}</p>
          <p style={{ color: "#ffb35c" }}>The gate log scrolls past. One line stops you: <strong>Record: Ife, N. Status set to DECEASED. Edited 4 minutes ago.</strong></p>
          <p><em>Cosmos, quietly: "{BARKS.chapterSting}"</em></p>
          <p style={{ fontSize: 13, color: "#9fc9b3" }}>Evidence gained: {EVIDENCE["E-RECORD-EDIT"].claim} ({EVIDENCE["E-RECORD-EDIT"].tier}, {EVIDENCE["E-RECORD-EDIT"].confidence} confidence)</p>
          <p style={{ fontSize: 12, color: "#7fa894" }}>Impact recorded as simulated. No real money moves in this demo.</p>
          <button style={btn} onClick={dismissSting}>Continue</button>
        </Frame>
      )}
      {!overlayOpen && !sting && showSub && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", color: "#fff", background: "rgba(0,0,0,.6)", padding: "6px 12px", borderRadius: 4, font: "16px Inter, sans-serif", maxWidth: "80vw", textAlign: "center" }}>
          <strong style={{ color: "#3dffa0" }}>{subtitle!.speaker}:</strong> {subtitle!.text}
        </div>
      )}
      {!overlayOpen && !sting && cur && (
        <div style={{ position: "fixed", top: 8, left: "50%", transform: "translateX(-50%)", color: "#cfe8d8", font: "13px Inter, sans-serif", background: "rgba(0,0,0,.45)", padding: "4px 10px", borderRadius: 4 }}>
          {CH1.title} · {CH1.encounters.indexOf(cur) + 1}/{CH1.encounters.length} · F ping · E interact
        </div>
      )}
    </>
  );
}

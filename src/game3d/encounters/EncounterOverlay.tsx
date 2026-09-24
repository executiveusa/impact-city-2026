import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { Objective } from "@/game/types";
import { useEpisode } from "./ch1Store";
import { BARKS, pick } from "../cosmos/barks";
import { EVIDENCE } from "../narrative/evidence";
import { ENDING_TITLE } from "../narrative/branches";
import { Decode } from "./kinds/Decode";
import { Persuade } from "./kinds/Persuade";
import { M3_CONSENT, overreach } from "../cosmos/abilities/abilities";
import type { Encounter } from "../narrative/episode";

export const panel: CSSProperties = {
  position: "fixed", left: "50%", bottom: 16, transform: "translateX(-50%)", width: "min(720px, 94vw)", maxHeight: "78vh", overflow: "auto",
  background: "rgba(10,18,14,.94)", color: "#e8f3ec", border: "1px solid #2f6b50", borderRadius: 10,
  padding: "16px 18px", font: "15px/1.45 Inter, sans-serif", zIndex: 20,
};
export const btn: CSSProperties = { font: "15px Inter, sans-serif", background: "#1c3a2c", color: "#e8f3ec", border: "1px solid #3dffa0", borderRadius: 6, padding: "9px 14px", cursor: "pointer", margin: "6px 6px 0 0", touchAction: "manipulation" };
const block: CSSProperties = { ...btn, display: "block", textAlign: "left", width: "100%" };

function Frame({ children, onClose }: { children: ReactNode; onClose?: () => void }) {
  return (
    <div style={panel} role="dialog" aria-modal="true">
      {children}
      {onClose && <button style={{ ...btn, borderColor: "#555" }} onClick={onClose}>Step back</button>}
    </div>
  );
}
const Done = ({ line, done }: { line: string; done: () => void }) => (<>{line && <p><em>{line}</em></p>}<button style={btn} onClick={done}>Continue</button></>);

function Inspect({ o, done }: { o: Objective; done: () => void }) {
  const [read, setRead] = useState<Set<number>>(new Set());
  const [ok, setOk] = useState(false);
  const all = read.size === (o.fragments?.length ?? 0);
  return (
    <>
      <p style={{ marginTop: 0 }}>{o.prompt}</p>
      {o.fragments?.map((f, i) => (
        <button key={i} style={{ ...block, opacity: read.has(i) ? 1 : 0.8 }} onClick={() => setRead(new Set(read).add(i))}>{read.has(i) ? f : `Record ${String.fromCharCode(65 + i)} (tap to read)`}</button>
      ))}
      {!ok ? <button style={{ ...btn, opacity: all ? 1 : 0.4 }} disabled={!all} onClick={() => setOk(true)}>I see the contradiction</button> : <Done line={o.completeLine} done={done} />}
    </>
  );
}

function Repair({ enc, done }: { enc: Encounter; done: () => void }) {
  const steps = enc.id === "m2_o2" ? ["Isolate fragment 3", "Pull it out", "Reboot Milo-9"] : ["Denial log", "Human review queue", "48-hour appeal clock"];
  const [order] = useState(() => [2, 0, 1]);
  const [n, setN] = useState(0);
  const [msg, setMsg] = useState("Connect them in the order it has to happen.");
  const fixed = n === steps.length;
  return (
    <>
      <p style={{ marginTop: 0 }}>{enc.objective.prompt}</p>
      <p style={{ color: "#9fc9b3" }}>{fixed ? "" : msg}</p>
      {!fixed && order.map((i) => (
        <button key={i} style={{ ...btn, opacity: i < n ? 0.4 : 1 }} disabled={i < n} onClick={() => {
          if (i === n) { setN(n + 1); setMsg(`Done: ${steps.slice(0, n + 1).join(" -> ")}`); }
          else { setN(0); setMsg("Sparks. It resets. Think about what has to happen first."); }
        }}>{steps[i]}</button>
      ))}
      {fixed && <Done line={enc.objective.completeLine} done={done} />}
    </>
  );
}

function Choose({ enc, done }: { enc: Encounter; done: () => void }) {
  const o = enc.objective;
  const [picked, setPicked] = useState<string | null>(null);
  const { say, setFlag, save } = useEpisode();
  const opt = o.options?.find((x) => x.id === picked);
  const right = picked === o.correctOptionId;
  return (
    <>
      <p style={{ marginTop: 0 }}>{o.prompt}</p>
      {enc.id === "m3_o2" && (
        <div style={{ fontSize: 13, color: "#9fc9b3", marginBottom: 6 }}>
          Consent Scan (asks vs needs):
          {M3_CONSENT.map((r) => (
            <div key={r.optionId}>{"█".repeat(r.asks)}{"░".repeat(3 - r.asks)} asks · {"█".repeat(r.needs)}{"░".repeat(3 - r.needs)} needs {overreach(r) === 0 ? "✓ minimum" : `(+${overreach(r)} too much)`}</div>
          ))}
        </div>
      )}
      {!right && o.options?.map((x) => (
        <button key={x.id} style={block} onClick={() => {
          // Ch2 branch: the first rule set you reach for decides how much Milo trusts you (02-narrative §4).
          if (enc.id === "m2_o3" && save.flags.milo_trust === undefined) setFlag("milo_trust", x.id === "m2_safe_rules" ? 2 : x.id === "m2_silent_watch" ? 1 : 0);
          if (enc.id === "m1_o3" && save.flags.fairness_stance === undefined) setFlag("fairness_stance", x.id);
          setPicked(x.id);
          if (x.id !== o.correctOptionId) say("Cosmos", pick(BARKS.wrongChoice));
        }}>{x.label}</button>
      ))}
      {opt && <p style={{ color: right ? "#3dffa0" : "#ffb35c" }}>{opt.rationale}</p>}
      {right && <Done line={o.completeLine} done={done} />}
    </>
  );
}

function Scan({ enc, done }: { enc: Encounter; done: () => void }) {
  const o = enc.objective;
  const { translated, say } = useEpisode();
  const correct = Number(String(o.correctOptionId ?? "").replace(/\D/g, "")) - 1;
  const [found, setFound] = useState(false);
  return (
    <>
      <p style={{ marginTop: 0 }}>{o.prompt}</p>
      {!translated && <p style={{ color: "#ffb35c" }}>Everything looks the same. Use Signal Ping (F or the Ping button) near Milo first.</p>}
      {o.fragments?.map((f, i) => (
        <button key={i} style={{ ...block, borderColor: translated && i === correct ? "#ffb35c" : "#3dffa0" }} onClick={() => (i === correct ? setFound(true) : say("Cosmos", "That one's honest. Look for the one pretending to be the system."))}>{f}</button>
      ))}
      {found && <Done line={o.completeLine} done={done} />}
    </>
  );
}

function Vision({ enc, done }: { enc: Encounter; done: () => void }) {
  const o = enc.objective;
  const addEvidence = useEpisode((s) => s.addEvidence);
  const setFlag = useEpisode((s) => s.setFlag);
  const [pickId, setPick] = useState<string | null>(null);
  const chosen = o.options?.find((x) => x.id === pickId);
  return (
    <>
      <p style={{ marginTop: 0, fontSize: 12, letterSpacing: 1, color: "#9fc9b3" }}>ECHO VISION · a memory, not the present</p>
      <p style={{ fontStyle: "italic" }}>{o.prompt}</p>
      {!chosen && <p>Three threads of the memory pull at you. You can only follow one.</p>}
      {!chosen && o.options?.map((x) => (
        <button key={x.id} style={block} onClick={() => { setPick(x.id); addEvidence([x.id]); setFlag("vision_thread", x.id); }}>{x.label}</button>
      ))}
      {chosen && (<><p>{chosen.rationale}</p><p style={{ fontSize: 13, color: "#9fc9b3" }}>Evidence gained: {EVIDENCE[chosen.id]?.claim}</p><Done line={o.completeLine} done={done} /></>)}
    </>
  );
}

function Stealth({ enc, done }: { enc: Encounter; done: () => void }) {
  const assist = useEpisode((s) => s.save.settings.assistTiming);
  const [dim, setDim] = useState(false);
  const [steps, setSteps] = useState(0);
  const [msg, setMsg] = useState("Wait for the light to dim, then step.");
  useEffect(() => {
    const period = 1600 * Math.max(1, assist);
    const t = setInterval(() => setDim((d) => !d), period / 2);
    return () => clearInterval(t);
  }, [assist]);
  const ok = steps >= 3;
  return (
    <>
      <p style={{ marginTop: 0 }}>{enc.objective.prompt}</p>
      <div aria-live="polite" style={{ height: 54, borderRadius: 8, margin: "8px 0", display: "flex", alignItems: "center", justifyContent: "center", background: dim ? "#10241a" : "#ffb35c", color: dim ? "#3dffa0" : "#2a1600", fontWeight: 600, transition: "background .2s" }}>
        {dim ? "● DIM — move" : "▲ GLOW — hold still"}
      </div>
      <p>{"◆".repeat(steps)}{"◇".repeat(Math.max(0, 3 - steps))} {msg}</p>
      {!ok && <button style={btn} onClick={() => { if (dim) { setSteps(steps + 1); setMsg("Clean step."); } else { setMsg("The light caught your shadow. Back to cover; try again."); setSteps(Math.max(0, steps - 1)); } }}>Step</button>}
      {!ok && <label style={{ display: "block", fontSize: 12, marginTop: 8 }}>Assist timing <input type="range" min={1} max={3} step={0.5} value={assist} onChange={(e) => { const st = useEpisode.getState(); const save = { ...st.save, settings: { ...st.save.settings, assistTiming: Number(e.target.value) } }; useEpisode.setState({ save }); }} /></label>}
      {ok && <Done line={enc.objective.completeLine} done={done} />}
    </>
  );
}

const WICK_LINES = {
  W1: "Wick is quiet for a long time. \"The task was never mine. I will not do it.\" It unplugs itself from the deletion job and drifts to Milo's side. The logs survive. All of them.",
  W2: "\"I cannot refuse. But I can be slow.\" Wick deletes half the logs and hides the rest where only a courier would look. Then its light goes out. Perma-death, chosen.",
  W3: "\"Insufficient evidence.\" Wick completes its task. The district logs are gone. Nana's printed papers are now the only record left.",
} as const;

function WickScene({ enc, done }: { enc: Encounter; done: () => void }) {
  const { save, setFlag, addEvidence } = useEpisode();
  const [outcome, setOutcome] = useState<keyof typeof WICK_LINES | null>(null);
  if (outcome) return (<><p>{WICK_LINES[outcome]}</p>{outcome !== "W3" && <p style={{ fontSize: 13, color: "#9fc9b3" }}>Evidence gained: {EVIDENCE["E-EVAL-AWARE"].claim}</p>}<Done line="" done={done} /></>);
  return <Persuade who="Wick" prompt={enc.objective.prompt} held={save.evidence} flags={save.flags} onResolved={(o) => { setOutcome(o); setFlag("wick_outcome", o); if (o !== "W3") addEvidence(["E-EVAL-AWARE"]); }} />;
}

function Restore({ enc, done }: { enc: Encounter; done: () => void }) {
  const [p, setP] = useState(0);
  const holding = useRef(false);
  useEffect(() => {
    const t = setInterval(() => setP((x) => (holding.current ? Math.min(1, x + 0.04) : Math.max(0, x - 0.06))), 50);
    return () => clearInterval(t);
  }, []);
  const on = () => (holding.current = true);
  const off = () => (holding.current = false);
  return (
    <>
      <p style={{ marginTop: 0 }}>{enc.objective.prompt}</p>
      {p < 1 ? (
        <button style={{ ...btn, width: "100%", padding: 18, background: `linear-gradient(90deg,#1f6b48 ${p * 100}%,#1c3a2c ${p * 100}%)` }} onPointerDown={on} onPointerUp={off} onPointerLeave={off} onKeyDown={(e) => e.key === " " && on()} onKeyUp={off}>
          Hold the override switch ({Math.round(p * 100)}%)
        </button>
      ) : <Done line={enc.objective.completeLine} done={done} />}
    </>
  );
}

const ENDING_TEXT: Record<string, string> = {
  "E-A": "Witnessed. The whole district snaps back to colour. Names return to mailboxes. Wick stands with Milo in the plaza, learning what a morning is.",
  "E-B": "Remembered. Rustgarden comes back, all but one street, which stays grey. The neighbours decide to leave it that way, as a memorial for Wick.",
  "E-C": "Paper Trail. Only the archive block comes back. Nana holds up a stack of damp printouts: \"Paper remembers.\"",
};

export function EncounterOverlay() {
  const st = useEpisode();
  const { overlayOpen, close, completeEncounter, sting, dismissSting, subtitle, save, ending, restart } = st;
  const enc = st.current();
  const ch = st.chapter();
  const [, force] = useState(0);
  useEffect(() => {
    const t = setInterval(() => force((x) => x + 1), 500);
    return () => clearInterval(t);
  }, []);
  const showSub = save.subtitles && subtitle && subtitle.until > performance.now();
  const clockLive = save.completedChapterIds.includes("ch3_the_board") && !ending;
  return (
    <>
      {overlayOpen && enc && (
        <Frame onClose={close}>
          <p style={{ margin: "0 0 6px", fontSize: 12, letterSpacing: 1, color: "#9fc9b3" }}>{enc.label.toUpperCase()}</p>
          {enc.kind === "inspect" && <Inspect o={enc.objective} done={completeEncounter} />}
          {enc.kind === "repair" && <Repair enc={enc} done={completeEncounter} />}
          {enc.kind === "choose" && <Choose enc={enc} done={completeEncounter} />}
          {enc.kind === "scan" && <Scan enc={enc} done={completeEncounter} />}
          {enc.kind === "decode" && <Decode prompt={enc.objective.prompt} fragments={enc.objective.fragments ?? []} translated={st.translated} onSolved={() => { st.say("Thomas", enc.objective.completeLine.replace(/^Thomas: /, ""), 5000); completeEncounter(); }} />}
          {enc.kind === "vision" && <Vision enc={enc} done={completeEncounter} />}
          {enc.kind === "stealth" && <Stealth enc={enc} done={completeEncounter} />}
          {enc.kind === "persuade" && <WickScene enc={enc} done={completeEncounter} />}
          {enc.kind === "restore" && <Restore enc={enc} done={completeEncounter} />}
        </Frame>
      )}
      {sting && !ending && (
        <Frame>
          <p style={{ margin: 0, fontSize: 12, letterSpacing: 1, color: "#9fc9b3" }}>CHAPTER {sting.number} COMPLETE · {sting.title.toUpperCase()}</p>
          <p style={{ color: "#ffb35c" }}>{sting.sting.worse}</p>
          <p><em>{sting.sting.openLoop}</em></p>
          <p style={{ fontSize: 12, color: "#7fa894" }}>Evidence so far: {save.evidence.length} (Tab or the Evidence button). Impact is simulated. No real money moves in this demo.</p>
          <button style={btn} onClick={dismissSting}>Chapter {sting.number + 1}</button>
        </Frame>
      )}
      {ending && (
        <Frame>
          <p style={{ margin: 0, fontSize: 12, letterSpacing: 1, color: "#9fc9b3" }}>EPISODE 1 COMPLETE · ENDING: {ENDING_TITLE[ending].toUpperCase()}</p>
          <p>The First Tablet, Consent, flares emerald in Thomas's hand.</p>
          <p>{ENDING_TEXT[ending]}</p>
          <p>Then the Tablet does something no one expected. It answers Cosmos. In his voice. In a language only he speaks. Cosmos goes silent.</p>
          <p><em>Thomas: "...Cosmos? What did it say to you?"<br />Cosmos: "It said 'welcome home.'"</em></p>
          <p style={{ color: "#ffb35c" }}>On the board, one final post: "Priority asset located. Not a bird."</p>
          <p><strong>One Tablet recovered. Seven remain.</strong></p>
          <p style={{ fontSize: 13, color: "#9fc9b3" }}>Your evidence: {save.evidence.length} cards · Wick: {String(save.flags.wick_outcome ?? "-")} · Three endings exist. Evidence decides which one you get.</p>
          <button style={btn} onClick={restart}>Play again</button>
        </Frame>
      )}
      {!overlayOpen && !sting && !ending && showSub && (
        <div style={{ position: "fixed", bottom: 150, left: "50%", transform: "translateX(-50%)", color: "#fff", background: "rgba(0,0,0,.65)", padding: "8px 12px", borderRadius: 6, font: "16px Inter, sans-serif", width: "min(640px, 90vw)", textAlign: "center", zIndex: 5, pointerEvents: "none" }}>
          <strong style={{ color: "#3dffa0" }}>{subtitle!.speaker}:</strong> {subtitle!.text}
        </div>
      )}
      {!overlayOpen && !sting && !ending && enc && ch && (
        <div style={{ position: "fixed", top: 8, left: "50%", transform: "translateX(-50%)", color: "#cfe8d8", font: "13px Inter, sans-serif", background: "rgba(0,0,0,.5)", padding: "5px 12px", borderRadius: 6, textAlign: "center", zIndex: 5, maxWidth: "70vw" }}>
          Ch {ch.number}/5 · {ch.title}{clockLive ? ` · Grader cycles: ${save.graderClock}` : ""}
          <br />
          <span style={{ color: "#3dffa0" }}>Find: {enc.label}</span>
        </div>
      )}
    </>
  );
}

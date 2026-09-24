import { useRef, useState, type CSSProperties } from "react";
import { touchInput } from "../player/input";
import { useEpisode } from "../encounters/ch1Store";

const round: CSSProperties = { width: 64, height: 64, borderRadius: 32, border: "2px solid #3dffa0", background: "rgba(10,30,20,.55)", color: "#e8f3ec", font: "600 13px Inter, sans-serif", touchAction: "none", userSelect: "none" };

/** On-screen controls for phones: left thumbstick, right-side buttons. Camera: drag anywhere else. */
export function TouchControls() {
  const base = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const id = useRef<number | null>(null);
  const move = (e: React.PointerEvent) => {
    if (id.current !== e.pointerId || !base.current) return;
    const r = base.current.getBoundingClientRect();
    let x = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    let y = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    const l = Math.hypot(x, y);
    if (l > 1) { x /= l; y /= l; }
    touchInput.right = x;
    touchInput.forward = -y;
    setKnob({ x: x * 36, y: y * 36 });
  };
  const end = (e: React.PointerEvent) => {
    if (id.current !== e.pointerId) return;
    id.current = null;
    touchInput.right = 0;
    touchInput.forward = 0;
    setKnob({ x: 0, y: 0 });
  };
  const st = useEpisode;
  return (
    <>
      <div
        ref={base}
        data-ui
        onPointerDown={(e) => { id.current = e.pointerId; (e.target as HTMLElement).setPointerCapture(e.pointerId); move(e); }}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        style={{ position: "fixed", left: 22, bottom: 22, width: 120, height: 120, borderRadius: 60, border: "2px solid rgba(61,255,160,.6)", background: "rgba(0,0,0,.25)", touchAction: "none", zIndex: 6 }}
      >
        <div style={{ position: "absolute", left: 60 - 24 + knob.x, top: 60 - 24 + knob.y, width: 48, height: 48, borderRadius: 24, background: "rgba(61,255,160,.55)", pointerEvents: "none" }} />
      </div>
      <div data-ui style={{ position: "fixed", right: 16, bottom: 20, display: "grid", gridTemplateColumns: "64px 64px", gap: 10, zIndex: 6 }}>
        <button data-ui style={round} onPointerDown={() => st.getState().ping()}>Ping</button>
        <button data-ui style={{ ...round, background: "rgba(61,255,160,.35)" }} onPointerDown={() => st.getState().open()}>Use</button>
        <button data-ui style={round} onPointerDown={() => dispatchEvent(new KeyboardEvent("keydown", { code: "Tab" }))}>Clues</button>
        <button data-ui style={round} onPointerDown={() => (touchInput.jump = true)} onPointerUp={() => (touchInput.jump = false)} onPointerLeave={() => (touchInput.jump = false)}>Jump</button>
      </div>
    </>
  );
}

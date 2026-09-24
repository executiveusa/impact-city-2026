import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Canvas3D } from "@/game3d/engine/Canvas3D";
import { tierFromQuery } from "@/game3d/engine/quality";
import { useDecayStore } from "@/game3d/world/decay/decayStore";
import { EncounterOverlay, btn, panel } from "@/game3d/encounters/EncounterOverlay";
import { EvidenceLedger } from "@/game3d/ui/EvidenceLedger";
import { TouchControls } from "@/game3d/ui/TouchControls";
import { useEpisode } from "@/game3d/encounters/ch1Store";
import { playerState } from "@/game3d/player/playerState";
import { soundManager } from "@/game/audio/soundManager";

/**
 * /play: Impact City: The Emerald Algorithm, Episode 1 in 3D (playable build).
 * Query: ?quality=low|med|high  &auto=1 (scripted walk)  &perf=1 (record frame times)  &collider=1  &fps=1
 */
export default function Game3D() {
  const params = new URLSearchParams(location.search);
  const tier = tierFromQuery(location.search);
  const autopilot = params.get("auto") === "1";
  const perf = params.get("perf") === "1";
  const showCollider = params.get("collider") === "1";
  const showFps = params.get("fps") === "1" || perf;
  const touch = typeof matchMedia !== "undefined" && (matchMedia("(pointer: coarse)").matches || "ontouchstart" in window);
  const [started, setStarted] = useState(autopilot || perf);
  const [fps, setFps] = useState(0);
  const cycle = useDecayStore((s) => s.cycle);
  const save = useEpisode((s) => s.save);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const st = useEpisode.getState();
      if (e.code === "KeyG" && showFps) cycle();
      if (e.code === "KeyE" && !st.overlayOpen) st.open();
      if (e.code === "KeyF" && !st.overlayOpen) st.ping();
      if (e.code === "Escape" && st.overlayOpen) st.close();
    };
    addEventListener("keydown", onKey);
    const unsub = useEpisode.subscribe((s) => (playerState.locked = s.overlayOpen || !!s.sting || !!s.ending));
    let frames = 0;
    let last = performance.now();
    let raf = 0;
    const loop = (t: number) => {
      frames++;
      if (t - last >= 500) {
        setFps(Math.round((frames * 1000) / (t - last)));
        frames = 0;
        last = t;
      }
      raf = requestAnimationFrame(loop);
    };
    if (showFps) raf = requestAnimationFrame(loop);
    return () => {
      removeEventListener("keydown", onKey);
      soundManager.stopLoop("ambient_rustgarden_loop");
      unsub();
      cancelAnimationFrame(raf);
    };
  }, [cycle, showFps]);

  const start = () => {
    soundManager.resume();
    soundManager.startLoop("ambient_rustgarden_loop");
    setStarted(true);
    const st = useEpisode.getState();
    const ch = st.chapter();
    if (ch) setTimeout(() => st.say(ch.intro.speaker, ch.intro.line, 8000), 600);
  };
  const inProgress = save.completedChapterIds.length > 0 || save.encounterIndex > 0;

  return (
    <>
      <Canvas3D tier={tier} autopilot={autopilot} perf={perf} showCollider={showCollider} />
      {started && <EncounterOverlay />}
      {started && <EvidenceLedger />}
      {started && touch && <TouchControls />}
      {!started && (
        <div style={{ ...panel, bottom: "auto", top: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 12, letterSpacing: 2, color: "#9fc9b3" }}>EPISODE 1 · PLAYABLE PREVIEW</p>
          <h1 style={{ fontFamily: "Cinzel, serif", fontWeight: 600, margin: "6px 0 2px" }}>Impact City</h1>
          <p style={{ fontFamily: "Cinzel, serif", margin: 0 }}>The Emerald Algorithm</p>
          <p style={{ fontSize: 14 }}>Earth, 2056. A courier named Thomas. A parrot named Cosmos. A machine that edits the record, and five chapters to prove it.</p>
          <p style={{ fontSize: 13, color: "#9fc9b3" }}>
            {touch ? "Left stick to move · drag the screen to look · Use near the green marker · Ping to scan · Clues for evidence" : "WASD move · drag to look · E use · F Cosmos Signal Ping · Tab evidence · Space jump · Shift sprint"}
          </p>
          <button style={{ ...btn, fontSize: 17, padding: "12px 22px" }} onClick={start}>{inProgress ? "Continue" : "Play"}</button>
          {inProgress && <button style={{ ...btn, borderColor: "#555" }} onClick={() => { useEpisode.getState().restart(); start(); }}>New game</button>}
          <p style={{ fontSize: 11, color: "#7fa894", marginBottom: 0 }}>Nonviolent · placeholder art · impact is simulated · the 3D world takes a few seconds to load</p>
        </div>
      )}
      {showFps && (
        <div style={{ position: "fixed", bottom: 8, left: 8, color: "#cfe8d8", font: "11px ui-monospace, monospace", background: "rgba(0,0,0,.45)", padding: "3px 6px", borderRadius: 4, pointerEvents: "none" }}>
          {tier} · {fps} fps
        </div>
      )}
      <Link to="/game" style={{ position: "fixed", top: 8, right: 8, color: "#cfe8d8", font: "12px Inter, sans-serif", zIndex: 7 }}>2D version</Link>
    </>
  );
}

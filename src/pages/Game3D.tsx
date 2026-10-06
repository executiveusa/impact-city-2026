import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Canvas3D } from "@/game3d/engine/Canvas3D";
import { tierFromQuery } from "@/game3d/engine/quality";
import { useDecayStore } from "@/game3d/world/decay/decayStore";
import { EncounterOverlay } from "@/game3d/encounters/EncounterOverlay";
import { useCh1 } from "@/game3d/encounters/ch1Store";
import { playerState } from "@/game3d/player/playerState";
import { BARKS } from "@/game3d/cosmos/barks";
import { soundManager } from "@/game/audio/soundManager";

/**
 * /play: Phase 0 feasibility spike (08-build-plan P0). Behind a flag; /game (2D) is untouched.
 * Query: ?quality=low|med|high  &auto=1 (scripted walk)  &perf=1 (record frame times)  &collider=1
 */
export default function Game3D() {
  const params = new URLSearchParams(location.search);
  const tier = tierFromQuery(location.search);
  const autopilot = params.get("auto") === "1";
  const perf = params.get("perf") === "1";
  const showCollider = params.get("collider") === "1";
  const decay = useDecayStore((s) => s.decay["p0-props"] ?? 0);
  const cycle = useDecayStore((s) => s.cycle);
  const [fps, setFps] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "KeyG") cycle();
      const st = useCh1.getState();
      if (e.code === "KeyE" && !st.overlayOpen) st.open();
      if (e.code === "KeyF" && !st.overlayOpen) st.ping();
      if (e.code === "Escape" && st.overlayOpen) st.close();
    };
    // Movement freezes while an encounter overlay or the chapter sting is up.
    const unsub = useCh1.subscribe((s) => (playerState.locked = s.overlayOpen || s.sting));
    const startAudio = () => {
      soundManager.resume();
      soundManager.startLoop("ambient_rustgarden_loop");
      removeEventListener("pointerdown", startAudio);
      removeEventListener("keydown", startAudio);
    };
    addEventListener("pointerdown", startAudio);
    addEventListener("keydown", startAudio);
    const st = useCh1.getState();
    if (st.currentEncounterId() === "m1_o1") st.say("Nana Ife", BARKS.nanaOpening, 7000);
    addEventListener("keydown", onKey);
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
    raf = requestAnimationFrame(loop);
    return () => {
      removeEventListener("keydown", onKey);
      removeEventListener("pointerdown", startAudio);
      removeEventListener("keydown", startAudio);
      soundManager.stopLoop("ambient_rustgarden_loop");
      unsub();
      cancelAnimationFrame(raf);
    };
  }, [cycle]);

  return (
    <>
      <Canvas3D tier={tier} autopilot={autopilot} perf={perf} showCollider={showCollider} />
      <EncounterOverlay />
      <div
        style={{ position: "fixed", top: 8, left: 8, color: "#cfe8d8", font: "12px ui-monospace, monospace", background: "rgba(0,0,0,.45)", padding: "6px 8px", borderRadius: 4, pointerEvents: "none" }}
      >
        P0 spike · {tier} · {fps} fps · decay {decay.toFixed(1)}
        <br />
        WASD move · Shift sprint · Space jump · drag to look · F Signal Ping · E interact · G decay test
      </div>
      <Link to="/game" style={{ position: "fixed", top: 8, right: 8, color: "#cfe8d8", font: "12px ui-monospace, monospace" }}>
        2D version
      </Link>
    </>
  );
}

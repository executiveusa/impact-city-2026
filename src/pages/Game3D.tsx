import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Canvas3D } from "@/game3d/engine/Canvas3D";
import { tierFromQuery } from "@/game3d/engine/quality";
import { useDecayStore } from "@/game3d/world/decay/decayStore";

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
    };
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
      cancelAnimationFrame(raf);
    };
  }, [cycle]);

  return (
    <>
      <Canvas3D tier={tier} autopilot={autopilot} perf={perf} showCollider={showCollider} />
      <div
        style={{ position: "fixed", top: 8, left: 8, color: "#cfe8d8", font: "12px ui-monospace, monospace", background: "rgba(0,0,0,.45)", padding: "6px 8px", borderRadius: 4, pointerEvents: "none" }}
      >
        P0 spike · {tier} · {fps} fps · decay {decay.toFixed(1)}
        <br />
        WASD move · Shift sprint · Space jump · drag to look · G cycle record-decay
      </div>
      <Link to="/game" style={{ position: "fixed", top: 8, right: 8, color: "#cfe8d8", font: "12px ui-monospace, monospace" }}>
        2D version
      </Link>
    </>
  );
}

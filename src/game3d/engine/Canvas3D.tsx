import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import * as THREE from "three";
import { QUALITY, type QualityTier } from "./quality";
import { mark, recordFrames } from "./perf";
import { RustgardenWorld } from "../world/RustgardenSplat";
import { Ch1World } from "../encounters/Ch1World";
import { CosmosAgent } from "../cosmos/CosmosAgent";
import { CapsuleController } from "../player/CapsuleController";

const SPAWN = new THREE.Vector3(0, 0, 0); // Marble capture origin (pano eye point), after the Y-up flip

function PerfKickoff({ tier, enabled }: { tier: QualityTier; enabled: boolean }) {
  const { gl } = useThree();
  useEffect(() => {
    mark("canvasReady");
    if (!enabled) return;
    const ctx = gl.getContext();
    const dbg = ctx.getExtension("WEBGL_debug_renderer_info");
    const renderer = dbg ? String(ctx.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : String(ctx.getParameter(ctx.RENDERER));
    const params = new URLSearchParams(location.search);
    recordFrames({
      tier,
      warmupMs: Number(params.get("warmup") ?? 8000),
      durationMs: Number(params.get("duration") ?? 30000),
      renderer,
      dpr: gl.getPixelRatio(),
    });
  }, [gl, tier, enabled]);
  return null;
}

export function Canvas3D({ tier, autopilot, perf, showCollider }: { tier: QualityTier; autopilot: boolean; perf: boolean; showCollider: boolean }) {
  const q = QUALITY[tier];
  const [feet, setFeet] = useState<THREE.Vector3 | null>(null);
  const onGrounded = useMemo(() => (p: THREE.Vector3) => setFeet(p), []);
  return (
    <Canvas
      dpr={[1, q.maxDpr]}
      camera={{ fov: 60, near: 0.02, far: 100, position: [0, 0.5, 2] }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      style={{ position: "fixed", inset: 0, background: "#0b1410" }}
    >
      <color attach="background" args={["#0b1410"]} />
      <hemisphereLight args={["#cfe8d8", "#2a1f16", 0.9]} />
      <directionalLight position={[2, 4, 1]} intensity={1.4} color="#ffe2b8" />
      <Suspense fallback={null}>
        <Physics gravity={[0, -9.81, 0]}>
          <RustgardenWorld splatUrl={q.splatUrl} showCollider={showCollider} />
          <CapsuleController spawn={SPAWN} autopilot={autopilot} onGrounded={onGrounded} />
        </Physics>
        {feet && <Ch1World feet={feet} />}
        <CosmosAgent />
        <PerfKickoff tier={tier} enabled={perf} />
      </Suspense>
    </Canvas>
  );
}

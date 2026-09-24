import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { ClayProp } from "../world/ClayProps";
import { playerState } from "../player/playerState";
import { ENCOUNTER_PROP, useCh1 } from "./ch1Store";
import { BARKS } from "../cosmos/barks";

const PROPS = {
  terminal: { url: "/assets/3d/impact-city/props/warden-terminal/warden-terminal.glb", color: "#4f6f66", height: 0.9, label: "Warden terminal" },
  kiosk: { url: "/assets/3d/impact-city/props/learning-kiosk/learning-kiosk.glb", color: "#6f5a8a", height: 0.9, label: "Appeal terminal" },
  gate: { url: "/assets/3d/impact-city/props/compliance-gate/rustgarden-gate.glb", color: "#8a6a4f", height: 1.3, label: "Compliance Gate" },
} as const;
type PropKey = keyof typeof PROPS;
const INTERACT_RADIUS = 0.75;

/** Chapter 1 set dressing + interactables, laid out on a ring around the first grounded point. */
export function Ch1World({ feet }: { feet: THREE.Vector3 }) {
  const anchors = useMemo(() => {
    const keys: PropKey[] = ["terminal", "kiosk", "gate"];
    return Object.fromEntries(
      keys.map((k, i) => {
        const a = (i / 3) * Math.PI * 2 + 0.6;
        return [k, new THREE.Vector3(feet.x + Math.cos(a) * 1.4, feet.y, feet.z + Math.sin(a) * 1.4)];
      })
    ) as Record<PropKey, THREE.Vector3>;
  }, [feet]);
  const nana = useMemo(() => new THREE.Vector3(feet.x - 0.6, feet.y, feet.z + 0.4), [feet]);

  useFrame((state) => {
    const st = useCh1.getState();
    const cur = st.currentEncounterId();
    let near: string | null = null;
    if (cur) {
      const key = ENCOUNTER_PROP[cur] as PropKey;
      if (anchors[key].distanceTo(playerState.pos) < INTERACT_RADIUS + 0.4) near = cur;
    }
    st.setNear(near);
    // Idle hint after 45 s without moving (01-game-design §6).
    const t = state.clock.elapsedTime;
    if (cur && !st.overlayOpen && t - playerState.lastMoveAt > 45 && (!st.subtitle || st.subtitle.until < performance.now())) {
      playerState.lastMoveAt = t;
      st.say("Cosmos", BARKS.idleHint[cur] ?? "");
    }
  });

  const pingLevel = (key: PropKey) => () => {
    const st = useCh1.getState();
    const cur = st.currentEncounterId();
    const left = st.pingUntil - performance.now();
    if (!cur || ENCOUNTER_PROP[cur] !== key || left <= 0) return 0;
    return 0.5 + 0.5 * Math.sin(performance.now() / 150);
  };

  return (
    <>
      {(Object.keys(PROPS) as PropKey[]).map((k) => (
        <ClayProp key={k} url={PROPS[k].url} color={PROPS[k].color} height={PROPS[k].height} position={anchors[k]} zone={`ch1-${k}`} highlight={pingLevel(k)} />
      ))}
      <group position={nana}>
        {/* Nana Ife placeholder (P1-6): clay capsule until the Phase 4 model lands. */}
        <mesh position={[0, 0.45, 0]}>
          <capsuleGeometry args={[0.16, 0.5, 6, 12]} />
          <meshStandardMaterial color="#7a4e3a" roughness={0.95} />
        </mesh>
        <Html position={[0, 1.05, 0]} center distanceFactor={4} style={{ pointerEvents: "none" }}>
          <div style={{ font: "11px Inter, sans-serif", color: "#f3e6c8", background: "rgba(20,14,8,.6)", padding: "1px 6px", borderRadius: 3 }}>Nana Ife</div>
        </Html>
      </group>
      <NearPrompt anchors={anchors} />
    </>
  );
}

function NearPrompt({ anchors }: { anchors: Record<PropKey, THREE.Vector3> }) {
  const near = useCh1((s) => s.near);
  const open = useCh1((s) => s.overlayOpen);
  if (!near || open) return null;
  const key = ENCOUNTER_PROP[near] as PropKey;
  const p = anchors[key];
  return (
    <Html position={[p.x, p.y + PROPS[key].height + 0.2, p.z]} center style={{ pointerEvents: "none" }}>
      <div style={{ font: "12px Inter, sans-serif", color: "#0b1410", background: "#3dffa0", padding: "2px 8px", borderRadius: 3, whiteSpace: "nowrap" }}>
        E · {PROPS[key].label}
      </div>
    </Html>
  );
}

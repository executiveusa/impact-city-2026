import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { ClayProp } from "../world/ClayProps";
import { playerState } from "../player/playerState";
import { useEpisode } from "./ch1Store";
import { useDecayStore } from "../world/decay/decayStore";
import type { PropKey } from "../narrative/episode";

const PROPS: Record<PropKey, { url: string; color: string; height: number }> = {
  terminal: { url: "/assets/3d/impact-city/props/warden-terminal/warden-terminal.glb", color: "#4f6f66", height: 0.9 },
  kiosk: { url: "/assets/3d/impact-city/props/learning-kiosk/learning-kiosk.glb", color: "#6f5a8a", height: 0.9 },
  gate: { url: "/assets/3d/impact-city/props/compliance-gate/rustgarden-gate.glb", color: "#8a6a4f", height: 1.3 },
  filter: { url: "/assets/3d/impact-city/props/water-filter/water-filter-station.glb", color: "#6f8aa0", height: 0.9 },
  tablet: { url: "/assets/3d/impact-city/props/emerald-tablet/emerald-tablet-consent.glb", color: "#3f8a5f", height: 0.7 },
  bench: { url: "/assets/3d/impact-city/props/solar-bench/solar-charging-bench.glb", color: "#8a7a4f", height: 0.6 },
};
const ORDER: PropKey[] = ["terminal", "kiosk", "gate", "filter", "tablet", "bench"];
const RING = 1.4;
const NEAR = 1.0;

/** Episode set: 6 clay props on a ring around the first grounded point; the current encounter's prop is live. */
export function Ch1World({ feet }: { feet: THREE.Vector3 }) {
  const anchors = useMemo(
    () =>
      Object.fromEntries(
        ORDER.map((k, i) => {
          const a = (i / ORDER.length) * Math.PI * 2 + 0.3;
          return [k, new THREE.Vector3(feet.x + Math.cos(a) * RING, feet.y, feet.z + Math.sin(a) * RING)];
        })
      ) as Record<PropKey, THREE.Vector3>,
    [feet]
  );
  const nana = useMemo(() => new THREE.Vector3(feet.x - 0.5, feet.y, feet.z + 0.3), [feet]);

  useFrame((state) => {
    const st = useEpisode.getState();
    const cur = st.current();
    let near: string | null = null;
    if (cur && anchors[cur.prop].distanceTo(playerState.pos) < NEAR) near = cur.id;
    st.setNear(near);
    // Record decay follows the grader clock (01 §8): max zone decay drives the clay desaturation.
    const d = Math.max(0, ...Object.values(st.save.decay));
    const ds = useDecayStore.getState();
    for (const k of ORDER) if ((ds.decay[`ep-${k}`] ?? -1) !== d) ds.set(`ep-${k}`, d);
    const t = state.clock.elapsedTime;
    if (cur && !st.overlayOpen && !st.sting && t - playerState.lastMoveAt > 45 && (!st.subtitle || st.subtitle.until < performance.now())) {
      playerState.lastMoveAt = t;
      st.say("Cosmos", cur.hint);
    }
  });

  const pingLevel = (key: PropKey) => () => {
    const st = useEpisode.getState();
    const cur = st.current();
    if (!cur || cur.prop !== key || st.pingUntil - performance.now() <= 0) return 0;
    return 0.5 + 0.5 * Math.sin(performance.now() / 150);
  };

  return (
    <>
      {ORDER.map((k) => (
        <ClayProp key={k} url={PROPS[k].url} color={PROPS[k].color} height={PROPS[k].height} position={anchors[k]} zone={`ep-${k}`} highlight={pingLevel(k)} />
      ))}
      <group position={nana}>
        <mesh position={[0, 0.45, 0]}>
          <capsuleGeometry args={[0.16, 0.5, 6, 12]} />
          <meshStandardMaterial color="#7a4e3a" roughness={0.95} />
        </mesh>
        <Html position={[0, 1.05, 0]} center distanceFactor={4} style={{ pointerEvents: "none" }}>
          <div style={{ font: "11px Inter, sans-serif", color: "#f3e6c8", background: "rgba(20,14,8,.6)", padding: "1px 6px", borderRadius: 3 }}>Nana Ife</div>
        </Html>
      </group>
      <Marker anchors={anchors} />
    </>
  );
}

/** Floating objective marker over the live prop, plus the interact prompt when close. */
function Marker({ anchors }: { anchors: Record<PropKey, THREE.Vector3> }) {
  const cur = useEpisode((s) => s.current());
  const near = useEpisode((s) => s.near);
  const open = useEpisode((s) => s.overlayOpen || !!s.sting || !!s.ending);
  if (!cur || open) return null;
  const p = anchors[cur.prop];
  const isNear = near === cur.id;
  return (
    <Html position={[p.x, p.y + PROPS[cur.prop].height + 0.25, p.z]} center style={{ pointerEvents: "none" }}>
      <div style={{ font: "12px Inter, sans-serif", color: isNear ? "#0b1410" : "#3dffa0", background: isNear ? "#3dffa0" : "rgba(0,0,0,.55)", border: "1px solid #3dffa0", padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap" }}>
        {isNear ? `Use · ${cur.label}` : `▼ ${cur.label}`}
      </div>
    </Html>
  );
}

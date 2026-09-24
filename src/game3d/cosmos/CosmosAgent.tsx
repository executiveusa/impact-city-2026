import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { playerState } from "../player/playerState";
import { useCh1 } from "../encounters/ch1Store";

const COSMOS_URL = "/assets/3d/impact-city/characters/cosmos/cosmos-placeholder.glb";
const STEP = 1 / 12; // animation "on twos" at 24 fps: pose updates 12x a second (04-art-direction)

/**
 * P1-2 Cosmos v1: follow state (hovers off Thomas's shoulder with lag and a stepped bob)
 * plus the Signal Ping ring. Perch/fly-route states arrive with Scout (Phase 2).
 */
export function CosmosAgent() {
  const { scene } = useGLTF(COSMOS_URL);
  const model = useMemo(() => {
    const m = scene.clone(true);
    const box = new THREE.Box3().setFromObject(m);
    const s = 0.22 / Math.max(box.getSize(new THREE.Vector3()).y, 1e-3);
    m.scale.setScalar(s);
    return m;
  }, [scene]);
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const acc = useRef(0);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const reduced = useCh1.getState().save.reducedMotion;
    const yaw = playerState.yaw;
    target.set(playerState.pos.x + Math.cos(yaw) * 0.32, playerState.pos.y + 0.55, playerState.pos.z - Math.sin(yaw) * 0.32);
    acc.current += dt;
    // Stepped pose sampling for the stop-motion read; smooth when reduced motion is on for the camera only.
    if (acc.current >= STEP || reduced) {
      const k = reduced ? 1 - Math.pow(0.02, dt) : 1 - Math.pow(0.02, acc.current);
      g.position.lerp(target, k);
      g.position.y += Math.sin(state.clock.elapsedTime * 3) * 0.02;
      g.rotation.y = yaw + Math.PI;
      acc.current = 0;
    }
    const r = ring.current;
    if (r) {
      const left = useCh1.getState().pingUntil - performance.now();
      const t = 1 - Math.max(0, left - 5000) / 1000; // ring expands during the first second of the 6 s ping
      r.visible = left > 5000;
      r.position.copy(playerState.pos);
      r.scale.setScalar(0.2 + t * 3);
      (r.material as THREE.MeshBasicMaterial).opacity = 0.6 * (1 - t);
    }
  });

  return (
    <>
      <group ref={group}>
        <primitive object={model} />
      </group>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[0.95, 1, 64]} />
        <meshBasicMaterial color="#3dffa0" transparent opacity={0.6} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

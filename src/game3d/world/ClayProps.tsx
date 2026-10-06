import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { makeClayMaterial, type ClayMaterial } from "./clayMaterial";
import { useDecayStore } from "./decay/decayStore";

const PROPS = [
  { url: "/assets/3d/impact-city/props/compliance-gate/rustgarden-gate.glb", color: "#8a6a4f", height: 1.2 },
  { url: "/assets/3d/impact-city/props/warden-terminal/warden-terminal.glb", color: "#4f6f66", height: 0.9 },
  { url: "/assets/3d/impact-city/props/water-filter/water-filter-station.glb", color: "#6f8aa0", height: 0.8 },
] as const;

function ClayProp({ url, color, height, position, zone }: { url: string; color: string; height: number; position: THREE.Vector3; zone: string }) {
  const { scene } = useGLTF(url);
  const { object, mats } = useMemo(() => {
    const obj = scene.clone(true);
    const mats: ClayMaterial[] = [];
    obj.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        const src = (Array.isArray(m.material) ? m.material[0] : m.material) as THREE.MeshStandardMaterial;
        const tint = src?.color ? src.color.clone().lerp(new THREE.Color(color), 0.5) : new THREE.Color(color);
        const clay = makeClayMaterial(tint);
        mats.push(clay);
        m.material = clay;
        m.castShadow = true;
      }
    });
    // Normalise to a readable size in the small Marble bubble, base on the ground.
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const s = height / Math.max(size.y, 1e-3);
    obj.scale.setScalar(s);
    const box2 = new THREE.Box3().setFromObject(obj);
    obj.position.y -= box2.min.y;
    return { object: obj, mats };
  }, [scene, color, height]);
  useFrame(() => {
    const d = useDecayStore.getState().decay[zone] ?? 0;
    for (const m of mats) m.userData.uDecay.value += (d - m.userData.uDecay.value) * 0.1;
  });
  useEffect(() => () => mats.forEach((m) => m.dispose()), [mats]);
  return (
    <group position={position}>
      <primitive object={object} />
    </group>
  );
}

/** Places the 3 P0 props on a ring around the spawn point, on the ground height found by raycast. */
export function ClayProps({ anchors }: { anchors: THREE.Vector3[] }) {
  return (
    <>
      {PROPS.map((p, i) =>
        anchors[i] ? <ClayProp key={p.url} url={p.url} color={p.color} height={p.height} position={anchors[i]} zone="p0-props" /> : null
      )}
    </>
  );
}

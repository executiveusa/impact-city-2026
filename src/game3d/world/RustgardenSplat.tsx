import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { SparkRenderer, SplatMesh } from "@sparkjsdev/spark";
import { mark } from "../engine/perf";

export const COLLIDER_URL = "/assets/worldlabs/rustgarden/splat/collider.glb";

/**
 * World Labs Marble exports (splats + collider) share one OpenCV-style frame (+Y down).
 * Bounds were checked offline: collider and 150k SPZ agree to within ~0.4 units on every axis.
 * One parent group flips both into three.js Y-up so they stay registered.
 */
export const WORLD_ROTATION: [number, number, number] = [Math.PI, 0, 0];

function SparkLayer() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const spark = new SparkRenderer({ renderer: gl });
    scene.add(spark);
    return () => {
      scene.remove(spark);
    };
  }, [gl, scene]);
  return null;
}

export function RustgardenSplat({ url }: { url: string }) {
  const splat = useMemo(() => {
    const m = new SplatMesh({ url, onLoad: () => mark("splatLoaded") });
    return m;
  }, [url]);
  useEffect(() => () => splat.dispose(), [splat]);
  return <primitive object={splat} />;
}

export function RustgardenCollider({ visible = false }: { visible?: boolean }) {
  const { scene } = useGLTF(COLLIDER_URL);
  const mesh = useMemo(() => {
    let found: THREE.Mesh | null = null;
    scene.traverse((o) => {
      if (!found && (o as THREE.Mesh).isMesh) found = o as THREE.Mesh;
    });
    const m = found as unknown as THREE.Mesh;
    m.material = new THREE.MeshBasicMaterial({ color: "#39ff9c", wireframe: true, transparent: true, opacity: 0.15 });
    return m;
  }, [scene]);
  useEffect(() => mark("colliderParsed"), []);
  return (
    <RigidBody type="fixed" colliders="trimesh" onCollisionEnter={undefined}>
      <primitive object={mesh} visible={visible} />
    </RigidBody>
  );
}

export function RustgardenWorld({ splatUrl, showCollider }: { splatUrl: string; showCollider: boolean }) {
  return (
    <>
      <SparkLayer />
      <group rotation={WORLD_ROTATION}>
        <RustgardenSplat url={splatUrl} />
        <RustgardenCollider visible={showCollider} />
      </group>
    </>
  );
}

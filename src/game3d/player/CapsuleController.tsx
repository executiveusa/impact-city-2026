import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, useRapier, type RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { createInput } from "./input";
import { mark } from "../engine/perf";
import { playerState } from "./playerState";

const HALF_HEIGHT = 0.25; // capsule segment half-height (m)
const RADIUS = 0.18;
const WALK = 1.4; // m/s, the Marble bubble is ~5 m across
const SPRINT = 2.4;
const JUMP_V = 3.2;
const GRAVITY = 9.81;

/**
 * P0-3: kinematic capsule on the Marble collider with a third-person follow camera.
 * Uses Rapier's KinematicCharacterController (autostep, snap-to-ground, slope limit).
 */
export function CapsuleController({ spawn, autopilot, onGrounded }: { spawn: THREE.Vector3; autopilot: boolean; onGrounded?: (p: THREE.Vector3) => void }) {
  const body = useRef<RapierRigidBody>(null);
  const { world } = useRapier();
  const input = useMemo(() => createInput(autopilot), [autopilot]);
  const ctrl = useMemo(() => {
    const c = world.createCharacterController(0.02);
    c.enableAutostep(0.12, 0.08, true);
    c.enableSnapToGround(0.1);
    c.setMaxSlopeClimbAngle((50 * Math.PI) / 180);
    c.setApplyImpulsesToDynamicBodies(false);
    return c;
  }, [world]);
  const vy = useRef(0);
  const grounded = useRef(false);
  const firstGround = useRef(false);
  const camPos = useRef(new THREE.Vector3());
  const tmp = useMemo(() => ({ dir: new THREE.Vector3(), target: new THREE.Vector3(), want: new THREE.Vector3() }), []);

  useEffect(() => () => {
    input.dispose();
    world.removeCharacterController(ctrl);
  }, [input, ctrl, world]);

  useFrame((state, rawDt) => {
    const b = body.current;
    if (!b) return;
    const dt = Math.min(rawDt, 1 / 20);
    const inp = input.update(state.clock.elapsedTime);
    if (playerState.locked) {
      inp.forward = 0;
      inp.right = 0;
      inp.jump = false;
    }
    if (inp.forward || inp.right) playerState.lastMoveAt = state.clock.elapsedTime;
    const speed = inp.sprint ? SPRINT : WALK;
    // Camera-relative move
    const fwd = new THREE.Vector3(-Math.sin(inp.yaw), 0, -Math.cos(inp.yaw));
    const right = new THREE.Vector3(-fwd.z, 0, fwd.x);
    tmp.dir.set(0, 0, 0).addScaledVector(fwd, inp.forward).addScaledVector(right, inp.right);
    if (tmp.dir.lengthSq() > 1) tmp.dir.normalize();
    if (grounded.current) {
      vy.current = inp.jump ? JUMP_V : -0.5;
    } else {
      vy.current -= GRAVITY * dt;
    }
    const collider = b.collider(0);
    ctrl.computeColliderMovement(collider, { x: tmp.dir.x * speed * dt, y: vy.current * dt, z: tmp.dir.z * speed * dt });
    const m = ctrl.computedMovement();
    const p = b.translation();
    const next = { x: p.x + m.x, y: p.y + m.y, z: p.z + m.z };
    // Fell out of the bubble: respawn.
    if (next.y < spawn.y - 8) {
      next.x = spawn.x; next.y = spawn.y; next.z = spawn.z; vy.current = 0;
    }
    b.setNextKinematicTranslation(next);
    grounded.current = ctrl.computedGrounded();
    playerState.pos.set(next.x, next.y, next.z);
    playerState.yaw = inp.yaw;
    playerState.grounded = grounded.current;
    if (grounded.current && !firstGround.current) {
      firstGround.current = true;
      mark("playerGrounded");
      onGrounded?.(new THREE.Vector3(next.x, next.y - HALF_HEIGHT - RADIUS, next.z));
    }
    // Third-person camera
    tmp.target.set(next.x, next.y + 0.35, next.z);
    const dist = 1.9;
    tmp.want.set(
      tmp.target.x + Math.sin(inp.yaw) * Math.cos(inp.pitch) * dist,
      tmp.target.y - Math.sin(inp.pitch) * dist,
      tmp.target.z + Math.cos(inp.yaw) * Math.cos(inp.pitch) * dist
    );
    if (camPos.current.lengthSq() === 0) camPos.current.copy(tmp.want);
    camPos.current.lerp(tmp.want, 1 - Math.pow(0.001, dt));
    state.camera.position.copy(camPos.current);
    state.camera.lookAt(tmp.target);
  });

  return (
    <RigidBody ref={body} type="kinematicPosition" colliders={false} position={spawn.toArray()} enabledRotations={[false, false, false]}>
      <CapsuleCollider args={[HALF_HEIGHT, RADIUS]} />
      <mesh castShadow>
        <capsuleGeometry args={[RADIUS, HALF_HEIGHT * 2, 6, 12]} />
        <meshStandardMaterial color="#d9a46b" roughness={0.9} />
      </mesh>
    </RigidBody>
  );
}

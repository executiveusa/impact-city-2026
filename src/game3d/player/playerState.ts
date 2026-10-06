import * as THREE from "three";

/** Per-frame player data shared outside React (written by the controller every frame). */
export const playerState = {
  pos: new THREE.Vector3(),
  yaw: 0,
  grounded: false,
  /** true while a DOM encounter overlay is open: movement is frozen. */
  locked: false,
  lastMoveAt: 0,
};

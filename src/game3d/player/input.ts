/** Keyboard + drag-to-orbit input, plus a scripted autopilot for the perf run. */
export interface InputState {
  forward: number;
  right: number;
  jump: boolean;
  sprint: boolean;
  yaw: number;
  pitch: number;
}

export function createInput(autopilot: boolean) {
  const keys = new Set<string>();
  const state: InputState = { forward: 0, right: 0, jump: false, sprint: false, yaw: 0, pitch: -0.25 };
  let dragging = false;
  const onKey = (e: KeyboardEvent) => {
    if (e.type === "keydown") keys.add(e.code);
    else keys.delete(e.code);
  };
  const onDown = () => (dragging = true);
  const onUp = () => (dragging = false);
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    state.yaw -= e.movementX * 0.004;
    state.pitch = Math.max(-1.1, Math.min(0.3, state.pitch - e.movementY * 0.003));
  };
  addEventListener("keydown", onKey);
  addEventListener("keyup", onKey);
  addEventListener("pointerdown", onDown);
  addEventListener("pointerup", onUp);
  addEventListener("pointermove", onMove);

  const update = (t: number) => {
    if (autopilot) {
      // Figure-eight walk with a jump every ~3 s and a slow camera orbit: exercises splat sorting from many angles.
      state.forward = 1;
      state.right = Math.sin(t * 0.6);
      state.jump = t % 3 < 0.05;
      state.sprint = false;
      state.yaw = t * 0.35;
      return state;
    }
    state.forward = (keys.has("KeyW") || keys.has("ArrowUp") ? 1 : 0) - (keys.has("KeyS") || keys.has("ArrowDown") ? 1 : 0);
    state.right = (keys.has("KeyD") || keys.has("ArrowRight") ? 1 : 0) - (keys.has("KeyA") || keys.has("ArrowLeft") ? 1 : 0);
    state.jump = keys.has("Space");
    state.sprint = keys.has("ShiftLeft") || keys.has("ShiftRight");
    return state;
  };
  const dispose = () => {
    removeEventListener("keydown", onKey);
    removeEventListener("keyup", onKey);
    removeEventListener("pointerdown", onDown);
    removeEventListener("pointerup", onUp);
    removeEventListener("pointermove", onMove);
  };
  return { state, update, dispose };
}

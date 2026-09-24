/** Keyboard + drag-to-orbit input, plus a scripted autopilot for the perf run. */
export interface InputState {
  forward: number;
  right: number;
  jump: boolean;
  sprint: boolean;
  yaw: number;
  pitch: number;
}

/** Written by the on-screen touch controls; merged with the keyboard every frame. */
export const touchInput = { forward: 0, right: 0, jump: false };

export function createInput(autopilot: boolean) {
  const keys = new Set<string>();
  const state: InputState = { forward: 0, right: 0, jump: false, sprint: false, yaw: 0, pitch: -0.25 };
  let dragging = false;
  const onKey = (e: KeyboardEvent) => {
    if (e.type === "keydown") keys.add(e.code);
    else keys.delete(e.code);
  };
  let lastX = 0;
  let lastY = 0;
  let dragId: number | null = null;
  const onDown = (e: PointerEvent) => {
    // Only drags that start on the 3D canvas turn the camera (not the joystick/buttons/panels).
    if ((e.target as HTMLElement)?.tagName !== "CANVAS") return;
    dragging = true;
    dragId = e.pointerId;
    lastX = e.clientX;
    lastY = e.clientY;
  };
  const onUp = (e: PointerEvent) => {
    if (e.pointerId === dragId) dragging = false;
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging || e.pointerId !== dragId) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    state.yaw -= dx * 0.005;
    state.pitch = Math.max(-1.1, Math.min(0.3, state.pitch - dy * 0.004));
  };
  addEventListener("keydown", onKey);
  addEventListener("keyup", onKey);
  addEventListener("pointerdown", onDown);
  addEventListener("pointerup", onUp);
  addEventListener("pointercancel", onUp);
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
    state.forward = Math.max(-1, Math.min(1, state.forward + touchInput.forward));
    state.right = Math.max(-1, Math.min(1, state.right + touchInput.right));
    state.jump = keys.has("Space") || touchInput.jump;
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

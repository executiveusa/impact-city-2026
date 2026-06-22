import { useCallback, useEffect, useState } from "react";
import { soundManager } from "./soundManager";
import type { SoundId } from "./soundManifest";

/**
 * useGameAudio — React hook binding for the singleton SoundManager.
 *
 * Provides play/startLoop/stopLoop plus reactive mute + volume state.
 * Resumes the AudioContext on first user gesture (autoplay-policy compliant).
 */
export function useGameAudio() {
  const [muted, setMutedState] = useState(soundManager.muted);
  const [volume, setVolumeState] = useState(soundManager.volume);

  // Resume audio on first pointer/keydown (autoplay policy).
  useEffect(() => {
    const resume = () => soundManager.resume();
    window.addEventListener("pointerdown", resume, { once: true });
    window.addEventListener("keydown", resume, { once: true });
    return () => {
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
    };
  }, []);

  const play = useCallback((id: SoundId) => soundManager.play(id), []);
  const startLoop = useCallback((id: SoundId) => soundManager.startLoop(id), []);
  const stopLoop = useCallback((id: SoundId) => soundManager.stopLoop(id), []);
  const setMuted = useCallback((m: boolean) => {
    soundManager.setMuted(m);
    setMutedState(m);
  }, []);
  const setVolume = useCallback((v: number) => {
    soundManager.setVolume(v);
    setVolumeState(v);
  }, []);
  const setReducedIntensity = useCallback(
    (on: boolean) => soundManager.setReducedIntensity(on),
    [],
  );

  return {
    muted,
    volume,
    play,
    startLoop,
    stopLoop,
    setMuted,
    setVolume,
    setReducedIntensity,
  };
}

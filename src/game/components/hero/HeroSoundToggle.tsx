import { useGameAudio } from "@/game/audio/useGameAudio";

/**
 * HeroSoundToggle — mute/volume control for the cinematic hero.
 * Floating, accessible, persists preference via the sound manager.
 * No autoplay: the manager only resumes on first user gesture.
 */
export function HeroSoundToggle() {
  const { muted, volume, setMuted, setVolume } = useGameAudio();
  return (
    <div className="ic-hero-sound" role="group" aria-label="Sound controls">
      <button
        type="button"
        className="ic-hero-sound__mute"
        aria-pressed={muted}
        aria-label={muted ? "Unmute sound" : "Mute sound"}
        onClick={() => {
          setMuted(!muted);
          if (muted) {
            // unmuting = resume audio on this gesture
          }
        }}
      >
        <span aria-hidden="true">{muted ? "🔇" : "🔊"}</span>
      </button>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(volume * 100)}
        onChange={(e) => setVolume(Number(e.target.value) / 100)}
        aria-label="Sound volume"
        className="ic-hero-sound__vol"
      />
    </div>
  );
}

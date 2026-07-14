import { useEffect, useState } from "react";
import { useGame } from "../state/GameContext";
import { OPENING_NARRATION } from "../data/dialogue";

/**
 * StoryIntro — a short cinematic text/comic sequence with simple animation.
 * Scene beats per spec §3.B. The whole sequence is skippable; on completion
 * the player lands in Rustgarden (hub). Subtitles are always on (a11y).
 *
 * Reduced-motion respect: when state.reducedMotion is on, beats do NOT
 * auto-advance — the player reads at their own pace and taps Continue.
 * (Previously this docstring claimed reduced-motion respect but the code
 * used a fixed 4200ms timer regardless. Fixed.)
 */
export function StoryIntro() {
  const { state, dispatch } = useGame();
  const [beat, setBeat] = useState(0);
  const total = OPENING_NARRATION.length;

  // Auto-advance each beat ONLY when reduced-motion is off. When it's on,
  // the player controls pacing via the Continue button (no timer).
  useEffect(() => {
    if (state.reducedMotion) return; // manual pacing
    if (beat >= total) return;
    const t = setTimeout(() => setBeat((b) => b + 1), 4200);
    return () => clearTimeout(t);
  }, [beat, total, state.reducedMotion]);

  const finish = () => dispatch({ type: "MARK_INTRO_SEEN" });

  return (
    <div className="ic-intro" role="region" aria-label="Story introduction">
      <div className="ic-intro__scene">
        {OPENING_NARRATION.slice(0, beat + 1).map((line, i) => (
          <p
            key={i}
            className={`ic-intro__line ${
              line.startsWith("“") ? "ic-intro__line--voice" : ""
            }`}
            aria-live="polite"
          >
            {line}
          </p>
        ))}
      </div>

      <div className="ic-intro__controls">
        <div className="ic-intro__progress" aria-hidden="true">
          {OPENING_NARRATION.map((_, i) => (
            <span
              key={i}
              className={`ic-dot ${i <= beat ? "ic-dot--on" : ""}`}
            />
          ))}
        </div>
        <div className="ic-intro__buttons">
          {beat < total - 1 ? (
            <>
              <button className="ic-btn ic-btn--ghost" onClick={() => setBeat(beat + 1)}>
                Continue
              </button>
              <button className="ic-btn ic-btn--link" onClick={finish}>
                Skip intro
              </button>
            </>
          ) : (
            <button className="ic-btn ic-btn--primary" onClick={finish}>
              Enter Rustgarden
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

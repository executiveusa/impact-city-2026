import { useGame } from "../state/GameContext";

/**
 * SettingsPanel — accessibility + UX flags (spec §8).
 *  - reduced motion
 *  - simple language mode
 *  - subtitles (always on by default; can be reaffirmed here)
 * Plus a (confirmable) reset-save action.
 */
export function SettingsPanel() {
  const { state, dispatch } = useGame();

  const Flag = ({
    flag,
    label,
    description,
  }: {
    flag: "reducedMotion" | "simpleLanguage" | "subtitles";
    label: string;
    description: string;
  }) => (
    <label className="ic-toggle">
      <input
        type="checkbox"
        checked={state[flag]}
        onChange={() => dispatch({ type: "TOGGLE_FLAG", flag })}
      />
      <span className="ic-toggle__text">
        <span className="ic-toggle__label">{label}</span>
        <span className="ic-toggle__desc">{description}</span>
      </span>
    </label>
  );

  return (
    <div className="ic-settings" role="region" aria-label="Settings">
      <h1 className="ic-display ic-display--sm">Settings</h1>

      <section className="ic-settings__group">
        <h2 className="ic-h2">Accessibility</h2>
        <Flag
          flag="reducedMotion"
          label="Reduced motion"
          description="Slow or remove animation. Always-safe for photosensitivity."
        />
        <Flag
          flag="subtitles"
          label="Subtitles"
          description="Subtitles are on by default. You can keep them on here."
        />
        <Flag
          flag="simpleLanguage"
          label="Simple language mode"
          description="Shorten codex text to plain, younger-reader wording."
        />
      </section>

      <section className="ic-settings__group">
        <h2 className="ic-h2">Save data</h2>
        <p className="ic-muted">
          Progress is stored in this browser only (localStorage).
        </p>
        <button
          className="ic-btn ic-btn--danger"
          onClick={() => {
            if (
              window.confirm(
                "Reset all progress? Missions, codex, and impact events will be cleared.",
              )
            ) {
              dispatch({ type: "RESET" });
            }
          }}
        >
          Reset progress
        </button>
      </section>

      <button
        className="ic-btn ic-btn--link"
        onClick={() => dispatch({ type: "SET_SCREEN", screen: "menu" })}
      >
        ← Back to menu
      </button>
    </div>
  );
}

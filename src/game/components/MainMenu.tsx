import { useGame } from "../state/GameContext";

/**
 * Main Menu — title screen with primary actions.
 * Visual tone: dark handcrafted city, glowing emerald code fragments,
 * broken skyline, hopeful plant growth breaking through concrete.
 */
export function MainMenu() {
  const { state, dispatch } = useGame();
  const hasProgress = state.completedMissionIds.length > 0 || state.introSeen;

  return (
    <div className="ic-menu">
      <div className="ic-menu__skyline" aria-hidden="true" />
      <div className="ic-menu__growth" aria-hidden="true" />

      <header className="ic-menu__title">
        <p className="ic-eyebrow">Impact City</p>
        <h1 className="ic-display">The Emerald Algorithm</h1>
        <p className="ic-subtitle">
          Earth, 2056. A boy named Thomas. A signal no machine can erase.
        </p>
      </header>

      <nav className="ic-menu__actions" aria-label="Main menu">
        <button
          className="ic-btn ic-btn--primary"
          onClick={() =>
            dispatch({
              type: "SET_SCREEN",
              screen: hasProgress ? "hub" : "intro",
            })
          }
        >
          {hasProgress ? "Continue" : "Start Mission"}
        </button>
        <button
          className="ic-btn ic-btn--ghost"
          onClick={() => dispatch({ type: "SET_SCREEN", screen: "dashboard" })}
        >
          Impact Dashboard
        </button>
        <button
          className="ic-btn ic-btn--ghost"
          onClick={() => dispatch({ type: "SET_SCREEN", screen: "codex" })}
        >
          Codex
        </button>
        <button
          className="ic-btn ic-btn--ghost"
          onClick={() => dispatch({ type: "SET_SCREEN", screen: "settings" })}
        >
          Settings
        </button>
      </nav>

      <footer className="ic-menu__footer">
        <p>
          Nonviolent · Educational · Impact-linked. All impact events in this
          prototype are <strong>simulated</strong>.
        </p>
      </footer>
    </div>
  );
}

import { useGame } from "../state/GameContext";
import { summarizeImpact } from "../systems/impactEngine";
import { MISSION_ORDER } from "../types";

/**
 * ResourceBar — always-visible HUD for currencies + progress.
 * Shows: Civic Trust, Scrap, Impact Points, Missions completed, current Tablet.
 */
export function ResourceBar() {
  const { state, dispatch } = useGame();
  const summary = summarizeImpact(state.impactEvents);
  const consent = state.unlockedTablets.includes("consent");

  return (
    <header className="ic-resourcebar" role="banner">
      <button
        className="ic-resourcebar__logo"
        onClick={() => dispatch({ type: "SET_SCREEN", screen: "menu" })}
        aria-label="Return to main menu"
      >
        ◈ Impact City
      </button>

      <ul className="ic-resourcebar__stats" aria-label="Player resources">
        <li className="ic-stat" title="Civic Trust — earned only by missions; never bought.">
          <span className="ic-stat__icon" aria-hidden="true">🜨</span>
          <span className="ic-stat__label">Civic Trust</span>
          <span className="ic-stat__value">{state.civicTrust}</span>
        </li>
        <li className="ic-stat" title="Scrap — soft resource from exploration; used to rebuild.">
          <span className="ic-stat__icon" aria-hidden="true">⚙</span>
          <span className="ic-stat__label">Scrap</span>
          <span className="ic-stat__value">{state.scrap}</span>
        </li>
        <li className="ic-stat" title="Impact Points — total positive impact generated.">
          <span className="ic-stat__icon" aria-hidden="true">✦</span>
          <span className="ic-stat__label">Impact</span>
          <span className="ic-stat__value">{summary.totalImpactPoints}</span>
        </li>
        <li className="ic-stat" title="Missions completed.">
          <span className="ic-stat__icon" aria-hidden="true">◆</span>
          <span className="ic-stat__label">Missions</span>
          <span className="ic-stat__value">
            {state.completedMissionIds.length}/{MISSION_ORDER.length}
          </span>
        </li>
        <li
          className={`ic-stat ${consent ? "" : "ic-stat--locked"}`}
          title="Emerald Tablet recovered: Consent."
        >
          <span className="ic-stat__icon" aria-hidden="true">🕮</span>
          <span className="ic-stat__label">Tablet</span>
          <span className="ic-stat__value">{consent ? "Consent" : "—"}</span>
        </li>
      </ul>
    </header>
  );
}

import type { Mission } from "../types";
import { useGame } from "../state/GameContext";
import { CODEX_BY_ID } from "../data/codex";
import { summarizeImpact } from "../systems/impactEngine";

/**
 * MissionComplete — success screen. Shows the story beat, the rewards, the
 * impact events recorded, and the codex entries unlocked.
 *
 * Note: the actual state mutation (COMPLETE_MISSION) is triggered by the
 * "Continue" button so the rewards + impact events land in one atomic update.
 */
export function MissionComplete({
  mission,
  onComplete,
  onLeave,
}: {
  mission: Mission;
  onComplete: () => void;
  onLeave: () => void;
}) {
  const { state } = useGame();
  const before = summarizeImpact(state.impactEvents).totalImpactPoints;
  const gained = mission.impactEvents.reduce((s, e) => s + e.impactPoints, 0);

  return (
    <div className="ic-complete" role="region" aria-label="Mission complete">
      <p className="ic-eyebrow">Mission complete</p>
      <h1 className="ic-display ic-display--md">{mission.title}</h1>
      <p className="ic-complete__line">{mission.successLine}</p>

      <ul className="ic-complete__rewards" aria-label="Rewards earned">
        <li>+{mission.rewards.civicTrust} Civic Trust</li>
        <li>+{mission.rewards.scrap} Scrap</li>
        <li>+{gained} Impact Points</li>
        {mission.rewards.tabletUnlock && (
          <li className="ic-complete__tablet">📚 Emerald Tablet: {mission.rewards.tabletUnlock}</li>
        )}
      </ul>

      {mission.rewards.codexUnlocks.length > 0 && (
        <section className="ic-complete__codex">
          <h2 className="ic-h2">Codex unlocked</h2>
          <ul>
            {mission.rewards.codexUnlocks.map((id) => (
              <li key={id}>{CODEX_BY_ID[id]?.title ?? id}</li>
            ))}
          </ul>
        </section>
      )}

      <p className="ic-muted ic-complete__impact-note">
        Impact points earned: {gained}. Total before this mission: {before}.
        All events are recorded as <strong>simulated</strong> in this prototype.
      </p>

      <div className="ic-complete__buttons">
        <button className="ic-btn ic-btn--primary" onClick={onComplete}>
          Continue
        </button>
        <button className="ic-btn ic-btn--link" onClick={onLeave}>
          Leave for now
        </button>
      </div>
    </div>
  );
}

import type { Mission } from "../types";
import { useGame } from "../state/GameContext";

/**
 * ObjectiveTracker — pinned panel showing the current mission context.
 *
 * Note: the live in-mission step lives in MissionRunner's local state and
 * isn't lifted to the global save (it resets cleanly on re-entry). This panel
 * therefore shows the mission's threat and total objective count rather than
 * a potentially stale "current step" number.
 */
export function ObjectiveTracker({ mission }: { mission: Mission }) {
  const { state } = useGame();
  const alreadyDone = state.completedMissionIds.includes(mission.id);

  return (
    <aside className="ic-objective" aria-label="Current objective">
      <p className="ic-objective__kicker">{mission.district}</p>
      <h2 className="ic-objective__title">{mission.title}</h2>
      <p className="ic-objective__threat">{mission.aiThreat}</p>
      <p className="ic-objective__progress">
        {alreadyDone
          ? "Reviewing completed mission"
          : `${mission.objectives.length} objectives to resolve`}
      </p>
    </aside>
  );
}

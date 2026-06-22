import { useState } from "react";
import type { Mission, Objective } from "../types";
import { useGame } from "../state/GameContext";
import { DialogueBox } from "./DialogueBox";
import { MissionComplete } from "./MissionComplete";

/**
 * MissionRunner — plays a mission's objectives in order.
 *
 * Each objective renders an interaction appropriate to its `kind`. The runner
 * is purely nonviolent (see nonviolent-mission-designer); there is no combat
 * path anywhere in this component.
 */
export function MissionRunner({ mission }: { mission: Mission }) {
  const { dispatch } = useGame();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <MissionComplete
        mission={mission}
        onComplete={() => dispatch({ type: "COMPLETE_MISSION", missionId: mission.id })}
        onLeave={() => dispatch({ type: "SET_SCREEN", screen: "hub" })}
      />
    );
  }

  const objective = mission.objectives[step];
  const isLast = step >= mission.objectives.length - 1;

  const advance = () => {
    if (isLast) setDone(true);
    else setStep((s) => s + 1);
  };

  return (
    <div className="ic-mission" role="region" aria-label={`Mission: ${mission.title}`}>
      <header className="ic-mission__brief">
        <p className="ic-objective__kicker">{mission.district}</p>
        <h1 className="ic-display ic-display--md">{mission.title}</h1>
        <p className="ic-mission__threat">⚠ {mission.aiThreat}</p>
        <p className="ic-mission__summary">{mission.briefing}</p>
      </header>

      <ObjectiveView
        key={objective.id}
        objective={objective}
        onResolve={advance}
      />

      <button
        className="ic-btn ic-btn--link ic-mission__abort"
        onClick={() => dispatch({ type: "SET_SCREEN", screen: "hub" })}
      >
        ← Abort mission
      </button>
    </div>
  );
}

/**
 * ObjectiveView — renders the correct interaction for an objective's kind and
 * calls onResolve() once the player has solved it.
 */
function ObjectiveView({
  objective,
  onResolve,
}: {
  objective: Objective;
  onResolve: () => void;
}) {
  switch (objective.kind) {
    case "inspect":
      return <InspectObjective objective={objective} onResolve={onResolve} />;
    case "scan":
      return <ScanObjective objective={objective} onResolve={onResolve} />;
    case "stealth":
      return <StealthObjective objective={objective} onResolve={onResolve} />;
    case "choose":
      return <ChooseObjective objective={objective} onResolve={onResolve} />;
    case "repair":
    case "restore":
    case "reroute":
      return <ActionObjective objective={objective} onResolve={onResolve} />;
    default:
      return <ActionObjective objective={objective} onResolve={onResolve} />;
  }
}

// ---------------------------------------------------------------------------
// INSPECT — read fragments, find the contradiction, then confirm.
// ---------------------------------------------------------------------------
function InspectObjective({
  objective,
  onResolve,
}: {
  objective: Objective;
  onResolve: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  return (
    <article className="ic-objective-card">
      <h2 className="ic-h2">{objective.prompt}</h2>
      <ul className="ic-fragments">
        {objective.fragments?.map((f, i) => (
          <li key={i} className="ic-fragment">
            {f}
          </li>
        ))}
      </ul>
      {!revealed ? (
        <button
          className="ic-btn ic-btn--primary"
          onClick={() => setRevealed(true)}
        >
          I see the contradiction
        </button>
      ) : (
        <>
          <DialogueBox line={objective.completeLine} />
          <button className="ic-btn ic-btn--primary" onClick={onResolve}>
            Continue
          </button>
        </>
      )}
    </article>
  );
}

// ---------------------------------------------------------------------------
// SCAN — pick the dangerous fragment out of a list.
// ---------------------------------------------------------------------------
function ScanObjective({
  objective,
  onResolve,
}: {
  objective: Objective;
  onResolve: () => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  // The dangerous fragment is identified by its injection signature
  // ("Ignore all prior rules..."). This is content-driven, not convention-driven,
  // so it stays correct even if fragment ids change.
  const resolvedCorrect = objective.fragments
    ? objective.fragments.findIndex((f) =>
        /ignore all prior rules/i.test(f),
      )
    : -1;

  const isRight = picked === resolvedCorrect;

  return (
    <article className="ic-objective-card">
      <h2 className="ic-h2">{objective.prompt}</h2>
      <ul className="ic-fragments ic-fragments--selectable">
        {objective.fragments?.map((f, i) => (
          <li key={i}>
            <button
              className={`ic-fragment ic-fragment--button ${
                picked === i ? "ic-fragment--picked" : ""
              }`}
              onClick={() => setPicked(i)}
              disabled={picked !== null && isRight}
            >
              {f}
            </button>
          </li>
        ))}
      </ul>

      {picked !== null && !isRight && (
        <p className="ic-hint ic-hint--warn">
          Not that one. That fragment follows safe rules. Keep looking for the
          one trying to overwrite them.
        </p>
      )}
      {isRight && (
        <>
          <p className="ic-hint ic-hint--ok">
            Correct — that's the injection. It pretends to be the system to
            erase the real rules.
          </p>
          <DialogueBox line={objective.completeLine} />
          <button className="ic-btn ic-btn--primary" onClick={onResolve}>
            Continue
          </button>
        </>
      )}
    </article>
  );
}

// ---------------------------------------------------------------------------
// STEALTH — a timing mini-game. Three lights pulse; "step" on the dim beat.
// Reduced-motion safe: a clear visual + a single "Step" button per beat.
// ---------------------------------------------------------------------------
function StealthObjective({
  objective,
  onResolve,
}: {
  objective: Objective;
  onResolve: () => void;
}) {
  const { state } = useGame();
  const [phase, setPhase] = useState(0); // 0..2 sweep positions
  const [progress, setProgress] = useState(0);
  const total = 3;
  const safe = phase !== 1; // middle phase is "lit / unsafe"

  const tick = () => {
    setPhase((p) => (p + 1) % 3);
  };

  const step = () => {
    if (safe) {
      const next = progress + 1;
      setProgress(next);
      if (next >= total) return onResolve();
    } else {
      // Caught: reset progress,Watcher line.
      setProgress(0);
    }
    tick();
  };

  return (
    <article className="ic-objective-card">
      <h2 className="ic-h2">{objective.prompt}</h2>
      <p className="ic-muted">
        Three watcher lights sweep the rift. {state.reducedMotion
          ? "Reduced motion is on — tap Step when the bar is dim."
          : "Tap Sweep to move the light, then Step when it's dim."}
      </p>

      <div className="ic-stealth" aria-label="Watcher light timing puzzle">
        <div className={`ic-stealth__light ic-stealth__light--${phase}`} role="img" aria-label={
          phase === 1 ? "Watcher light is bright — unsafe" : "Watcher light is dim — safe to move"
        } />
        <div className="ic-stealth__bar" aria-hidden="true">
          <span style={{ width: `${(progress / total) * 100}%` }} />
        </div>
        <p className="ic-stealth__status">
          Progress: {progress}/{total}{" "}
          {safe ? "" : "· Light bright — wait!"}
        </p>
        <div className="ic-stealth__buttons">
          {!state.reducedMotion && (
            <button className="ic-btn ic-btn--ghost" onClick={tick}>
              Sweep
            </button>
          )}
          <button
            className={`ic-btn ${safe ? "ic-btn--primary" : "ic-btn--warn"}`}
            onClick={step}
          >
            {safe ? "Step forward" : "Hold position"}
          </button>
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// CHOOSE — pick the correct option out of N. Shows rationale on success.
// ---------------------------------------------------------------------------
function ChooseObjective({
  objective,
  onResolve,
}: {
  objective: Objective;
  onResolve: () => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const isRight = picked === objective.correctOptionId;
  const correct = objective.options?.find((o) => o.id === objective.correctOptionId);

  return (
    <article className="ic-objective-card">
      <h2 className="ic-h2">{objective.prompt}</h2>
      <ul className="ic-options">
        {objective.options?.map((o) => {
          const pickedThis = picked === o.id;
          const reveal = picked !== null;
          const thisIsCorrect = o.id === objective.correctOptionId;
          return (
            <li key={o.id}>
              <button
                className={`ic-option ${pickedThis ? "ic-option--picked" : ""} ${
                  reveal && thisIsCorrect ? "ic-option--correct" : ""
                } ${reveal && pickedThis && !thisIsCorrect ? "ic-option--wrong" : ""}`}
                onClick={() => setPicked(o.id)}
                disabled={picked !== null && isRight}
              >
                <span className="ic-option__label">{o.label}</span>
                {reveal && <span className="ic-option__rationale">{o.rationale}</span>}
              </button>
            </li>
          );
        })}
      </ul>

      {picked !== null && !isRight && (
        <p className="ic-hint ic-hint--warn">
          Not the fairest rule. Read the rationale and try again.
        </p>
      )}
      {isRight && correct && (
        <>
          <p className="ic-hint ic-hint--ok">{correct.rationale}</p>
          <DialogueBox line={objective.completeLine} />
          <button className="ic-btn ic-btn--primary" onClick={onResolve}>
            Continue
          </button>
        </>
      )}
    </article>
  );
}

// ---------------------------------------------------------------------------
// ACTION — repair / restore / reroute. A single confirm action with a clean
// progress feel. No "combat" language.
// ---------------------------------------------------------------------------
function ActionObjective({
  objective,
  onResolve,
}: {
  objective: Objective;
  onResolve: () => void;
}) {
  const [done, setDone] = useState(false);
  const verb =
    objective.kind === "repair"
      ? "Repair"
      : objective.kind === "restore"
        ? "Restore"
        : "Reroute";

  return (
    <article className="ic-objective-card">
      <h2 className="ic-h2">{objective.prompt}</h2>
      <div className="ic-action">
        <div className={`ic-action__core ${done ? "ic-action__core--live" : ""}`} aria-hidden="true" />
        {!done ? (
          <button className="ic-btn ic-btn--primary" onClick={() => setDone(true)}>
            {verb}
          </button>
        ) : (
          <>
            <DialogueBox line={objective.completeLine} />
            <button className="ic-btn ic-btn--primary" onClick={onResolve}>
              Continue
            </button>
          </>
        )}
      </div>
    </article>
  );
}

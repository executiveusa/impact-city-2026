import { useGame } from "../state/GameContext";
import { summarizeImpact, CAUSE_LABELS, STATUS_LABELS } from "../systems/impactEngine";
import type { RealWorldCause } from "../types";

/**
 * ImpactDashboard — transparent totals + recent events + the simulated-only
 * disclosure (acceptance criterion #16).
 */
export function ImpactDashboard() {
  const { state, dispatch } = useGame();
  const s = summarizeImpact(state.impactEvents);
  const causeOrder: RealWorldCause[] = ["food", "water", "energy", "shelter", "education"];

  return (
    <div className="ic-dashboard" role="region" aria-label="Impact dashboard">
      <header className="ic-dashboard__header">
        <h1 className="ic-display ic-display--md">Impact Dashboard</h1>
        <p className="ic-muted">
          Every rebuild action in Impact City is designed to connect gameplay to
          real-world restoration. In this MVP, impact is <strong>simulated</strong>{" "}
          or test-mode. In production, verified purchases and donations will route
          through transparent nonprofit or social-impact partners.
        </p>
      </header>

      <section className="ic-dashboard__totals" aria-label="Impact totals">
        <Stat label="Total Impact Points" value={s.totalImpactPoints} />
        <Stat label="Missions Completed" value={s.missionsCompleted} />
        <Stat label="Assets Rebuilt" value={s.assetsRebuilt} />
        <Stat
          label="Simulated $ Routed"
          value={`$${s.simulatedDollarsRouted.toFixed(2)}`}
        />
      </section>

      <section className="ic-dashboard__causes" aria-label="Causes supported">
        <h2 className="ic-h2">Causes supported</h2>
        <ul className="ic-causes">
          {causeOrder.map((c) => (
            <li key={c} className="ic-cause">
              <span className="ic-cause__label">{CAUSE_LABELS[c]}</span>
              <span className="ic-cause__value">{s.causesSupported[c]} pts</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="ic-dashboard__events" aria-label="Recent impact events">
        <h2 className="ic-h2">Recent impact events</h2>
        {s.recentEvents.length === 0 ? (
          <p className="ic-muted">No events yet. Complete a mission to begin.</p>
        ) : (
          <ul className="ic-events">
            {s.recentEvents.map((e) => (
              <li key={e.id} className="ic-event">
                <span className={`ic-event__status ic-event__status--${e.status}`}>
                  {STATUS_LABELS[e.status]}
                </span>
                <span className="ic-event__type">{e.actionType.replace(/_/g, " ")}</span>
                <span className="ic-event__cause">{CAUSE_LABELS[e.realWorldCause]}</span>
                <span className="ic-event__points">+{e.impactPoints}</span>
                {e.amountCents ? (
                  <span className="ic-event__amount">
                    ${e.amountCents / 100} simulated
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
        <p className="ic-muted ic-small">
          MVP impact events are simulated until payment and partner verification
          are connected.
        </p>
      </section>

      <button
        className="ic-btn ic-btn--link"
        onClick={() => dispatch({ type: "SET_SCREEN", screen: state.introSeen ? "hub" : "menu" })}
      >
        ← Back
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="ic-stat-card">
      <span className="ic-stat-card__value">{value}</span>
      <span className="ic-stat-card__label">{label}</span>
    </div>
  );
}

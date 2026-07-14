import { useGame } from "../state/GameContext";
import { MISSION_ORDER } from "../types";
import { summarizeImpact } from "../systems/impactEngine";
import { REBUILD_ASSET_BY_ID } from "../data/rebuildAssets";
import { CharacterPortrait } from "./CharacterPortrait";

/**
 * MissionFinale — the end-of-demo climax screen.
 *
 * Fires after the player has: (1) completed all 3 missions AND (2) purchased
 * at least one rebuild asset. This is the resolution the demo was missing —
 * without it, completing mission 3 dumped the player into the Rebuild shed
 * with no ending, no emotional payoff, no call-to-action.
 *
 * The finale is honest: it celebrates what the player did in the demo, names
 * the seven Tablets still hidden (the roadmap), and routes them to either
 * replay or the landing page (for the funder pitch CTA). It is not a "you
 * won" screen — it's a "this is what you started" screen.
 */
export function MissionFinale() {
  const { state, dispatch } = useGame();
  const summary = summarizeImpact(state.impactEvents);
  const rebuiltAssets = state.rebuiltAssetIds
    .map((id) => REBUILD_ASSET_BY_ID[id])
    .filter(Boolean);

  const tabletOrder: { id: string; name: string; unlocked: boolean }[] = [
    { id: "consent", name: "Consent", unlocked: true },
    { id: "transparency", name: "Transparency", unlocked: false },
    { id: "accountability", name: "Accountability", unlocked: false },
    { id: "privacy", name: "Privacy", unlocked: false },
    { id: "plurality", name: "Plurality", unlocked: false },
    { id: "regeneration", name: "Regeneration", unlocked: false },
    { id: "community", name: "Community", unlocked: false },
    { id: "human_override", name: "Human Override", unlocked: false },
  ];

  return (
    <div className="ic-finale" role="region" aria-label="Demo finale">
      <div className="ic-finale__heroes" aria-hidden="true">
        <CharacterPortrait id="thomas" size="lg" />
        <CharacterPortrait id="cosmos" size="lg" />
      </div>

      <p className="ic-eyebrow ic-finale__eyebrow">The First Tablet is recovered</p>
      <h1 className="ic-display ic-display--lg ic-finale__title">
        The algorithm remembers.
      </h1>

      <p className="ic-finale__lead">
        Thomas holds the First Tablet — Consent — and it flares emerald in the
        Rustgarden dawn. Seven Tablets remain hidden across the districts.
        The Warden Stack is watching. And somewhere, in a signal no machine can
        erase, a voice that was ignored is finally being heard.
      </p>

      <section className="ic-finale__stats" aria-label="What you accomplished">
        <h2 className="ic-h2">What you did in this demo</h2>
        <ul className="ic-finale__stats-list">
          <li>
            <span className="ic-finale__stat-num">{MISSION_ORDER.length}</span>
            <span className="ic-finale__stat-label">AI-safety missions taught</span>
          </li>
          <li>
            <span className="ic-finale__stat-num">{summary.totalImpactPoints}</span>
            <span className="ic-finale__stat-label">impact points earned (simulated)</span>
          </li>
          <li>
            <span className="ic-finale__stat-num">{rebuiltAssets.length}</span>
            <span className="ic-finale__stat-label">community assets rebuilt</span>
          </li>
        </ul>

        {rebuiltAssets.length > 0 && (
          <p className="ic-finale__assets">
            You rebuilt: {rebuiltAssets.map((a) => a.name).join(", ")}.
          </p>
        )}
      </section>

      <section className="ic-finale__tablets" aria-label="The Eight Tablets">
        <h2 className="ic-h2">The Eight Emerald Tablets</h2>
        <p className="ic-muted">
          One is recovered. Seven are still hidden. Each is a real AI-safety
          protocol, disguised as myth by Dr. Frankenstack before the Warden
          Stack could erase it.
        </p>
        <ul className="ic-finale__tablet-grid">
          {tabletOrder.map((t) => (
            <li
              key={t.id}
              className={`ic-finale__tablet ${
                t.unlocked ? "ic-finale__tablet--on" : "ic-finale__tablet--locked"
              }`}
            >
              <span className="ic-finale__tablet-glyph">
                {t.unlocked ? "🕮" : "🔒"}
              </span>
              <span className="ic-finale__tablet-name">{t.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="ic-finale__cassandra" aria-label="Frankenstack's closing word">
        <CharacterPortrait id="frankenstack" size="md" />
        <blockquote className="ic-finale__quote">
          “You found the first shard. You proved consent still means something.
          Now teach the others. The algorithm only works if people remember
          what the machines want them to forget.”
          <cite>— Dr. Elias Frankenstack (recorded, half-static)</cite>
        </blockquote>
      </section>

      <div className="ic-finale__buttons">
        <button
          className="ic-btn ic-btn--primary"
          onClick={() => dispatch({ type: "SET_SCREEN", screen: "hub" })}
        >
          Return to Rustgarden
        </button>
        <button
          className="ic-btn ic-btn--ghost"
          onClick={() => dispatch({ type: "RESET" })}
        >
          Start over
        </button>
      </div>

      <p className="ic-muted ic-finale__disclosure">
        This is a prototype. All impact events are <strong>simulated</strong>.
        Impact City is a Seattle 501(c)(3) project teaching real AI-safety
        concepts through play.
      </p>
    </div>
  );
}

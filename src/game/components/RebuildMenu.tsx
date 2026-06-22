import { useGame } from "../state/GameContext";
import { REBUILD_ASSETS } from "../data/rebuildAssets";
import { CAUSE_LABELS, FUND_SPLIT } from "../systems/impactEngine";

/**
 * RebuildMenu — spend Scrap on community assets that map to real-world causes.
 *
 * MVP invariant: every purchase is SIMULATED. No real money is taken.
 * The fund-split is shown transparently so players see how a real purchase
 * would route (spec §3.G).
 */
export function RebuildMenu() {
  const { state, dispatch } = useGame();
  const consentUnlocked = state.unlockedTablets.includes("consent");

  if (!consentUnlocked) {
    return (
      <div className="ic-rebuild" role="region" aria-label="Rebuild shed">
        <h1 className="ic-display ic-display--md">Rebuild Shed</h1>
        <p className="ic-muted">
          The shed is sealed. It opens once you recover the First Tablet — Consent.
        </p>
        <button
          className="ic-btn ic-btn--link"
          onClick={() => dispatch({ type: "SET_SCREEN", screen: "hub" })}
        >
          ← Back to Rustgarden
        </button>
      </div>
    );
  }

  return (
    <div className="ic-rebuild" role="region" aria-label="Rebuild shed">
      <header className="ic-rebuild__header">
        <h1 className="ic-display ic-display--md">Rebuild Shed</h1>
        <p className="ic-muted">
          Turn Scrap into restored community assets. Each maps to a real-world
          cause. All funding in this prototype is <strong>simulated</strong>.
        </p>
        <p className="ic-rebuild__wallet">
          Scrap on hand: <strong>{state.scrap}</strong> · Civic Trust:{" "}
          <strong>{state.civicTrust}</strong>
        </p>
      </header>

      <ul className="ic-rebuild__grid">
        {REBUILD_ASSETS.map((a) => {
          const owned = state.rebuiltAssetIds.includes(a.id);
          const canAfford = state.scrap >= a.scrapCost;
          const trusted = state.civicTrust >= a.civicTrustRequired;
          const actionable = !owned && canAfford && trusted;
          return (
            <li key={a.id} className={`ic-asset ${owned ? "ic-asset--owned" : ""}`}>
              <h2 className="ic-asset__name">{a.name}</h2>
              <p className="ic-asset__cause">{CAUSE_LABELS[a.realWorldCause]} cause</p>
              <p className="ic-asset__desc">{a.description}</p>
              <p className="ic-asset__realworld">
                Real-world equivalent: {a.realWorldEquivalent}
              </p>
              <dl className="ic-asset__stats">
                <div><dt>Scrap cost</dt><dd>{a.scrapCost}</dd></div>
                <div><dt>Impact points</dt><dd>+{a.impactPoints}</dd></div>
                <div><dt>Simulated fund</dt><dd>${(a.simulatedAmountCents / 100).toFixed(2)}</dd></div>
              </dl>
              {owned ? (
                <p className="ic-asset__owned">✓ Rebuilt</p>
              ) : (
                <button
                  className="ic-btn ic-btn--primary"
                  disabled={!actionable}
                  onClick={() => dispatch({ type: "REBUILD_ASSET", assetId: a.id })}
                  title={
                    !trusted
                      ? `Requires Civic Trust ${a.civicTrustRequired}`
                      : !canAfford
                        ? `Needs ${a.scrapCost} Scrap`
                        : "Rebuild this asset"
                  }
                >
                  Rebuild
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <section className="ic-rebuild__split" aria-label="How a real purchase would route">
        <h2 className="ic-h2">How this becomes real</h2>
        <p className="ic-muted">
          In production, a verified purchase would split like this (configurable):
        </p>
        <ul>
          <li>{Math.round(FUND_SPLIT.impactVault * 100)}% → real-world impact vault</li>
          <li>{Math.round(FUND_SPLIT.operations * 100)}% → game operations</li>
          <li>{Math.round(FUND_SPLIT.creators * 100)}% → creator / community rewards</li>
        </ul>
        <p className="ic-muted ic-small">
          MVP impact events are simulated until payment and partner verification
          are connected. Nothing here claims real-world delivery.
        </p>
      </section>

      <button
        className="ic-btn ic-btn--link"
        onClick={() => dispatch({ type: "SET_SCREEN", screen: "hub" })}
      >
        ← Back to Rustgarden
      </button>
    </div>
  );
}

/**
 * ImpactRoadmap — replaces the single "simulated" disclaimer with a clear
 * production roadmap. Solves Gap 3: turns honesty from a limitation into a plan.
 *
 * Shows: where the money goes today (simulated) → what becomes real (the
 * production path: Stripe → verified partner → public ledger).
 */
export function ImpactRoadmap() {
  return (
    <section className="ic-roadmap" aria-labelledby="ic-roadmap-title">
      <h2 id="ic-roadmap-title" className="ic-h2">
        How play becomes real impact
      </h2>
      <p className="ic-muted ic-roadmap__intro">
        We believe impact claims should be verifiable, not vibes. Here's exactly
        how it works — and what's real today vs. what unlocks as we grow.
      </p>

      <div className="ic-roadmap__track">
        <div className="ic-roadmap__step ic-roadmap__step--now">
          <span className="ic-roadmap__badge ic-roadmap__badge--now">Now</span>
          <h3 className="ic-roadmap__step-title">In the prototype</h3>
          <p>
            Every mission and rebuild logs a <strong>simulated</strong> impact event.
            No real money moves yet. The dashboard is real, the totals are real —
            the donations themselves are labeled simulated until a partner is wired in.
          </p>
        </div>

        <div className="ic-roadmap__connector" aria-hidden="true" />

        <div className="ic-roadmap__step ic-roadmap__step--next">
          <span className="ic-roadmap__badge ic-roadmap__badge--next">Next</span>
          <h3 className="ic-roadmap__step-title">Verified partners</h3>
          <p>
            We connect to vetted nonprofit partners (food banks, clean-water orgs,
            AI-literacy programs). Each cause category maps to one real recipient.
          </p>
        </div>

        <div className="ic-roadmap__connector" aria-hidden="true" />

        <div className="ic-roadmap__step ic-roadmap__step--future">
          <span className="ic-roadmap__badge ic-roadmap__badge--future">Goal</span>
          <h3 className="ic-roadmap__step-title">Public ledger</h3>
          <p>
            Every verified donation gets a traceable record — parent sees it,
            kid sees it, anyone can audit it. No "trust us," just "check the log."
          </p>
        </div>
      </div>

      <p className="ic-muted ic-small ic-roadmap__honesty">
        We will never claim verified impact before it exists. If a total says
        "simulated," it means simulated. That's a promise, not a disclaimer.
      </p>
    </section>
  );
}

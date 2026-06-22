/**
 * WhatIsThisStrip — the 3-beat explainer that sits under the hero.
 * Solves Gap 1: a stranger who opens the link must understand what this is
 * in under 30 seconds, without scrolling through a wall of text.
 *
 * Three beats: (1) what kids learn (2) what missions fund (3) who built it.
 */
export function WhatIsThisStrip() {
  return (
    <section className="ic-what" aria-label="What is Impact City?">
      <ul className="ic-what__grid">
        <li className="ic-what__card">
          <span className="ic-what__icon" aria-hidden="true">🛡</span>
          <h3 className="ic-what__title">Kids learn real AI safety</h3>
          <p className="ic-what__body">
            Every mission teaches a real AI-risk concept — bias, prompt injection,
            surveillance, excessive agency, loss of purpose — drawn from the actual
            AI-safety field (NIST, OWASP, Bostrom, Russell, Christian).
          </p>
        </li>
        <li className="ic-what__card">
          <span className="ic-what__icon" aria-hidden="true">🌱</span>
          <h3 className="ic-what__title">Play funds real-world impact</h3>
          <p className="ic-what__body">
            Every rebuilt asset connects to a real cause — food, water, energy,
            shelter, education. The impact dashboard shows where the money goes.
            <span className="ic-what__sim"> Prototype impact is simulated; production routes through verified partners.</span>
          </p>
        </li>
        <li className="ic-what__card">
          <span className="ic-what__icon" aria-hidden="true">🏛</span>
          <h3 className="ic-what__title">Built by a Seattle 501(c)(3)</h3>
          <p className="ic-what__body">
            Impact City is a non-profit project, not a company. All revenue routes
            to mission work, transparently tracked. Built for schools, libraries,
            and families — not for ad clicks.
          </p>
        </li>
      </ul>
    </section>
  );
}

import { CHARACTERS } from "@/game/data/characters";

/**
 * ThomasCosmosHero — the "Meet Thomas & Cosmos" character showcase section.
 * Renders canon data from characters.ts. CSS-drawn portraits (no binary art).
 */
export function ThomasCosmosHero() {
  return (
    <section id="characters" className="ic-characters" aria-labelledby="ic-characters-title">
      <h2 id="ic-characters-title" className="ic-h2">
        The heroes of Rustgarden
      </h2>
      <div className="ic-characters__grid">
        {CHARACTERS.map((c) => (
          <article key={c.id} className={`ic-character ic-character--${c.id}`}>
            <div
              className={`ic-character__portrait ic-character__portrait--${c.id}`}
              aria-hidden="true"
            />
            <header className="ic-character__head">
              <h3 className="ic-character__name">{c.name}</h3>
              <p className="ic-character__role">{c.role}</p>
              <p className="ic-character__tagline">“{c.tagline}”</p>
            </header>
            <p className="ic-character__desc">{c.description}</p>
            <details className="ic-character__details">
              <summary>Appearance</summary>
              <ul>
                {c.appearance.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </details>
            <details className="ic-character__details">
              <summary>Personality</summary>
              <ul>
                {c.personality.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </details>
            <p className="ic-character__voice">
              <strong>Voice:</strong> {c.voiceGuide}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { CHARACTERS } from "@/game/data/characters";

/**
 * ThomasCosmosHero — full-page character section with real portrait image slots.
 *
 * Checks for generated portraits at:
 *  /assets/impact-city/characters/thomas/thomas-portrait.png
 *  /assets/impact-city/characters/cosmos/cosmos-portrait.png
 *
 * Falls back to CSS-drawn portraits if images don't exist yet.
 * See docs/prompts/hero-character-image-prompts.md
 */

function useImageExists(path: string): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.onload = () => setOk(true);
    img.onerror = () => setOk(false);
    img.src = path;
  }, [path]);
  return ok;
}

const PORTRAIT_PATHS: Record<string, string> = {
  thomas: "/assets/impact-city/characters/thomas/thomas-portrait.png",
  cosmos: "/assets/impact-city/characters/cosmos/cosmos-portrait.png",
};

export function ThomasCosmosHero() {
  const thomasImg = useImageExists(PORTRAIT_PATHS.thomas);
  const cosmosImg = useImageExists(PORTRAIT_PATHS.cosmos);

  return (
    <section id="characters" className="ic-characters ic-characters--full" aria-labelledby="ic-characters-title">
      <h2 id="ic-characters-title" className="ic-h2">
        The heroes of Rustgarden
      </h2>
      <p className="ic-muted ic-characters__intro">
        Thomas feels the human cost. Cosmos sees the hidden machine layer.
        Together, they do what no one else can.
      </p>
      <div className="ic-characters__grid ic-characters__grid--full">
        {CHARACTERS.map((c) => {
          const hasImg = c.id === "thomas" ? thomasImg : c.id === "cosmos" ? cosmosImg : false;
          const imgPath = PORTRAIT_PATHS[c.id];
          return (
            <article key={c.id} className={`ic-character ic-character--${c.id} ${hasImg ? "ic-character--has-img" : ""}`}>
              <div className={`ic-character__portrait ic-character__portrait--${c.id}`}>
                {hasImg && (
                  <img
                    src={imgPath}
                    alt={`${c.name} — ${c.role}`}
                    className="ic-character__portrait-img"
                  />
                )}
                {!hasImg && (
                  <div className="ic-character__portrait-fallback">
                    <span className="ic-character__portrait-name">{c.name}</span>
                    <span className="ic-character__portrait-hint">portrait pending</span>
                  </div>
                )}
              </div>
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
          );
        })}
      </div>
    </section>
  );
}

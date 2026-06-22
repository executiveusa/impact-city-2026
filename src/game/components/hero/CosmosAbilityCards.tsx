import { COMPANION_ABILITIES } from "@/game/data/companionAbilities";
import { useGameAudio } from "@/game/audio/useGameAudio";

/**
 * CosmosAbilityCards — grid of Cosmos's companion abilities.
 * Active in MVP vs roadmap, with a sound cue on hover/click.
 */
export function CosmosAbilityCards() {
  const audio = useGameAudio();
  return (
    <section className="ic-abilities" aria-labelledby="ic-abilities-title">
      <h2 id="ic-abilities-title" className="ic-h2">
        Cosmos — the eyes Thomas doesn&rsquo;t have
      </h2>
      <p className="ic-muted ic-abilities__intro">
        Cosmos is a gameplay companion, not decoration. Each ability has a real
        function in the story.
      </p>
      <ul className="ic-abilities__grid">
        {COMPANION_ABILITIES.map((a) => (
          <li
            key={a.id}
            className={`ic-ability ${a.status === "roadmap" ? "ic-ability--soon" : ""}`}
          >
            <header className="ic-ability__head">
              <span className="ic-ability__name">{a.name}</span>
              <span
                className={`ic-ability__badge ic-ability__badge--${a.status}`}
              >
                {a.status === "active" ? "In MVP" : "Roadmap"}
              </span>
            </header>
            <p className="ic-ability__desc">{a.description}</p>
            <p className="ic-ability__effect">
              <strong>Effect:</strong> {a.effect}
            </p>
            <p className="ic-ability__unlock">
              <strong>Unlocked by:</strong> {a.unlockedBy}
            </p>
            <button
              type="button"
              className="ic-btn ic-btn--ghost ic-ability__preview"
              onClick={() => audio.play(a.soundCue)}
              onMouseEnter={() => audio.play("ui_hover_soft")}
            >
              ▶ Preview sound
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

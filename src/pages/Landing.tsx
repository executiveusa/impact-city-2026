import { useNavigate } from "react-router-dom";
import { HeroImpactCity } from "@/game/components/hero/HeroImpactCity";
import { ThomasCosmosHero } from "@/game/components/hero/ThomasCosmosHero";
import { CosmosAbilityCards } from "@/game/components/hero/CosmosAbilityCards";
import "@/game/emerald-gothic.css";
import "@/game/components/hero/hero.css";

/**
 * Landing — the cinematic front door to Impact City.
 * Hero → Characters → Abilities → Impact teaser → Play CTA.
 * The actual playable shell lives at /game.
 */
export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="ic-landing">
      <HeroImpactCity onPlay={() => navigate("/game")} />
      <ThomasCosmosHero />
      <CosmosAbilityCards />

      <section id="impact" className="ic-landing__impact">
        <h2 className="ic-h2">Play creates measurable impact</h2>
        <p className="ic-muted">
          Every mission you complete and every asset you rebuild connects to a
          real-world cause — food, water, energy, shelter, education. In this
          prototype, impact is <strong>simulated</strong>. In production,
          verified actions route through transparent nonprofit partners.
        </p>
        <button
          type="button"
          className="ic-btn ic-btn--primary"
          onClick={() => navigate("/game")}
        >
          ▶ Enter Impact City
        </button>
      </section>
    </div>
  );
}

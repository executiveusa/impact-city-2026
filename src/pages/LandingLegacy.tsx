import { useNavigate } from "react-router-dom";
import { HeroImpactCity } from "@/game/components/hero/HeroImpactCity";
import { WhatIsThisStrip } from "@/game/components/hero/WhatIsThisStrip";
import { ThomasCosmosHero } from "@/game/components/hero/ThomasCosmosHero";
import { CosmosAbilityCards } from "@/game/components/hero/CosmosAbilityCards";
import { ImpactRoadmap } from "@/game/components/hero/ImpactRoadmap";
import "@/game/emerald-gothic.css";
import "@/game/components/hero/hero.css";

/**
 * Rollback copy of the pre-cinematic landing page.
 * Keep this file intact while the new scroll experience is evaluated.
 */
export default function LandingLegacy() {
  const navigate = useNavigate();
  return (
    <div className="ic-landing">
      <HeroImpactCity onPlay={() => navigate("/game")} />
      <WhatIsThisStrip />
      <ThomasCosmosHero />
      <CosmosAbilityCards />
      <ImpactRoadmap />

      <section id="impact" className="ic-landing__impact">
        <h2 className="ic-h2">Your move</h2>
        <p className="ic-muted">
          Open Rustgarden. Meet Thomas and Cosmos. Recover the first Emerald Tablet.
          See the impact land on your dashboard.
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

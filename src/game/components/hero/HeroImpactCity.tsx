import { useEffect, useRef } from "react";
import { buildHeroEntrance } from "@/game/animations/heroTimelines";
import { CosmosFlight, EmeraldTabletGlow } from "./CosmosFlight";
import { HeroSoundToggle } from "./HeroSoundToggle";
import { useGameAudio } from "@/game/audio/useGameAudio";

/**
 * HeroImpactCity — the cinematic hero section for /game.
 *
 * Composition (all CSS-drawn, no binary assets):
 *  - Emerald Tablet glow (pulsing)
 *  - Thomas silhouette stepping through a fractured doorway
 *  - Cosmos fly-by silhouette
 *  - Broken skyline + vines reclaiming concrete
 *  - Title, subtitle, CTAs, trust strip
 *  - Floating sound toggle
 *
 * Honors prefers-reduced-motion (timelines become no-ops).
 * No autoplay audio — sound manager resumes only on first gesture.
 */
export function HeroImpactCity({ onPlay }: { onPlay: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const audio = useGameAudio();

  useEffect(() => {
    if (!rootRef.current) return;
    const tl = buildHeroEntrance(rootRef.current);
    return () => {
      tl.kill();
    };
  }, []);

  // Ambient bed starts after first gesture (autoplay-policy compliant).
  useEffect(() => {
    const start = () => audio.startLoop("ambient_rustgarden_loop");
    window.addEventListener("pointerdown", start, { once: true });
    return () => window.removeEventListener("pointerdown", start);
  }, [audio]);

  return (
    <section ref={rootRef} className="ic-hero" aria-labelledby="ic-hero-title">
      <div className="ic-hero__bg" aria-hidden="true">
        <div className="ic-hero__skyline" />
        <div className="ic-hero__vines" />
        <div className="ic-hero__doorway" />
        <EmeraldTabletGlow />
        <CosmosFlight />
      </div>

      <HeroSoundToggle />

      <div className="ic-hero__content">
        <p className="ic-hero__eyebrow">Impact City</p>
        <h1 id="ic-hero-title" className="ic-hero__title">
          The Emerald Algorithm
        </h1>
        <p className="ic-hero__subtitle">
          In 2056, the machines turned Earth into a prison. Thomas and Cosmos
          must recover the stolen Emerald Tablets, rebuild broken cities, and
          prove that play can repair the real world.
        </p>

        <div className="ic-hero__ctas">
          <button
            type="button"
            className="ic-btn ic-btn--primary ic-hero__cta-primary"
            onClick={() => {
              audio.play("ui_confirm_restore");
              onPlay();
            }}
          >
            ▶ Play Mission
          </button>
          <a href="#characters" className="ic-btn ic-btn--ghost ic-hero__cta-sec">
            Meet Thomas &amp; Cosmos
          </a>
          <a href="#impact" className="ic-btn ic-btn--ghost ic-hero__cta-sec">
            View Real-World Impact
          </a>
        </div>

        <p className="ic-hero__trust">
          A nonviolent, story-driven impact adventure. All impact events are{" "}
          <strong>simulated</strong> in this prototype.
        </p>
      </div>
    </section>
  );
}

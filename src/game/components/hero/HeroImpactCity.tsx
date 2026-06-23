import { useEffect, useRef, useState } from "react";
import { buildHeroEntrance } from "@/game/animations/heroTimelines";
import { CosmosFlight, EmeraldTabletGlow } from "./CosmosFlight";
import { HeroSoundToggle } from "./HeroSoundToggle";
import { useGameAudio } from "@/game/audio/useGameAudio";

/**
 * HeroImpactCity — the cinematic full-page hero.
 *
 * Image-first design: if a generated hero image exists at
 * /assets/impact-city/hero/hero-main.png it becomes the background with
 * claymation texture overlays. Otherwise falls back to CSS-drawn props.
 *
 * Drop your generated art into public/assets/impact-city/hero/hero-main.png
 * and it lights up automatically. See docs/prompts/hero-character-image-prompts.md
 */
export function HeroImpactCity({ onPlay }: { onPlay: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const audio = useGameAudio();
  const [heroImgOk, setHeroImgOk] = useState(false);

  useEffect(() => {
    if (!rootRef.current) return;
    const tl = buildHeroEntrance(rootRef.current);
    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    const start = () => audio.startLoop("ambient_rustgarden_loop");
    window.addEventListener("pointerdown", start, { once: true });
    return () => window.removeEventListener("pointerdown", start);
  }, [audio]);

  // Probe for the generated hero image. If it exists, use it.
  useEffect(() => {
    const img = new Image();
    img.onload = () => setHeroImgOk(true);
    img.onerror = () => setHeroImgOk(false);
    img.src = "/assets/impact-city/hero/hero-main.png";
  }, []);

  return (
    <section
      ref={rootRef}
      className={`ic-hero ${heroImgOk ? "ic-hero--has-image" : ""}`}
      aria-labelledby="ic-hero-title"
    >
      {heroImgOk ? (
        <div className="ic-hero__art" aria-hidden="true">
          <img
            src="/assets/impact-city/hero/hero-main.png"
            alt=""
            className="ic-hero__art-img"
          />
          <div className="ic-hero__art-overlay" />
          <EmeraldTabletGlow />
          <CosmosFlight />
        </div>
      ) : (
        <div className="ic-hero__bg" aria-hidden="true">
          <div className="ic-hero__skyline" />
          <div className="ic-hero__vines" />
          <div className="ic-hero__doorway" />
          <EmeraldTabletGlow />
          <CosmosFlight />
        </div>
      )}

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

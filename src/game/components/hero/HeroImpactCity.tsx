import { useEffect, useRef, useState } from "react";
import { buildHeroEntrance } from "@/game/animations/heroTimelines";
import { CosmosFlight, EmeraldTabletGlow } from "./CosmosFlight";
import { HeroSoundToggle } from "./HeroSoundToggle";
import { RustgardenWorld } from "./RustgardenWorld";
import { useGameAudio } from "@/game/audio/useGameAudio";

/**
 * HeroImpactCity — the cinematic full-page hero.
 *
 * Three background layers, bottom → top:
 *   1. RustgardenWorld  — the real World Labs Rustgarden 3D world, embedded
 *                         as a drag-to-pan 360 panorama. Always present.
 *   2. CSS fallback     — only used if the pano fails to load (defensive).
 *   3. Generated splash — if /assets/impact-city/hero/hero-main.png exists,
 *                         it layers on top as the cinematic hero art.
 *
 * Drop your generated art into public/assets/impact-city/hero/hero-main.png
 * and it lights up automatically. See docs/prompts/hero-character-image-prompts.md
 * The Rustgarden panorama lives at public/assets/worldlabs/rustgarden/pano.png
 * and is mirrored from World Labs Marble (world 12a94092).
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

  // Probe for the generated hero image. If it exists, layer it on top.
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
      {/* Layer 1 — the real Rustgarden 3D world, always on. */}
      <RustgardenWorld interactive={!heroImgOk} />

      {/* Layer 2 — generated splash on top when present. */}
      {heroImgOk && (
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
      )}

      {/* Decorative CSS props (tablet glow + Cosmos) when no splash yet. */}
      {!heroImgOk && (
        <>
          <EmeraldTabletGlow />
          <CosmosFlight />
        </>
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

import { useEffect, useRef, useState } from "react";

/**
 * HeroVideo — full-page cinematic video background for the hero.
 *
 * Probes for a generated hero video at /assets/impact-city/hero/hero.mp4.
 * If present, it becomes the dominant hero layer (above the Rustgarden
 * world panorama, below the hero text/CTAs). If absent, renders nothing
 * and the panorama + generated splash handle the hero.
 *
 * Production path: drop your Fal-rendered MP4 into
 *   public/assets/impact-city/hero/hero.mp4
 * and it lights up automatically on next deploy.
 *
 * Browser autoplay rules (enforced here):
 *   - muted + playsInline + loop are REQUIRED for autoplay on iOS Safari
 *     and Chrome. The video has no audio track anyway (BGM is synthesized
 *     by the WebAudio engine on user gesture).
 *   - We also call .play() explicitly and catch the rejection — some
 *     browsers still block until first user gesture, in which case the
 *     panorama stays visible behind the poster.
 *
 * Accessibility:
 *   - prefers-reduced-motion users get a single still frame (poster) and
 *     no playback, because an always-panning video can be disorienting.
 *   - The <video> is aria-hidden; the hero text carries the meaning.
 *
 * Performance:
 *   - preload="metadata" so we don't pull the whole file until the user
 *     agent decides to play.
 *   - A poster (first-frame still) is requested separately so first
 *     paint isn't blank while the MP4 buffers.
 */

const VIDEO_URL = "/assets/impact-city/hero/hero.mp4";
const POSTER_URL = "/assets/impact-city/hero/hero-poster.png";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function HeroVideo({ onReady }: { onReady?: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);
  const reduce = prefersReducedMotion();

  // Probe whether the MP4 exists. HEAD via Image() won't work for video;
  // we use a no-op fetch with method HEAD. If it 404s, we hide the layer.
  useEffect(() => {
    let cancelled = false;
    fetch(VIDEO_URL, { method: "HEAD" })
      .then((r) => {
        if (!cancelled) setAvailable(r.ok);
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Once available and not reduced-motion, try to play.
  useEffect(() => {
    if (!available || reduce) return;
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => {
      v.play()
        .then(() => setPlaying(true))
        .catch(() => {
          // Autoplay blocked — wait for first user gesture, then retry.
          const resume = () => {
            v.play()
              .then(() => setPlaying(true))
              .catch(() => {});
            window.removeEventListener("pointerdown", resume);
            window.removeEventListener("keydown", resume);
          };
          window.addEventListener("pointerdown", resume, { once: true });
          window.addEventListener("keydown", resume, { once: true });
        });
    };
    // Slight delay so the hero entrance animation doesn't fight the video.
    const t = window.setTimeout(tryPlay, 400);
    return () => {
      window.clearTimeout(t);
      if (onReady) onReady();
    };
  }, [available, reduce, onReady]);

  if (!available) return null;

  return (
    <div
      className={`ic-hero-video ${playing ? "ic-hero-video--playing" : ""}`}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        className="ic-hero-video__el"
        src={VIDEO_URL}
        poster={POSTER_URL}
        muted
        loop
        playsInline
        // @ts-expect-error — disablePictureInPicture is a valid HTML attribute
        disablePictureInPicture
        preload="metadata"
        // Don't expose controls; this is a background layer.
      />
      <div className="ic-hero-video__scrim" />
    </div>
  );
}

import { useEffect, useRef, useState } from "react";

/**
 * RustgardenWorld — interactive equirectangular panorama of the real
 * World Labs Rustgarden world embedded into the hero.
 *
 * Source: World Labs Marble (marble-1.1), world_id 12a94092, generated
 * 2026-06-22. The pano PNG (4608x2304 equirectangular) is mirrored locally
 * under /assets/worldlabs/rustgarden/pano.png so it survives any CDN expiry.
 *
 * Embed model: drag-to-pan 360 background. No external viewer iframe —
 * World Labs' Marble viewer page sets X-Frame-Options: DENY and CSP
 * frame-ancestors 'none', so it cannot be iframed. The walkable 3D world
 * is linked instead via the "Step into Rustgarden 3D" button (new tab).
 *
 * Respects prefers-reduced-motion (no auto-pan).
 * Lazy-loaded: the 12MB pano only fetches when the hero mounts.
 */

const PANO_URL = "/assets/worldlabs/rustgarden/pano.png";
const THUMB_URL = "/assets/worldlabs/rustgarden/thumbnail.webp";
const MARBLE_VIEWER_URL = "https://marble.worldlabs.ai/world/12a94092-2411-48d0-8a9e-6a2c0804348e";

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function RustgardenWorld({ interactive = true }: { interactive?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{ active: boolean; x: number; baseYaw: number }>({
    active: false,
    x: 0,
    baseYaw: 0,
  });

  const [loaded, setLoaded] = useState(false);
  const [yaw, setYaw] = useState(35); // start slightly off-center for composition
  const [autoPan, setAutoPan] = useState(false);

  // Lazy-load the pano + decide on auto-pan based on motion preference.
  useEffect(() => {
    const reduce = prefersReducedMotion();
    if (!reduce && interactive) setAutoPan(true);
  }, [interactive]);

  // Auto-pan loop (skipped under reduced-motion).
  useEffect(() => {
    if (!autoPan) return;
    let raf = 0;
    const tick = () => {
      setYaw((y) => (y + 0.04) % 360);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoPan]);

  // Pause auto-pan while user is dragging.
  const onPointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    dragStateRef.current = { active: true, x: e.clientX, baseYaw: yaw };
    setAutoPan(false);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const s = dragStateRef.current;
    if (!s.active) return;
    const dx = e.clientX - s.x;
    // 1px ≈ 0.15deg; clamp into [0,360)
    const next = (s.baseYaw + dx * 0.15 + 360) % 360;
    setYaw(next);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    dragStateRef.current.active = false;
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    // Resume auto-pan after a short stillness (unless reduced-motion).
    if (!prefersReducedMotion() && interactive) {
      window.setTimeout(() => setAutoPan(true), 2500);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`ic-world ${loaded ? "ic-world--loaded" : ""} ${interactive ? "ic-world--interactive" : ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      role="img"
      aria-label="360 panorama of Rustgarden, the ruined 2056 district from Impact City. Drag to look around."
    >
      {/* Lightweight thumbnail as instant placeholder while pano loads */}
      {!loaded && (
        <img
          src={THUMB_URL}
          alt=""
          aria-hidden="true"
          className="ic-world__placeholder"
          loading="lazy"
        />
      )}

      {/* Equirectangular pano mapped to a wide background-position-x sweep.
          This is a CSS-only 360 — lighter than a WebGL viewer and works
          without any deps. The pano is 2:1 equirect, so horizontal panning
          reads as looking around the world. */}
      <div
        className="ic-world__pano"
        style={{
          transform: `translate3d(${-yaw / 360 * 100}%, 0, 0)`,
          backgroundImage: loaded ? `url(${PANO_URL})` : undefined,
        }}
        aria-hidden="true"
      />

      {/* Edge-fade + darkening so hero text + CTAs stay readable */}
      <div className="ic-world__scrim" aria-hidden="true" />

      <img
        src={PANO_URL}
        alt=""
        aria-hidden="true"
        className="ic-world__probe"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
      />

      <a
        className="ic-world__enter"
        href={MARBLE_VIEWER_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        ⟶ Step into Rustgarden 3D
      </a>

      <span className="ic-world__hint" aria-hidden="true">
        {interactive ? "drag to look around" : ""}
      </span>
    </div>
  );
}

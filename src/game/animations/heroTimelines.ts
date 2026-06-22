import gsap from "gsap";

/**
 * GSAP timelines for the cinematic hero.
 *
 * Rules honored:
 *  - respects prefers-reduced-motion (timelines become instant/no-op)
 *  - no bounce/elastic easing
 *  - no scroll-jacking
 *  - cleanup handled by callers via .revert() on unmount
 */

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Hero entrance: title → subtitle → CTAs → tablet glow, staggered.
 * Call with a scope ref to the hero root.
 */
export function buildHeroEntrance(scope: HTMLElement): gsap.core.Timeline {
  const reduce = prefersReducedMotion();
  const q = gsap.utils.selector(scope);

  if (reduce) {
    // Make everything visible immediately, no motion.
    gsap.set(q(".ic-hero__eyebrow, .ic-hero__title, .ic-hero__subtitle, .ic-hero__ctas"), {
      opacity: 1,
      y: 0,
    });
    return gsap.timeline();
  }

  return gsap
    .timeline({ defaults: { ease: "power2.out" } })
    .from(q(".ic-hero__eyebrow"), { opacity: 0, y: 12, duration: 0.5 })
    .from(q(".ic-hero__title"), { opacity: 0, y: 20, duration: 0.7 }, "-=0.2")
    .from(q(".ic-hero__subtitle"), { opacity: 0, y: 16, duration: 0.6 }, "-=0.4")
    .from(
      q(".ic-hero__ctas > *"),
      { opacity: 0, y: 14, duration: 0.5, stagger: 0.12 },
      "-=0.3",
    )
    .from(q(".ic-hero__trust"), { opacity: 0, duration: 0.5 }, "-=0.2");
}

/**
 * Cosmos fly-by: the parrot silhouette crosses the hero on a gentle arc.
 * Loops subtly so the hero feels alive.
 */
export function buildCosmosFlight(target: HTMLElement): gsap.core.Timeline {
  const reduce = prefersReducedMotion();
  if (reduce) {
    gsap.set(target, { opacity: 0 });
    return gsap.timeline();
  }
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 6 });
  tl.set(target, { opacity: 0, x: "-10vw", y: 20, rotation: -4 })
    .to(target, { opacity: 0.9, duration: 0.4 })
    .to(
      target,
      { x: "110vw", y: -30, rotation: 6, duration: 7, ease: "power1.inOut" },
      "<",
    )
    .to(target, { opacity: 0, duration: 0.4 }, "-=0.4");
  return tl;
}

/**
 * Emerald Tablet glow pulse — a slow breathing scale/opacity loop.
 */
export function buildTabletGlow(target: HTMLElement): gsap.core.Timeline {
  const reduce = prefersReducedMotion();
  if (reduce) {
    gsap.set(target, { opacity: 0.6, scale: 1 });
    return gsap.timeline();
  }
  return gsap
    .timeline({ repeat: -1, yoyo: true })
    .to(target, { scale: 1.06, opacity: 0.9, duration: 2.4, ease: "sine.inOut" })
    .to(target, { scale: 1, opacity: 0.6, duration: 2.4, ease: "sine.inOut" });
}

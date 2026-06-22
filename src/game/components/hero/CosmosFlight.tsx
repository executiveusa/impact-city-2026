import { useEffect, useRef } from "react";
import {
  buildCosmosFlight,
  buildTabletGlow,
} from "@/game/animations/heroTimelines";

/**
 * Cosmos fly-by silhouette crossing the hero on a gentle arc.
 * CSS-drawn parrot silhouette (no binary asset). GSAP-driven, reduced-motion safe.
 */
export function CosmosFlight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const tl = buildCosmosFlight(ref.current);
    return () => {
      tl.kill();
    };
  }, []);
  return (
    <div ref={ref} className="ic-cosmos-fly" aria-hidden="true">
      <div className="ic-cosmos-fly__bird" />
      <div className="ic-cosmos-fly__trail" />
    </div>
  );
}

/**
 * Emerald Tablet glow — a pulsing emerald light behind the hero title.
 */
export function EmeraldTabletGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const tl = buildTabletGlow(ref.current);
    return () => {
      tl.kill();
    };
  }, []);
  return <div ref={ref} className="ic-tablet-glow" aria-hidden="true" />;
}

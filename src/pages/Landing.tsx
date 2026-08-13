import { CinematicLanding } from "@/game/components/cinematic/CinematicLanding";
import "@/game/emerald-gothic.css";

/**
 * Cinematic front door to Impact City.
 * The playable game remains isolated at /game.
 * Rollback copy: src/pages/LandingLegacy.tsx
 */
export default function Landing() {
  return <CinematicLanding />;
}

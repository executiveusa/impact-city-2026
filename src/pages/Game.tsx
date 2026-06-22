import { GameProvider } from "@/game/state/GameContext";
import { GameShell } from "@/game/components/GameShell";
import "@/game/emerald-gothic.css";

/**
 * /game route — Impact City: The Emerald Algorithm vertical slice.
 * Wraps the GameShell in the GameProvider so all screens share persisted state.
 */
export default function Game() {
  return (
    <GameProvider>
      <GameShell />
    </GameProvider>
  );
}

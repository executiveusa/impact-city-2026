import { useGame, currentMission } from "../state/GameContext";
import { MainMenu } from "./MainMenu";
import { StoryIntro } from "./StoryIntro";
import { HubZone } from "./HubZone";
import { MissionRunner } from "./MissionRunner";
import { CodexPanel } from "./CodexPanel";
import { ImpactDashboard } from "./ImpactDashboard";
import { RebuildMenu } from "./RebuildMenu";
import { SettingsPanel } from "./SettingsPanel";
import { ResourceBar } from "./ResourceBar";
import { ObjectiveTracker } from "./ObjectiveTracker";

/**
 * GameShell — the in-route state machine that swaps between game screens.
 * Screens are internal (GameScreen), driven by saved state so a refresh
 * returns the player to the exact place they left (acceptance #13).
 */
export function GameShell() {
  const { state } = useGame();
  const mission = currentMission(state);

  const showHud =
    state.screen !== "menu" && state.screen !== "intro" && state.screen !== "settings";

  return (
    <div className="ic-shell">
      {showHud && <ResourceBar />}
      {showHud && mission && state.screen === "mission" && (
        <ObjectiveTracker mission={mission} />
      )}

      <main className="ic-stage">
        {state.screen === "menu" && <MainMenu />}
        {state.screen === "intro" && <StoryIntro />}
        {state.screen === "hub" && <HubZone />}
        {state.screen === "mission" && mission && <MissionRunner mission={mission} />}
        {state.screen === "codex" && <CodexPanel />}
        {state.screen === "dashboard" && <ImpactDashboard />}
        {state.screen === "rebuild" && <RebuildMenu />}
        {state.screen === "settings" && <SettingsPanel />}
      </main>
    </div>
  );
}

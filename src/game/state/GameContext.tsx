import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type {
  GameSaveState,
  GameScreen,
  ImpactEvent,
  ImpactEventTemplate,
  Mission,
  RebuildAsset,
  TabletPrinciple,
} from "../types";
import { MISSION_ORDER } from "../types";
import { MISSION_BY_ID } from "../data/missions";
import { REBUILD_ASSET_BY_ID } from "../data/rebuildAssets";
import { recordImpactEvent } from "../systems/impactEngine";
import {
  createInitialState,
  loadSave,
  persistSave,
} from "./saveEngine";

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
type Action =
  | { type: "SET_SCREEN"; screen: GameScreen }
  | { type: "MARK_INTRO_SEEN" }
  | { type: "START_MISSION"; missionId: string }
  | { type: "COMPLETE_MISSION"; missionId: string }
  | { type: "REBUILD_ASSET"; assetId: string }
  | { type: "TOGGLE_FLAG"; flag: "reducedMotion" | "simpleLanguage" | "subtitles" }
  | { type: "RESET" };

function reducer(state: GameSaveState, action: Action): GameSaveState {
  switch (action.type) {
    case "SET_SCREEN":
      return { ...state, screen: action.screen };

    case "MARK_INTRO_SEEN":
      return { ...state, introSeen: true, screen: "hub" };

    case "START_MISSION":
      return { ...state, currentMissionId: action.missionId, screen: "mission" };

    case "COMPLETE_MISSION": {
      if (state.completedMissionIds.includes(action.missionId)) return state;
      const mission = MISSION_BY_ID[action.missionId];
      if (!mission) return state;

      const completedMissionIds = [...state.completedMissionIds, action.missionId];
      const unlockedCodexIds = Array.from(
        new Set([...state.unlockedCodexIds, ...mission.rewards.codexUnlocks]),
      );
      const unlockedTablets = mission.rewards.tabletUnlock
        ? Array.from(
            new Set<TabletPrinciple>([
              ...state.unlockedTablets,
              mission.rewards.tabletUnlock,
            ]),
          )
        : state.unlockedTablets;

      // Record impact events for this mission.
      const impactEvents: ImpactEvent[] = [
        ...state.impactEvents,
        ...mission.impactEvents.map((t: ImpactEventTemplate) =>
          recordImpactEvent(t, state.playerId),
        ),
      ];

      // Advance currentMissionId to the next mission in order (if any).
      const idx = MISSION_ORDER.indexOf(
        action.missionId as (typeof MISSION_ORDER)[number],
      );
      const nextId =
        idx >= 0 && idx + 1 < MISSION_ORDER.length
          ? MISSION_ORDER[idx + 1]
          : state.currentMissionId;

      // Rebuild unlocks once the third mission (Consent) is done.
      const allThreeDone = completedMissionIds.length >= MISSION_ORDER.length;

      return {
        ...state,
        completedMissionIds,
        unlockedCodexIds,
        unlockedTablets,
        impactEvents,
        civicTrust: state.civicTrust + mission.rewards.civicTrust,
        scrap: state.scrap + mission.rewards.scrap,
        currentMissionId: nextId,
        screen: allThreeDone ? "rebuild" : "hub",
      };
    }

    case "REBUILD_ASSET": {
      if (state.rebuiltAssetIds.includes(action.assetId)) return state;
      const asset: RebuildAsset | undefined = REBUILD_ASSET_BY_ID[action.assetId];
      if (!asset) return state;

      // Soft-gate: must have enough scrap and required civic trust.
      if (state.scrap < asset.scrapCost) return state;
      if (state.civicTrust < asset.civicTrustRequired) return state;

      const impactEvents: ImpactEvent[] = [
        ...state.impactEvents,
        recordImpactEvent(
          {
            actionType: "ASSET_PURCHASE",
            inGameItem: asset.id,
            realWorldCause: asset.realWorldCause,
            amountCents: asset.simulatedAmountCents,
            impactPoints: asset.impactPoints,
          },
          state.playerId,
        ),
      ];

      return {
        ...state,
        rebuiltAssetIds: [...state.rebuiltAssetIds, asset.id],
        scrap: state.scrap - asset.scrapCost,
        impactEvents,
        // After the FIRST rebuild purchase AND all 3 missions done, route to
        // the finale (the demo's emotional climax). Otherwise show the impact
        // dashboard as before. Subsequent purchases after the finale route to
        // dashboard normally.
        screen:
          state.completedMissionIds.length >= MISSION_ORDER.length &&
          state.rebuiltAssetIds.length === 0
            ? "finale"
            : "dashboard",
      };
    }

    case "TOGGLE_FLAG":
      return { ...state, [action.flag]: !state[action.flag] };

    case "RESET":
      return createInitialState();

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Selectors / derived helpers
// ---------------------------------------------------------------------------

export function isMissionUnlocked(state: GameSaveState, missionId: string): boolean {
  const idx = MISSION_ORDER.indexOf(missionId as (typeof MISSION_ORDER)[number]);
  if (idx <= 0) return true; // first mission always unlocked
  const prevId = MISSION_ORDER[idx - 1];
  return state.completedMissionIds.includes(prevId);
}

export function currentMission(state: GameSaveState): Mission | undefined {
  return state.currentMissionId ? MISSION_BY_ID[state.currentMissionId] : undefined;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface GameContextValue {
  state: GameSaveState;
  dispatch: React.Dispatch<Action>;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => loadSave());

  // Persist on every state change.
  useEffect(() => {
    persistSave(state);
  }, [state]);

  const value = useMemo<GameContextValue>(() => ({ state, dispatch }), [state]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within a GameProvider");
  return ctx;
}

import { useState } from "react";
import { useGame, isMissionUnlocked } from "../state/GameContext";
import { MISSIONS } from "../data/missions";
import { THOMAS_HUB_LINES, WARDEN_AMBIENT_LINES } from "../data/dialogue";
import { MISSION_ORDER } from "../types";
import { CharacterPortrait, SpeakerBust } from "./CharacterPortrait";

/**
 * Rustgarden Hub — the playable district hub.
 *
 * MVP gameplay is point-and-select (the spec allows 2.5D/top-down; we use a
 * hand-built stage with interactive hotspots so it runs anywhere). Hotspots:
 *   - Mission terminals (3, unlocked sequentially)
 *   - Codex terminal
 *   - Impact board
 *   - Rebuild shed (after the First Tablet)
 *
 * Visual direction: broken elevated roads, watchtower, abandoned rails,
 * emerald cracks, community garden ruins, rainwater collectors, cloth banners.
 */
export function HubZone() {
  const { state, dispatch } = useGame();
  const [ambient] = useState(() => ({
    thomas: THOMAS_HUB_LINES[Math.floor(Math.random() * THOMAS_HUB_LINES.length)],
    warden: WARDEN_AMBIENT_LINES[Math.floor(Math.random() * WARDEN_AMBIENT_LINES.length)],
  }));

  const allThreeDone = state.completedMissionIds.length >= MISSION_ORDER.length;
  const consentUnlocked = state.unlockedTablets.includes("consent");

  return (
    <div className="ic-hub" role="region" aria-label="Rustgarden district hub">
      <div className="ic-hub__stage" aria-hidden="true">
        <div className="ic-prop ic-prop--watchtower" />
        <div className="ic-prop ic-prop--rails" />
        <div className="ic-prop ic-prop--garden" />
        <div className="ic-prop ic-prop--collector" />
        <div className="ic-prop ic-prop--banner" />
        <div className="ic-cracks" />
      </div>

      <div className="ic-hub__voices">
        <SpeakerBust id="thomas" label="Thomas" line={`“${ambient.thomas}”`} />
        <div className="ic-voice ic-voice--warden" aria-live="off">
          <div className="ic-portrait ic-portrait--sm ic-portrait--warden" aria-hidden="true">
            <span className="ic-portrait__icon">📡</span>
          </div>
          <div className="ic-voice__body">
            <span className="ic-tag ic-tag--warden">Warden Stack · loudspeaker</span>
            <p>{`“${ambient.warden}”`}</p>
          </div>
        </div>
      </div>

      {/* Companion strip — Cosmos is always present in the hub. This is the
          cheapest way to make Cosmos a visible gameplay presence, even before
          its ability mechanics are wired into missions. */}
      <div className="ic-hub__companion" aria-label="Companion">
        <CharacterPortrait id="cosmos" size="md" />
        <p className="ic-hub__companion-line">
          Cosmos perches on a broken rail above. Its ankle charm pulses soft
          emerald.
        </p>
      </div>

      <section className="ic-hub__missions" aria-label="Available missions">
        <h2 className="ic-h2">Missions</h2>
        <ul className="ic-mission-list">
          {MISSIONS.map((m) => {
            const unlocked = isMissionUnlocked(state, m.id);
            const done = state.completedMissionIds.includes(m.id);
            return (
              <li key={m.id}>
                <button
                  className={`ic-card ic-card--mission ${done ? "ic-card--done" : ""} ${
                    !unlocked ? "ic-card--locked" : ""
                  }`}
                  disabled={!unlocked}
                  onClick={() =>
                    dispatch({ type: "START_MISSION", missionId: m.id })
                  }
                >
                  <span className="ic-card__kicker">{m.district}</span>
                  <span className="ic-card__title">{m.title}</span>
                  <span className="ic-card__threat">{m.aiThreat}</span>
                  <span className="ic-card__state">
                    {done ? "✓ Complete" : unlocked ? "Begin" : "Locked"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="ic-hub__civic" aria-label="Civic terminals">
        <h2 className="ic-h2">Civic Terminals</h2>
        <div className="ic-hub__terminal-row">
          <button
            className="ic-btn ic-btn--ghost"
            onClick={() => dispatch({ type: "SET_SCREEN", screen: "codex" })}
          >
            Codex Terminal
          </button>
          <button
            className="ic-btn ic-btn--ghost"
            onClick={() => dispatch({ type: "SET_SCREEN", screen: "dashboard" })}
          >
            Impact Board
          </button>
          <button
            className="ic-btn ic-btn--ghost"
            disabled={!consentUnlocked}
            onClick={() => dispatch({ type: "SET_SCREEN", screen: "rebuild" })}
            title={
              consentUnlocked
                ? "Rebuild community assets"
                : "Unlocks after the First Tablet: Consent"
            }
          >
            Rebuild Shed {consentUnlocked ? "" : "🔒"}
          </button>
        </div>
        {allThreeDone && (
          <p className="ic-hub__hint">
            You hold the First Tablet. The Rebuild Shed is open — turn your
            impact points into restored community assets.
          </p>
        )}
      </section>

      <button
        className="ic-btn ic-btn--link ic-hub__menu"
        onClick={() => dispatch({ type: "SET_SCREEN", screen: "menu" })}
      >
        ← Back to menu
      </button>
    </div>
  );
}

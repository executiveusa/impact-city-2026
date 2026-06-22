import { useState } from "react";
import { useGame } from "../state/GameContext";
import { CODEX_ENTRIES } from "../data/codex";
import type { CodexEntry } from "../types";

/**
 * CodexPanel — the educational AI-safety codex. Entries unlock as the player
 * completes missions. Locked entries show title only (no spoilers).
 */
export function CodexPanel() {
  const { state, dispatch } = useGame();
  const [openId, setOpenId] = useState<string | null>(CODEX_ENTRIES[0]?.id ?? null);
  const unlocked = new Set(state.unlockedCodexIds);

  return (
    <div className="ic-codex" role="region" aria-label="AI-safety codex">
      <header className="ic-codex__header">
        <h1 className="ic-display ic-display--md">The Codex</h1>
        <p className="ic-muted">
          Real AI risks, explained plainly — and what a safer system does instead.
        </p>
      </header>

      <div className="ic-codex__layout">
        <nav className="ic-codex__nav" aria-label="Codex entries">
          {CODEX_ENTRIES.map((e) => {
            const isUnlocked = unlocked.has(e.id);
            const isOpen = openId === e.id;
            return (
              <button
                key={e.id}
                className={`ic-codex__entry ${isOpen ? "ic-codex__entry--open" : ""}`}
                onClick={() => setOpenId(e.id)}
                aria-disabled={!isUnlocked}
              >
                <span className="ic-codex__entry-title">
                  {isUnlocked ? e.title : "🔒 Locked"}
                </span>
              </button>
            );
          })}
        </nav>

        <article className="ic-codex__body">
          {(() => {
            const entry: CodexEntry | undefined = CODEX_ENTRIES.find(
              (e) => e.id === openId,
            );
            if (!entry) return <p className="ic-muted">Select an entry.</p>;
            if (!unlocked.has(entry.id)) {
              return (
                <p className="ic-muted">
                  This entry unlocks as you progress through the story.
                </p>
              );
            }
            return (
              <>
                <h2 className="ic-h2">{entry.title}</h2>
                <Section title="In plain language">{entry.explanation}</Section>
                <Section title="In the game">{entry.inGame}</Section>
                <Section title="In real life">{entry.inRealLife}</Section>
                <Section title="What a safer system does">{entry.saferSystem}</Section>
              </>
            );
          })()}
        </article>
      </div>

      <button
        className="ic-btn ic-btn--link"
        onClick={() => dispatch({ type: "SET_SCREEN", screen: state.introSeen ? "hub" : "menu" })}
      >
        ← Back
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="ic-codex__section">
      <h3 className="ic-codex__section-title">{title}</h3>
      <p>{children}</p>
    </section>
  );
}

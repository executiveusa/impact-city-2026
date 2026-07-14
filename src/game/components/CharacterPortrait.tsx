import { useEffect, useState } from "react";
import { CHARACTER_BY_ID, type CharacterId } from "../data/characters";

/**
 * CharacterPortrait — a reusable portrait slot that probes for a generated
 * image and falls back to a CSS monogram. Used in HubZone, MissionRunner,
 * CodexPanel, and the finale so character art is consistent everywhere.
 *
 * Image path convention (matches hero/ThomasCosmosHero):
 *   /assets/impact-city/characters/<id>/<id>-portrait.png
 *
 * Drop the generated art in and it lights up automatically.
 * No image? Renders a styled monogram badge so the layout never breaks.
 */
const PORTRAIT_PATHS: Record<CharacterId, string> = {
  thomas: "/assets/impact-city/characters/thomas/thomas-portrait.png",
  cosmos: "/assets/impact-city/characters/cosmos/cosmos-portrait.png",
  frankenstack:
    "/assets/impact-city/characters/frankenstack/frankenstack-portrait.png",
};

const MONO_INITIAL: Record<CharacterId, string> = {
  thomas: "T",
  cosmos: "C",
  frankenstack: "F",
};

const portraitCache: Partial<Record<CharacterId, boolean>> = {};

function usePortraitExists(id: CharacterId): boolean {
  const [ok, setOk] = useState<boolean>(portraitCache[id] ?? false);
  useEffect(() => {
    if (portraitCache[id] !== undefined) {
      setOk(portraitCache[id] as boolean);
      return;
    }
    const img = new Image();
    img.onload = () => {
      portraitCache[id] = true;
      setOk(true);
    };
    img.onerror = () => {
      portraitCache[id] = false;
      setOk(false);
    };
    img.src = PORTRAIT_PATHS[id];
  }, [id]);
  return ok;
}

export function CharacterPortrait({
  id,
  size = "md",
  className = "",
  alt,
}: {
  id: CharacterId;
  size?: "sm" | "md" | "lg";
  className?: string;
  alt?: string;
}) {
  const hasImg = usePortraitExists(id);
  const character = CHARACTER_BY_ID[id];
  const resolvedAlt = alt ?? `${character.name} — ${character.role}`;

  return (
    <div
      className={`ic-portrait ic-portrait--${size} ic-portrait--${id} ${
        hasImg ? "ic-portrait--has-img" : "ic-portrait--mono"
      } ${className}`}
      role="img"
      aria-label={resolvedAlt}
    >
      {hasImg ? (
        <img
          src={PORTRAIT_PATHS[id]}
          alt={resolvedAlt}
          className="ic-portrait__img"
          loading="lazy"
        />
      ) : (
        <span className="ic-portrait__mono" aria-hidden="true">
          {MONO_INITIAL[id]}
        </span>
      )}
    </div>
  );
}

/**
 * SpeakerBust — a smaller inline portrait for dialogue/voice lines, paired
 * with a speaker label. Used next to Thomas/Cosmos/Warden voice lines so the
 * player always sees who is talking.
 */
export function SpeakerBust({
  id,
  label,
  line,
  variant = "default",
}: {
  id: CharacterId;
  label: string;
  line: string;
  variant?: "default" | "warden";
}) {
  return (
    <div
      className={`ic-voice ${
        variant === "warden" ? "ic-voice--warden" : ""
      } ic-voice--${id}`}
      aria-live={variant === "warden" ? "off" : "polite"}
    >
      <CharacterPortrait id={id} size="sm" />
      <div className="ic-voice__body">
        <span
          className={`ic-tag ${variant === "warden" ? "ic-tag--warden" : ""}`}
        >
          {label}
        </span>
        <p>{line}</p>
      </div>
    </div>
  );
}

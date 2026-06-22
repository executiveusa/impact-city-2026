# Sound Design

The MVP ships with a **WebAudio-synthesized** sound engine — zero binary audio
assets. Every cue is generated procedurally at runtime from the manifest.
Real `.ogg` files replace these later by swapping the `play()` path in
`src/game/audio/soundManager.ts` to load buffers instead of synth.

## Engine

- **Manager:** `src/game/audio/soundManager.ts` (singleton).
- **Manifest:** `src/game/audio/soundManifest.ts` — 9 cues.
- **Hook:** `src/game/audio/useGameAudio.ts` — reactive mute/volume + resume.

## Cues

| id | type | purpose |
|---|---|---|
| ambient_rustgarden_loop | drone (loop) | Rustgarden ambient bed |
| emerald_tablet_chime | chime | Tablet pickup / codex unlock |
| cosmos_wing_flutter | flutter | Cosmos movement |
| cosmos_signal_ping | sweep | Signal Ping ability |
| warden_stack_warning | sawtooth tone | Warden alert |
| ui_hover_soft | sine tone | Button hover |
| ui_confirm_restore | chime | Confirm / restore action |
| mission_complete_restore | chime | Mission complete |
| time_rift_open | sweep | Memory-rift open |

## Requirements honored

- No autoplay without user gesture (AudioContext resumes on first pointer/keydown).
- Mute toggle + volume control, persisted to `localStorage` (`impact_city_audio_pref`).
- Reduced-intensity mode (half gain) when reduced motion is on.
- Subtitles/captions handled at component layer (always on for voice lines).

## Replacement plan

To swap a synth cue for a real `.ogg`:
1. Drop `audio/impact-city/<id>.ogg` into `public/assets/audio/impact-city/`.
2. In `soundManager.play()`, detect a loaded buffer for the id and play it
   instead of synthesizing.
3. Update `replacementAsset` in the manifest to point at the committed file.

No copyrighted music or ripped game audio. All replacement audio must be
licensed (CC0, CC-BY, or original).

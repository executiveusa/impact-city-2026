# Impact City — Unreal Engine Cinematic Pipeline

**Status: import-ready scaffolding. Unreal Engine is NOT installed on the build
machine, so none of these scripts have been executed here.** They are written
to the documented Unreal Python API and follow the verified Blender export
conventions. When Unreal is installed on the operator's machine, these run as-is.

## Purpose

Unreal is the **cinematic** pipeline for Impact City — high-impact intro scenes
and demo environments. The public playable game stays in the browser
(`impact-city-2026.vercel.app`). Unreal never replaces the web MVP.

## Required setup (operator-side)

- Unreal Engine 5.x
- Plugins: **Python Editor Script Plugin**, **Editor Scripting Utilities**,
  **Sequencer**, **Movie Render Queue**
- Project created at `unreal/ImpactCityDemo/ImpactCityDemo.uproject`

## Automation pattern

```bash
UnrealEditor-Cmd.exe "unreal/ImpactCityDemo/ImpactCityDemo.uproject" \
  -ExecutePythonScript="unreal/scripts/build_intro_cinematic.py"
```

## Asset import

FBX exports come from the verified Blender pipeline:

```bash
# From repo root (requires Blender)
scripts/run-blender-pipeline.sh --fbx
```

Then `import_assets.py` imports them into the Unreal content browser.

## Cinematic scene targets

| # | Scene | Source assets |
|---|---|---|
| 01 | The Great Override | Rustgarden scene, Warden terminal |
| 02 | Thomas Finds the Signal | Thomas proxy, Learning kiosk |
| 03 | Cosmos Awakens | Cosmos proxy, Emerald tablet |
| 04 | The Compliance Gate | Compliance gate, Warden terminal |
| 05 | Emerald Tablet Consent | Tablet chamber (World Labs ref) |

## .gitignore (already in repo root)

```
unreal/**/Binaries/
unreal/**/DerivedDataCache/
unreal/**/Intermediate/
unreal/**/Saved/
unreal/**/*.sln
unreal/**/*.suo
```

Never commit Unreal build artifacts.

## Files

- `scripts/import_assets.py` — bulk-import FBX from Blender pipeline.
- `scripts/build_rustgarden_level.py` — assemble Rustgarden level from imported assets.
- `scripts/build_intro_cinematic.py` — Sequencer timeline for the 5 scenes.
- `scripts/render_turntable.py` — render a character turntable.
- `scripts/export_cinematic_shots.py` — Movie Render Queue export.
- `scripts/setup_project_plugins.py` — enable required plugins (run once).

See `docs/unreal/cinematic-shot-list.md` for the shot breakdown.

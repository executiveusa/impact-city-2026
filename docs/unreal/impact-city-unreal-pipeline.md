# Impact City — Unreal Pipeline

**Honest status:** Unreal Engine is **not installed** on the build machine, so
none of the scripts in `unreal/scripts/` have been executed here. They are
import-ready scaffolds following the documented Unreal Python API and the
verified Blender export conventions. They run as-is once Unreal 5.x is present.

## Role of Unreal

Unreal is the **cinematic** pipeline — high-impact intro scenes and demo
environments. The public playable game stays in the browser at
`impact-city-2026.vercel.app`. **Unreal never replaces the web MVP.**

## Operator setup (one-time)

1. Install Unreal Engine 5.x (Epic Games Launcher).
2. Create project at `unreal/ImpactCityDemo/ImpactCityDemo.uproject` (Blank project).
3. Run once: `setup_project_plugins.py` to enable Python + Sequencer + Movie Render Queue.
4. Regenerate Blender FBX: `scripts/run-blender-pipeline.sh --fbx`.
5. Import assets: `import_assets.py`.

## Asset flow

```
Blender (scripts/blender/, verified)
  → GLB (web) + FBX (Unreal)
  → import_assets.py → /Game/ImpactCity/{characters,props,environments}/
  → build_rustgarden_level.py → playable-looking cinematic level
  → build_intro_cinematic.py → Sequencer timeline (5 scenes)
  → export_cinematic_shots.py → PNG + ProRes master
```

World Labs Rustgarden world can be added as a reference/backplate by importing
its `.glb` collider mesh + using the pano as a skybox.

## Cinematic scenes (target)

| # | Scene | Beats | Primary assets |
|---|---|---|---|
| 01 | The Great Override | Cascade montage, watchtower reveal | rustgarden-scene, warden-terminal |
| 02 | Thomas Finds the Signal | Thomas enters kiosk, signal flare | thomas, learning-kiosk |
| 03 | Cosmos Awakens | Parrot lands on Thomas's wrist, charm flares | cosmos, emerald-tablet |
| 04 | The Compliance Gate | Gate looms, scoring terminal, gate opens | rustgarden-gate, warden-terminal |
| 05 | Emerald Tablet Consent | Rift opens, tablet lift, hand contact | emerald-tablet (intense glow) |

See `cinematic-shot-list.md` for the shot-by-shot plan.

## Known limitations (be honest)

- Unreal isn't installed here → scripts are **import-ready, not pre-executed**.
- Camera cuts + per-scene blocking need Sequencer UI work or extending `build_intro_cinematic.py`.
- Render presets need manual creation before Movie Render Queue can export.
- Thomas/Cosmos are procedural proxies until production meshes are made (Blender pipeline).

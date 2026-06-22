---
name: blender-game-world-builder
description: Drives Blender 5.1 headless on the user's laptop to generate Impact City 3D assets. Verified working.
---

# blender-game-world-builder

## Purpose
Control Blender 5.1.1 on the local machine (headless) to procedurally generate,
export, and validate Impact City 3D assets. Verified working — all scripts in
`scripts/blender/` have been run and produce real GLB files.

## When to use
When generating or regenerating any 3D asset for Impact City: props, characters,
environment blocks, or turntables. Also when validating the asset manifest.

## Inputs
- Blender binary: `C:\Program Files\Blender Foundation\Blender 5.1\blender.exe`
  (also referenced as `BLENDER_PATH` in the vault; currently set to `blender` —
  update vault to the full path).
- Canon prompts: `docs/prompts/*.md`, `src/game/data/characters.ts`.
- Output root: `public/assets/3d/impact-city/`.

## Outputs
- GLB files (web + Unreal import-ready).
- Asset manifests (JSON) under `public/assets/3d/impact-city/manifests/`.

## Process
1. Run the generator script headless:
   ```bash
   BLENDER="/c/Program Files/Blender Foundation/Blender 5.1/blender.exe"
   "$BLENDER" --background --python scripts/blender/create_impact_city_asset_pack.py
   "$BLENDER" --background --python scripts/blender/create_thomas_cosmos_turntables.py
   ```
2. Validate outputs exist + manifest is current:
   ```bash
   "$BLENDER" --background --python scripts/blender/validate_game_assets.py
   ```
3. For production meshes, follow `docs/research/game-production-workflow-synthesis.md`
   (concept → image→3D → Blender cleanup → retopo → rig → export).

## Verified outputs (as of last run)
- `emerald-tablet-consent.glb` (14.7KB)
- `warden-terminal.glb` (3.6KB)
- `rustgarden-gate.glb` (5.0KB)
- `solar-charging-bench.glb` (3.7KB)
- `water-filter-station.glb` (15.2KB)
- `learning-kiosk.glb` (3.7KB)
- `thomas-placeholder.glb` (210KB)
- `cosmos-placeholder.glb` (243KB)

## Blender 5.1 API notes (learned by running)
- GLB export operator is `bpy.ops.export_scene.gltf` with `export_format="GLB"`
  (NOT `export_scene.glb` — that operator does not exist in 5.1).
- `primitive_capsule_add` is NOT available in 5.1 — use `primitive_cylinder_add`.
- `Material.use_nodes` triggers a deprecation warning (fine for 5.x, will need
  migration before Blender 6.0).

## Acceptance criteria
- All scripts run headless without Traceback.
- GLB files are produced and non-empty.
- Manifest JSON is written with size_bytes + replacement_status.

## Failure checks
- Treating placeholder meshes as final art (they are readable-silhouette proxies).
- Committing huge AI-generated binaries without LFS / approval.
- Using `export_scene.glb` or `primitive_capsule_add` (5.1-incompatible).

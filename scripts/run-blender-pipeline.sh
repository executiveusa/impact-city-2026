#!/usr/bin/env bash
# Impact City — Blender pipeline runner.
# Generates all procedural assets, validates them, optionally exports FBX.
#
# Usage:
#   scripts/run-blender-pipeline.sh           # generate + validate (GLB only)
#   scripts/run-blender-pipeline.sh --fbx      # also export FBX for Unreal
#
# Requires Blender 5.1 at the path below (verified working headless).

set -e

# Locate Blender. Prefer $BLENDER_PATH, then the known Windows install.
BLENDER="${BLENDER_PATH:-}"
if [ -z "$BLENDER" ] || [ ! -x "$BLENDER" ]; then
  for cand in \
    "/c/Program Files/Blender Foundation/Blender 5.1/blender.exe" \
    "/c/Program Files/Blender Foundation/Blender 5.0/blender.exe" \
    "/c/Program Files/Blender Foundation/Blender 4.2/blender.exe"; do
    if [ -x "$cand" ]; then BLENDER="$cand"; break; fi
  done
fi
if [ -z "$BLENDER" ]; then
  echo "FAIL: Blender not found. Set BLENDER_PATH or install Blender 5.x."
  exit 1
fi
echo "Using Blender: $BLENDER"
"$BLENDER" --version | head -2

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

echo ""
echo "=== 1/4 Asset pack (props) ==="
"$BLENDER" --background --python scripts/blender/create_impact_city_asset_pack.py 2>&1 | grep -E "building|->|MANIFEST|TOTAL|Error|Traceback"

echo ""
echo "=== 2/4 Character turntables (Thomas, Cosmos) ==="
"$BLENDER" --background --python scripts/blender/create_thomas_cosmos_turntables.py 2>&1 | grep -E "building|->|MANIFEST|TOTAL|Error|Traceback"

echo ""
echo "=== 3/4 Rustgarden scene ==="
"$BLENDER" --background --python scripts/blender/create_rustgarden_scene.py 2>&1 | grep -E "===|->|MANIFEST|Error|Traceback"

if [ "$1" = "--fbx" ]; then
  echo ""
  echo "=== 3.5/4 FBX export (Unreal) ==="
  "$BLENDER" --background --python scripts/blender/export_glb_fbx.py 2>&1 | grep -E "FBX|DONE|Error|Traceback"
fi

echo ""
echo "=== 4/4 Validate ==="
python scripts/blender/validate_game_assets.py

echo ""
echo "Pipeline complete."

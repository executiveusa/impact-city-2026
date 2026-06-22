"""
Impact City — asset validator. Runs headless (doesn't need Blender's scene,
but using blender lets it live alongside the other scripts and parse glb via
the importer if desired). Pure-python checks suffice for the manifest.

Usage:
  blender --background --python scripts/blender/validate_game_assets.py
  (or) python scripts/blender/validate_game_assets.py
"""
import json
import os
import sys

ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", ".."))
THREE_D = os.path.join(ROOT, "public", "assets", "3d", "impact-city")
MANIFESTS = os.path.join(THREE_D, "manifests")


def main():
    errors = []
    ok = []
    if not os.path.isdir(THREE_D):
        print(f"FAIL: 3d asset root missing: {THREE_D}")
        sys.exit(1)

    # gather every committed manifest
    manifest_files = []
    if os.path.isdir(MANIFESTS):
        manifest_files = [f for f in os.listdir(MANIFESTS) if f.endswith(".json")]

    total = 0
    for mf in manifest_files:
        path = os.path.join(MANIFESTS, mf)
        with open(path) as f:
            data = json.load(f)
        for asset in data.get("assets", []):
            total += 1
            name = asset.get("name", "?")
            rel = asset.get("path", "")
            # Manifests have historically used two conventions: repo-root-relative
            # (e.g. "public/assets/3d/impact-city/...") and OUT_ROOT-relative
            # (e.g. "characters/thomas/..."). Resolve both robustly.
            candidates = []
            if os.path.isabs(rel):
                candidates.append(rel)
            else:
                candidates.append(os.path.join(ROOT, rel))  # repo-root-relative
                candidates.append(os.path.join(THREE_D, rel))  # OUT_ROOT-relative
            glb_path = next((c for c in candidates if os.path.exists(c)), None)
            if not glb_path:
                errors.append(f"{name}: missing GLB at {rel}")
                continue
            size = os.path.getsize(glb_path)
            if size == 0:
                errors.append(f"{name}: empty GLB")
                continue
            if asset.get("size_bytes", 0) != size:
                errors.append(f"{name}: manifest size {asset['size_bytes']} != actual {size}")
                continue
            if asset.get("replacement_status") != "procedural-placeholder":
                errors.append(f"{name}: missing replacement_status")
                continue
            ok.append(f"{name}: {size}b OK")

    print("=== Impact City Asset Validation ===")
    print(f"Manifests: {len(manifest_files)}")
    print(f"Assets declared: {total}")
    print(f"OK: {len(ok)}")
    print(f"FAIL: {len(errors)}")
    for line in ok:
        print(f"  OK   {line}")
    for line in errors:
        print(f"  FAIL {line}")
    if errors:
        print("\nVALIDATION FAILED")
        sys.exit(1)
    print("\nVALIDATION PASSED")


if __name__ == "__main__":
    main()

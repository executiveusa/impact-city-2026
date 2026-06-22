"""
Impact City — export helper. Converts the most recently generated GLB set
into FBX (for Unreal import) in parallel, keeping the GLB (web) copies.

Run headless:
  blender --background --python scripts/blender/export_glb_fbx.py

Reads the asset manifests and re-exports each referenced GLB's source scene
as FBX. Because the generators already build scenes from scratch, this script
re-runs the builders then exports FBX alongside GLB.
"""
import bpy
import os
import importlib.util
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_ROOT = os.path.normpath(os.path.join(SCRIPT_DIR, "..", "..", "public", "assets", "3d", "impact-city"))


def load_module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[name] = mod
    spec.loader.exec_module(mod)
    return mod


def export_fbx(name, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    fbx_path = os.path.join(out_dir, f"{name}.fbx")
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.export_scene.fbx(
        filepath=fbx_path,
        use_selection=True,
        object_types={"MESH"},
        apply_unit_scale=True,
        axis_forward="-Z",
        axis_up="Y",
        bake_anim=False,
        mesh_smooth_type="FACE",
    )
    return fbx_path


def main():
    print("=== Impact City GLB+FBX Export ===")
    builders = [
        ("create_impact_city_asset_pack", "create_impact_city_asset_pack.py"),
        ("create_thomas_cosmos_turntables", "create_thomas_cosmos_turntables.py"),
        ("create_rustgarden_scene", "create_rustgarden_scene.py"),
    ]
    for mod_name, fname in builders:
        print(f"\n--- {fname} ---")
        mod = load_module(mod_name, os.path.join(SCRIPT_DIR, fname))
        # Each module exposes ASSETS/CHARACTERS lists + builder fns, plus main().
        # We call main() to regenerate GLB + manifest, then we can't easily re-export
        # FBX per-asset because main() clears the scene between assets. So instead,
        # we re-run each builder fn and export FBX right after.
        if hasattr(mod, "ASSETS"):
            for name, builder, subdir in mod.ASSETS:
                builder()
                out_dir = os.path.join(OUT_ROOT, subdir.replace("/", os.sep))
                fbx = export_fbx(name, out_dir)
                print(f"  FBX -> {fbx} ({os.path.getsize(fbx)} bytes)")
        elif hasattr(mod, "CHARACTERS"):
            for name, builder, subdir in mod.CHARACTERS:
                builder()
                out_dir = os.path.join(OUT_ROOT, subdir.replace("/", os.sep))
                fbx = export_fbx(name, out_dir)
                print(f"  FBX -> {fbx} ({os.path.getsize(fbx)} bytes)")
        elif hasattr(mod, "build") and hasattr(mod, "OUT"):
            mod.build()
            fbx = export_fbx("rustgarden-scene", mod.OUT)
            print(f"  FBX -> {fbx} ({os.path.getsize(fbx)} bytes)")
    print("\nDONE")


if __name__ == "__main__":
    main()

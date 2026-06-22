"""
Impact City — Blender asset pack generator.

Run headless:
  blender --background --python scripts/blender/create_impact_city_asset_pack.py

Generates procedural placeholder meshes for the MVP asset set and exports GLB
files to public/assets/3d/impact-city/. Procedural geometry first — do NOT block
on perfect AI-generated meshes (see asset-pipeline-manager skill).

Each export is tracked in the asset manifest (validate_game_assets.py).
"""
import bpy
import bmesh
import math
import os
import json
from datetime import datetime

OUT_ROOT = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "..", "..", "public", "assets", "3d", "impact-city")
)

EMERALD = (0.098, 0.96, 0.60, 1.0)      # #19F59A
RUST = (0.478, 0.247, 0.141, 1.0)      # #7A3F24
MOSS = (0.122, 0.239, 0.169, 1.0)      # #1F3D2B
OBSIDIAN = (0.031, 0.039, 0.051, 1.0)  # #080A0D
BLUEGRAY = (0.376, 0.443, 0.490, 1.0)  # #60717D
AMBER = (1.0, 0.722, 0.302, 1.0)       # #FFB84D


def clean_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for block in list(bpy.data.meshes):
        bpy.data.meshes.remove(block)
    for block in list(bpy.data.materials):
        bpy.data.materials.remove(block)


def make_material(name, color, emission=0.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = color
        bsdf.inputs["Roughness"].default_value = 0.7
        if emission > 0 and "Emission" in bsdf.inputs:
            bsdf.inputs["Emission"].default_value = color
            bsdf.inputs["Emission Strength"].default_value = emission
    return mat


def assign(obj, mat):
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)


def emerald_tablet():
    """Emerald Tablet (Consent) — a glowing shard."""
    clean_scene()
    bpy.ops.mesh.primitive_cube_add(size=1.2, location=(0, 0, 1.0))
    obj = bpy.context.active_object
    obj.name = "EmeraldTablet_Consent"
    obj.scale = (0.5, 0.08, 0.9)
    bpy.ops.object.transform_apply(scale=True)
    # bevel for a shard feel
    bpy.ops.object.modifier_add(type="BEVEL")
    obj.modifiers["Bevel"].width = 0.04
    obj.modifiers["Bevel"].segments = 3
    bpy.ops.object.modifier_apply(modifier="Bevel")
    assign(obj, make_material("M_EmeraldTablet", EMERALD, emission=2.0))
    return obj


def warden_terminal():
    """Warden terminal — a cold slab with a screen."""
    clean_scene()
    # base
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.6))
    base = bpy.context.active_object
    base.name = "WardenTerminal"
    base.scale = (1.2, 0.5, 1.2)
    bpy.ops.object.transform_apply(scale=True)
    assign(base, make_material("M_WardenBase", BLUEGRAY))
    # screen
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -0.2, 1.5))
    screen = bpy.context.active_object
    screen.name = "WardenScreen"
    screen.scale = (1.0, 0.05, 0.6)
    bpy.ops.object.transform_apply(scale=True)
    assign(screen, make_material("M_WardenScreen", AMBER, emission=1.5))
    return base


def compliance_gate():
    """Compliance Gate — two pillars + a lintel."""
    clean_scene()
    mats = make_material("M_Gate", RUST)
    for x in (-1.2, 1.2):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(x, 0, 1.5))
        p = bpy.context.active_object
        p.name = f"GatePillar_{'L' if x < 0 else 'R'}"
        p.scale = (0.4, 0.4, 3.0)
        bpy.ops.object.transform_apply(scale=True)
        assign(p, mats)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 3.2))
    lintel = bpy.context.active_object
    lintel.name = "GateLintel"
    lintel.scale = (3.2, 0.4, 0.4)
    bpy.ops.object.transform_apply(scale=True)
    assign(lintel, make_material("M_GateLintel", BLUEGRAY))
    return lintel


def solar_bench():
    """Solar charging bench."""
    clean_scene()
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.3))
    seat = bpy.context.active_object
    seat.name = "SolarBench_Seat"
    seat.scale = (1.6, 0.5, 0.1)
    bpy.ops.object.transform_apply(scale=True)
    assign(seat, make_material("M_BenchSeat", BLUEGRAY))
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0.9))
    panel = bpy.context.active_object
    panel.name = "SolarBench_Panel"
    panel.scale = (1.4, 0.4, 0.04)
    bpy.ops.object.transform_apply(scale=True)
    panel.rotation_euler = (math.radians(20), 0, 0)
    assign(panel, make_material("M_SolarPanel", OBSIDIAN, emission=0.3))
    return panel


def water_filter():
    """Water filter station — drum + spout."""
    clean_scene()
    bpy.ops.mesh.primitive_cylinder_add(radius=0.5, depth=1.2, location=(0, 0, 0.6))
    drum = bpy.context.active_object
    drum.name = "WaterFilter_Drum"
    assign(drum, make_material("M_WaterDrum", BLUEGRAY))
    bpy.ops.mesh.primitive_cylinder_add(radius=0.08, depth=0.6, location=(0.4, 0, 1.1))
    spout = bpy.context.active_object
    spout.name = "WaterFilter_Spout"
    spout.rotation_euler = (0, math.radians(60), 0)
    assign(spout, make_material("M_WaterSpout", RUST))
    return drum


def learning_kiosk():
    """Learning kiosk — a slim post with a screen."""
    clean_scene()
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 1.0))
    post = bpy.context.active_object
    post.name = "LearningKiosk_Post"
    post.scale = (0.2, 0.2, 2.0)
    bpy.ops.object.transform_apply(scale=True)
    assign(post, make_material("M_KioskPost", RUST))
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -0.15, 1.8))
    screen = bpy.context.active_object
    screen.name = "LearningKiosk_Screen"
    screen.scale = (0.8, 0.05, 0.5)
    bpy.ops.object.transform_apply(scale=True)
    assign(screen, make_material("M_KioskScreen", EMERALD, emission=1.0))
    return screen


def export_glb(name, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir, f"{name}.glb")
    # select all remaining objects
    bpy.ops.object.select_all(action="SELECT")
    # Blender 4.2+/5.x: operator is export_scene.gltf with export_format='GLB'
    bpy.ops.export_scene.gltf(
        filepath=path,
        use_selection=True,
        export_format="GLB",
        export_apply=True,
    )
    return path


# asset builders: (name, builder_fn, output_subdir)
ASSETS = [
    ("emerald-tablet-consent", emerald_tablet, "props/emerald-tablet"),
    ("warden-terminal", warden_terminal, "props/warden-terminal"),
    ("rustgarden-gate", compliance_gate, "props/compliance-gate"),
    ("solar-charging-bench", solar_bench, "props/solar-bench"),
    ("water-filter-station", water_filter, "props/water-filter"),
    ("learning-kiosk", learning_kiosk, "props/learning-kiosk"),
]


def main():
    print("=== Impact City Blender Asset Pack ===")
    manifest = []
    for name, builder, subdir in ASSETS:
        print(f"building {name}...")
        builder()
        out_dir = os.path.join(OUT_ROOT, subdir.replace("/", os.sep))
        path = export_glb(name, out_dir)
        size = os.path.getsize(path) if os.path.exists(path) else 0
        manifest.append(
            {
                "name": name,
                "version": "0.1.0-procedural",
                "license": "project-original",
                "format": "glb",
                "path": os.path.relpath(path, os.path.join(OUT_ROOT, "..", "..", "..", "..")).replace("\\", "/"),
                "size_bytes": size,
                "created_by": "blender/create_impact_city_asset_pack.py",
                "date": datetime.utcnow().isoformat() + "Z",
                "usage": "MVP placeholder. Replace with production mesh via asset pipeline.",
                "replacement_status": "procedural-placeholder",
            }
        )
        print(f"  -> {path} ({size} bytes)")

    manifest_path = os.path.join(OUT_ROOT, "manifests", "asset-manifest-pack.json")
    os.makedirs(os.path.dirname(manifest_path), exist_ok=True)
    with open(manifest_path, "w") as f:
        json.dump({"generated_at": datetime.utcnow().isoformat() + "Z", "assets": manifest}, f, indent=2)
    print(f"\nMANIFEST: {manifest_path}")
    print(f"TOTAL: {len(manifest)} assets exported")


if __name__ == "__main__":
    main()

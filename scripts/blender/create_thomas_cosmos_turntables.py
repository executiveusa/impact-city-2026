"""
Impact City — Thomas & Cosmos placeholder turntable generator.

Run headless:
  blender --background --python scripts/blender/create_thomas_cosmos_turntables.py

Generates stylized procedural proxies for Thomas (young courier) and Cosmos
(parrot companion) and exports GLB turntables. These are READABLE-SILHOUETTE
placeholders — not final art. Replace via the asset pipeline (image->3D->cleanup).

Canon enforced: see src/game/data/characters.ts. No celebrity likeness, no
copied characters, nonviolent silhouettes only.
"""
import bpy
import math
import os
import json
from datetime import datetime

OUT_ROOT = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "..", "..", "public", "assets", "3d", "impact-city")
)

SKIN = (0.32, 0.20, 0.15, 1.0)       # medium-dark
JACKET = (0.20, 0.18, 0.16, 1.0)     # courier hoodie
SATCH = (0.40, 0.22, 0.12, 1.0)      # leather satchel
DREADS = (0.10, 0.07, 0.05, 1.0)
EMERALD = (0.098, 0.96, 0.60, 1.0)
COSMOS_BODY = (0.16, 0.30, 0.22, 1.0)   # emerald-green parrot base
COSMOS_GOLD = (0.95, 0.70, 0.20, 1.0)
COSMOS_BLUE = (0.20, 0.45, 0.80, 1.0)


def clean_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for block in list(bpy.data.meshes):
        bpy.data.meshes.remove(block)
    for block in list(bpy.data.materials):
        bpy.data.materials.remove(block)


def mat(name, color, emission=0.0):
    m = bpy.data.materials.new(name=name)
    try:
        m.use_nodes = True
    except Exception:
        pass
    bsdf = m.node_tree.nodes.get("Principled BSDF") if m.use_nodes else None
    if bsdf:
        bsdf.inputs["Base Color"].default_value = color
        bsdf.inputs["Roughness"].default_value = 0.7
        if emission > 0 and "Emission" in bsdf.inputs:
            bsdf.inputs["Emission"].default_value = color
            bsdf.inputs["Emission Strength"].default_value = emission
    return m


def assign(obj, m):
    if obj.data.materials:
        obj.data.materials[0] = m
    else:
        obj.data.materials.append(m)


def thomas_proxy():
    """Stylized Thomas proxy: head, torso, legs, dreads, satchel, bracelet."""
    clean_scene()
    # head
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.28, location=(0, 0, 1.75))
    head = bpy.context.active_object
    head.name = "Thomas_Head"
    assign(head, mat("M_Skin", SKIN))
    # torso (hoodie)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 1.0))
    torso = bpy.context.active_object
    torso.name = "Thomas_Torso"
    torso.scale = (0.55, 0.35, 0.85)
    bpy.ops.object.transform_apply(scale=True)
    assign(torso, mat("M_Jacket", JACKET))
    # legs
    for x in (-0.18, 0.18):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(x, 0, 0.3))
        leg = bpy.context.active_object
        leg.name = f"Thomas_Leg_{'L' if x < 0 else 'R'}"
        leg.scale = (0.18, 0.22, 0.7)
        bpy.ops.object.transform_apply(scale=True)
        assign(leg, mat("M_Pants", JACKET))
    # dreadlocks (a few thin cylinders around the head)
    for i in range(7):
        ang = (i / 7) * math.tau
        bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.35, location=(math.cos(ang) * 0.26, math.sin(ang) * 0.26, 1.5))
        d = bpy.context.active_object
        d.name = f"Thomas_Dread_{i}"
        assign(d, mat("M_Dreads", DREADS))
    # satchel
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0.45, 0.1, 1.0))
    satch = bpy.context.active_object
    satch.name = "Thomas_Satchel"
    satch.scale = (0.18, 0.25, 0.3)
    bpy.ops.object.transform_apply(scale=True)
    assign(satch, mat("M_Satchel", SATCH))
    # emerald bracelet (glowing)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.09, minor_radius=0.02, location=(-0.45, 0, 0.55))
    brace = bpy.context.active_object
    brace.name = "Thomas_Bracelet"
    assign(brace, mat("M_EmeraldBracelet", EMERALD, emission=2.0))
    bpy.ops.object.select_all(action="SELECT")


def cosmos_proxy():
    """Stylized Cosmos proxy: body, head, beak, tail, charm."""
    clean_scene()
    # body
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.35, location=(0, 0, 1.0))
    body = bpy.context.active_object
    body.name = "Cosmos_Body"
    body.scale = (1.0, 1.6, 1.0)
    bpy.ops.object.transform_apply(scale=True)
    assign(body, mat("M_CosmosBody", COSMOS_BODY))
    # head
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.22, location=(0, -0.4, 1.35))
    head = bpy.context.active_object
    head.name = "Cosmos_Head"
    assign(head, mat("M_CosmosHead", COSMOS_BODY))
    # beak
    bpy.ops.mesh.primitive_cone_add(radius1=0.08, depth=0.2, location=(0, -0.62, 1.3))
    beak = bpy.context.active_object
    beak.name = "Cosmos_Beak"
    beak.rotation_euler = (math.radians(90), 0, 0)
    assign(beak, mat("M_CosmosBeak", COSMOS_GOLD))
    # tail feathers (gold + blue)
    for i, col in enumerate([COSMOS_GOLD, COSMOS_BLUE, COSMOS_GOLD]):
        bpy.ops.mesh.primitive_cone_add(radius1=0.06, depth=0.5, location=(0, 0.45 + i * 0.05, 1.0 - i * 0.12))
        t = bpy.context.active_object
        t.name = f"Cosmos_Tail_{i}"
        t.rotation_euler = (math.radians(60 + i * 10), 0, 0)
        assign(t, mat(f"M_CosmosTail_{i}", col, emission=0.5))
    # ancient-tech ankle charm (glowing)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.05, minor_radius=0.015, location=(0.15, 0.2, 0.68))
    charm = bpy.context.active_object
    charm.name = "Cosmos_Charm"
    assign(charm, mat("M_CosmosCharm", EMERALD, emission=2.5))
    bpy.ops.object.select_all(action="SELECT")


def export_glb(name, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir, f"{name}.glb")
    bpy.ops.export_scene.gltf(
        filepath=path,
        use_selection=True,
        export_format="GLB",
        export_apply=True,
    )
    return path


def repo_rel_path(abs_path):
    """Convert an absolute GLB path to a repo-root-relative path (manifest convention)."""
    root = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", ".."))
    return os.path.relpath(abs_path, root).replace("\\", "/")


CHARACTERS = [
    ("thomas-placeholder", thomas_proxy, "characters/thomas"),
    ("cosmos-placeholder", cosmos_proxy, "characters/cosmos"),
]


def main():
    print("=== Impact City Character Turntables ===")
    manifest = []
    for name, builder, subdir in CHARACTERS:
        print(f"building {name}...")
        builder()
        out_dir = os.path.join(OUT_ROOT, subdir.replace("/", os.sep))
        path = export_glb(name, out_dir)
        size = os.path.getsize(path)
        manifest.append(
            {
                "name": name,
                "version": "0.1.0-procedural",
                "license": "project-original",
                "format": "glb",
                "path": repo_rel_path(path),
                "size_bytes": size,
                "created_by": "blender/create_thomas_cosmos_turntables.py",
                "date": datetime.utcnow().isoformat() + "Z",
                "usage": "Readable-silhouette placeholder. Replace via image->3D->cleanup pipeline.",
                "replacement_status": "procedural-placeholder",
            }
        )
        print(f"  -> {path} ({size} bytes)")
    manifest_path = os.path.join(OUT_ROOT, "manifests", "asset-manifest-characters.json")
    os.makedirs(os.path.dirname(manifest_path), exist_ok=True)
    with open(manifest_path, "w") as f:
        json.dump({"generated_at": datetime.utcnow().isoformat() + "Z", "assets": manifest}, f, indent=2)
    print(f"\nMANIFEST: {manifest_path}")
    print(f"TOTAL: {len(manifest)} characters exported")


if __name__ == "__main__":
    main()

"""
Impact City — Rustgarden scene blockout.

Run headless:
  blender --background --python scripts/blender/create_rustgarden_scene.py

Generates a single combined scene: broken street segment, vine-wrapped
machine tower, rainwater collector, resistance banner poles. Exports one GLB
for use as an environment reference / Unreal import blockout.
"""
import bpy
import math
import os
import json
from datetime import datetime

OUT = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "..", "..", "public", "assets", "3d", "impact-city", "environments", "rustgarden")
)

OBSIDIAN = (0.031, 0.039, 0.051, 1.0)
RUST = (0.478, 0.247, 0.141, 1.0)
MOSS = (0.122, 0.239, 0.169, 1.0)
BLUEGRAY = (0.376, 0.443, 0.490, 1.0)
EMERALD = (0.098, 0.96, 0.60, 1.0)


def clean():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for b in list(bpy.data.meshes):
        bpy.data.meshes.remove(b)
    for b in list(bpy.data.materials):
        bpy.data.materials.remove(b)


def mat(n, c, e=0.0):
    m = bpy.data.materials.new(name=n)
    try:
        m.use_nodes = True
    except Exception:
        pass
    bsdf = m.node_tree.nodes.get("Principled BSDF") if m.use_nodes else None
    if bsdf:
        bsdf.inputs["Base Color"].default_value = c
        if e > 0 and "Emission" in bsdf.inputs:
            bsdf.inputs["Emission"].default_value = c
            bsdf.inputs["Emission Strength"].default_value = e
    return m


def assign(o, m):
    if o.data.materials:
        o.data.materials[0] = m
    else:
        o.data.materials.append(m)


def build():
    clean()
    # broken street segment
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
    street = bpy.context.active_object
    street.name = "Rustgarden_Street"
    street.scale = (8.0, 4.0, 0.2)
    bpy.ops.object.transform_apply(scale=True)
    assign(street, mat("M_Street", OBSIDIAN))
    # crack (emerald) — a thin emissive plane
    bpy.ops.mesh.primitive_plane_add(size=1, location=(1.5, 0.5, 0.11))
    crack = bpy.context.active_object
    crack.name = "Rustgarden_Crack"
    crack.scale = (3.0, 0.05, 1.0)
    crack.rotation_euler = (0, 0, math.radians(20))
    bpy.ops.object.transform_apply(scale=True)
    assign(crack, mat("M_Crack", EMERALD, e=2.0))
    # vine-wrapped machine tower
    bpy.ops.mesh.primitive_cylinder_add(radius=0.4, depth=6.0, location=(-3.0, -2.0, 3.0))
    tower = bpy.context.active_object
    tower.name = "Rustgarden_Tower"
    assign(tower, mat("M_Tower", BLUEGRAY))
    # vines spiralling the tower
    for i in range(8):
        z = 0.5 + i * 0.7
        ang = i * 0.9
        bpy.ops.mesh.primitive_torus_add(major_radius=0.45, minor_radius=0.05, location=(-3.0 + math.cos(ang) * 0.05, -2.0 + math.sin(ang) * 0.05, z))
        v = bpy.context.active_object
        v.name = f"Rustgarden_Vine_{i}"
        v.rotation_euler = (math.radians(90), ang, 0)
        assign(v, mat("M_Vine", MOSS))
    # rainwater collector
    bpy.ops.mesh.primitive_cylinder_add(radius=0.6, depth=1.4, location=(3.0, 2.5, 0.7))
    collector = bpy.context.active_object
    collector.name = "Rustgarden_Collector"
    assign(collector, mat("M_Collector", BLUEGRAY))
    bpy.ops.mesh.primitive_cone_add(radius1=0.7, depth=0.3, location=(3.0, 2.5, 1.55))
    funnel = bpy.context.active_object
    funnel.name = "Rustgarden_Funnel"
    assign(funnel, mat("M_Funnel", RUST))
    # banner poles
    for x in (-2.0, 2.0):
        bpy.ops.mesh.primitive_cylinder_add(radius=0.05, depth=3.0, location=(x, 3.5, 1.5))
        pole = bpy.context.active_object
        pole.name = f"Rustgarden_Pole_{'L' if x < 0 else 'R'}"
        assign(pole, mat("M_Pole", RUST))
        # banner cloth
        bpy.ops.mesh.primitive_plane_add(size=1, location=(x, 3.45, 2.2))
        cloth = bpy.context.active_object
        cloth.name = f"Rustgarden_Banner_{'L' if x < 0 else 'R'}"
        cloth.scale = (0.02, 0.9, 0.6)
        bpy.ops.object.transform_apply(scale=True)
        assign(cloth, mat("M_Banner", RUST))
    bpy.ops.object.select_all(action="SELECT")


def export():
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, "rustgarden-scene.glb")
    bpy.ops.export_scene.gltf(filepath=path, use_selection=True, export_format="GLB", export_apply=True)
    size = os.path.getsize(path)
    manifest_path = os.path.join(OUT, "..", "..", "manifests", "asset-manifest-rustgarden.json")
    os.makedirs(os.path.dirname(manifest_path), exist_ok=True)
    # repo-root-relative path (manifest convention)
    root = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", ".."))
    rel = os.path.relpath(path, root).replace("\\", "/")
    with open(manifest_path, "w") as f:
        json.dump(
            {
                "generated_at": datetime.utcnow().isoformat() + "Z",
                "assets": [
                    {
                        "name": "rustgarden-scene",
                        "version": "0.1.0-procedural",
                        "license": "project-original",
                        "format": "glb",
                        "path": rel,
                        "size_bytes": size,
                        "created_by": "blender/create_rustgarden_scene.py",
                        "date": datetime.utcnow().isoformat() + "Z",
                        "usage": "Environment blockout / Unreal import reference for Rustgarden district.",
                        "replacement_status": "procedural-placeholder",
                    }
                ],
            },
            f,
            indent=2,
        )
    print(f"  -> {path} ({size} bytes)")
    print(f"MANIFEST: {manifest_path}")


def main():
    print("=== Rustgarden Scene Blockout ===")
    build()
    export()


if __name__ == "__main__":
    main()

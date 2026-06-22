"""
Impact City — Unreal asset import.

STATUS: import-ready scaffold. NOT executed (Unreal not installed on build machine).
Run inside Unreal's Python editor script environment:

    UnrealEditor-Cmd.exe "unreal/ImpactCityDemo/ImpactCityDemo.uproject" \
        -ExecutePythonScript="unreal/scripts/import_assets.py"

Imports FBX files exported by the Blender pipeline (scripts/run-blender-pipeline.sh --fbx)
into the Unreal content browser under /Game/ImpactCity/.
"""
import unreal  # type: ignore # available only inside Unreal Python env
import os
import glob

# FBX source: public/assets/3d/impact-city/**/*.fbx (gitignored, regenerate via Blender)
REPO_ROOT = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", ".."))
FBX_GLOB = os.path.join(REPO_ROOT, "public", "assets", "3d", "impact-city", "**", "*.fbx")
DEST_BASE = "/Game/ImpactCity"

lib = unreal.EditorAssetLibrary
task_dir = unreal.Paths.project_intermediate_dir()

fbx_files = glob.glob(FBX_GLOB, recursive=True)
print(f"Found {len(fbx_files)} FBX files to import")

for fbx in fbx_files:
    name = os.path.splitext(os.path.basename(fbx))[0]
    rel = os.path.relpath(fbx, os.path.join(REPO_ROOT, "public", "assets", "3d", "impact-city"))
    category = rel.split(os.sep)[0]  # characters / props / environments
    dest_package = f"{DEST_BASE}/{category}/{name}.{name}"
    if lib.does_asset_exist(dest_package):
        print(f"  skip (exists): {dest_package}")
        continue
    task = unreal.AssetImportTask()
    task.set_editor_property("filename", fbx)
    task.set_editor_property("destination_path", f"{DEST_BASE}/{category}")
    task.set_editor_property("destination_name", name)
    task.set_editor_property("replace_existing", True)
    task.set_editor_property("automated_import_should_delete_type", False)
    task.set_editor_property("save", True)
    unreal.AssetToolsHelpers.get_asset_tools().import_asset_tasks([task])
    print(f"  imported: {dest_package}")

print("Import complete.")

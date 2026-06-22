"""
Impact City — enable required Unreal plugins for the cinematic pipeline.

STATUS: import-ready scaffold. NOT executed (Unreal not installed).
Run once after creating the ImpactCityDemo project.

Enables: Python Editor Script Plugin, Editor Scripting Utilities, Sequencer,
Movie Render Queue.
"""
import unreal  # type: ignore

REQUIRED_PLUGINS = [
    "PythonScriptPlugin",       # Python Editor Script Plugin
    "EditorScriptingUtilities", # Editor Scripting Utilities
    "LevelSequenceEditor",      # Sequencer
    "MoviePipeline",            # Movie Render Queue
    "MovieRenderQueueEditor",   # Movie Render Queue UI
]


def main():
    print("=== Enabling Required Plugins ===")
    plugman = unreal.UPluginManager.get()
    if not plugman:
        print("FAIL: UPluginManager unavailable")
        return
    for plugin in REQUIRED_PLUGINS:
        try:
            ok = plugman.enable_plugin_by_name(plugin)
            print(f"  {plugin}: {'enabled' if ok else 'failed/missing'}")
        except Exception as e:
            print(f"  {plugin}: error ({e})")
    print("Restart Unreal for plugin changes to take effect.")


if __name__ == "__main__":
    main()

"""
Impact City — build the intro cinematic Sequencer timeline.

STATUS: import-ready scaffold. NOT executed (Unreal not installed).
Run inside Unreal Python editor environment.

Builds a 5-scene Sequencer sequence at /Game/ImpactCity/Cinematics/IntroCinematic
matching docs/unreal/cinematic-shot-list.md.
"""
import unreal  # type: ignore

SEQ_PATH = "/Game/ImpactCity/Cinematics/IntroCinematic"
SCENES = [
    # (scene_name, duration_frames)
    ("01_Great_Override", 300),
    ("02_Thomas_Finds_Signal", 240),
    ("03_Cosmos_Awakens", 240),
    ("04_Compliance_Gate", 360),
    ("05_Emerald_Tablet_Consent", 360),
]


def main():
    print("=== Building Intro Cinematic ===")
    seqlib = unreal.MovieSceneSequenceLibrary
    tools = unreal.AssetToolsHelpers.get_asset_tools()
    factory = unreal.LevelSequenceFactoryNew()
    seq = tools.create_asset(
        "IntroCinematic", "/Game/ImpactCity/Cinematics", factory, unreal.AssetRenameNone
    )
    if not seq:
        print("FAIL: could not create LevelSequence")
        return
    total = sum(d for _, d in SCENES)
    seq.set_display_rate(unreal.FrameRate(24, 1))
    seq.set_playback_start(0)
    seq.set_playback_end(total)
    print(f"Created {SEQ_PATH} ({total} frames @ 24fps = {total/24:.1f}s)")
    print("NOTE: camera cuts + per-scene blocking must be added in the Sequencer UI")
    print("      or by extending this script with MovieSceneToolHelpers.")
    print("See docs/unreal/cinematic-shot-list.md for the shot-by-shot plan.")


if __name__ == "__main__":
    main()

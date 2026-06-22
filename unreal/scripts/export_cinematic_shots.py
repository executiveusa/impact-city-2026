"""
Impact City — export cinematic shots via Movie Render Queue.

STATUS: import-ready scaffold. NOT executed (Unreal not installed).
Requires: Movie Render Queue plugin + a render preset in the project.

Exports final cinematic shots (per docs/unreal/cinematic-shot-list.md) as PNG
sequences + a master ProRes/MP4.
"""
import unreal  # type: ignore
import sys


def main(sequence_path="/Game/ImpactCity/Cinematics/IntroCinematic", output_dir="C:/ImpactCityRenders"):
    print(f"=== Exporting Cinematic Shots ===")
    print(f"Sequence: {sequence_path}")
    print(f"Output: {output_dir}")
    print("STATUS: scaffold. Operator must:")
    print("  1. Open the LevelSequence in Sequencer.")
    print("  2. Add to Movie Render Queue with a render preset (PNG + ProRes).")
    print("  3. Trigger render via UI or:")
    sub = unreal.get_editor_subsystem(unreal.MoviePipelineQueueSubsystem)
    if sub:
        queue = sub.get_queue()
        print(f"  Active queue entries: {len(queue.get_jobs()) if queue else 0}")
    print("See docs/unreal/cinematic-shot-list.md.")


if __name__ == "__main__":
    main()

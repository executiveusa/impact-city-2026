"""
Impact City — render a character turntable via Movie Render Queue.

STATUS: import-ready scaffold. NOT executed (Unreal not installed).
Requires: Movie Render Queue plugin enabled.

Renders a 360-degree turntable of a character (Thomas or Cosmos) to PNG frames.
"""
import unreal  # type: ignore
import sys

CHAR_MAP = {
    "thomas": "/Game/ImpactCity/characters/thomas-placeholder.thomas-placeholder",
    "cosmos": "/Game/ImpactCity/characters/cosmos-placeholder.cosmos-placeholder",
}


def main(character="thomas", output_dir="C:/ImpactCityRenders"):
    asset_path = CHAR_MAP.get(character)
    if not asset_path:
        print(f"Unknown character: {character}. Choose thomas or cosmos.")
        sys.exit(1)
    print(f"=== Rendering turntable: {character} ===")
    print(f"Asset: {asset_path}")
    print(f"Output: {output_dir}")
    print("STATUS: scaffold. Actual Movie Render Queue integration requires the")
    print("operator to bind a render preset + camera rig in the Sequencer UI, then")
    print("call unreal.MoviePipelineQueueSubsystem.render_queue_with_dialog().")
    print("See docs/unreal/impact-city-unreal-pipeline.md.")


if __name__ == "__main__":
    char = sys.argv[1] if len(sys.argv) > 1 else "thomas"
    main(char)

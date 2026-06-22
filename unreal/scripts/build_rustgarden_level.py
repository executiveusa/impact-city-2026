"""
Impact City — build the Rustgarden level from imported assets.

STATUS: import-ready scaffold. NOT executed (Unreal not installed).
Run inside Unreal Python editor environment.

Assembles: rustgarden-scene + warden-terminal + emerald-tablet + compliance-gate
into a playable-looking cinematic level at /Game/ImpactCity/Maps/Rustgarden.
"""
import unreal  # type: ignore

MAP_PATH = "/Game/ImpactCity/Maps/Rustgarden"
ASSET_SPAWNS = [
    # (asset_path, location (x,y,z), rotation (pitch,yaw,roll), scale)
    ("/Game/ImpactCity/environments/rustgarden-scene.rustgarden-scene", (0, 0, 0), (0, 0, 0), 1.0),
    ("/Game/ImpactCity/props/warden-terminal.warden-terminal", (-600, 400, 0), (0, 30, 0), 1.0),
    ("/Game/ImpactCity/props/rustgarden-gate.rustgarden-gate", (0, -800, 0), (0, 0, 0), 1.0),
    ("/Game/ImpactCity/props/emerald-tablet-consent.emerald-tablet-consent", (0, -400, 120), (0, 0, 0), 1.0),
    ("/Game/ImpactCity/characters/thomas-placeholder.thomas-placeholder", (200, -300, 0), (0, 180, 0), 1.0),
    ("/Game/ImpactCity/characters/cosmos-placeholder.cosmos-placeholder", (300, -250, 200), (0, 0, 0), 0.6),
]


def spawn(asset_path, location, rotation, scale):
    lib = unreal.EditorAssetLibrary
    if not lib.does_asset_exist(asset_path):
        print(f"  MISSING asset: {asset_path}")
        return None
    asset = lib.load_asset(asset_path)
    actor = unreal.EditorLevelLibrary.spawn_actor_from_object(
        asset, unreal.Vector(*location), unreal.Rotator(*rotation)
    )
    actor.set_actor_scale3d(unreal.Vector(scale, scale, scale))
    return actor


def main():
    print("=== Building Rustgarden Level ===")
    # Create or open the map
    world = unreal.EditorLevelLibrary.new_level(MAP_PATH)
    for spec in ASSET_SPAWNS:
        spawn(*spec)
    unreal.EditorLevelLibrary.save_current_level()
    print(f"Level saved: {MAP_PATH}")


if __name__ == "__main__":
    main()

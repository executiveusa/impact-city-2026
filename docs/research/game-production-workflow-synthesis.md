# Stefan 3D-AI Channel — Workflow Synthesis for Impact City

**Source:** Public YouTube metadata scraped via Firecrawl (2026-06-22).
**Purpose:** Extract reusable *workflow patterns* only. **No protected assets,
characters, video files, or proprietary content copied.** Channel: Stefan 3D AI
(119K subscribers, 258 videos). See `stefan-video-ids.json` + `stefan-video-details.json`.

## Legal / copyright boundaries (read first)

- We extract **patterns, tool names, and stage sequences** from public descriptions.
- We do **not** download videos, copy characters, copy assets, or reproduce
  Stefan's exact outputs.
- Anything we build for Impact City is **original work** in our own canon
  (Thomas + Cosmos, Emerald Gothic Hopepunk).
- Affiliate codes / sponsored tool mentions are noted but **not** endorsed —
  we evaluate tools on fit + license, not sponsorship.

## Common pipeline (synthesized across 6 videos)

Every "AI image → game-ready" video follows essentially the same backbone:

```
1. Concept art       — AI image gen (Google AI Studio, etc.)
2. Image → 3D        — Hunyuan 3D / Varco 3D / Meshy / Rodin
3. Sculpt cleanup    — Blender (manual)
4. Retopology        — RetopoFlow (Blender add-on) / Modddif
5. UV + bake         — Blender
6. Texturing         — Blender / external
7. Rigging           — AccuRig / Skintoken (open-source, 6GB VRAM)
8. Engine import     — Unreal Engine 5 (or Unity)
9. Playable reveal   — Unreal Sequencer / blueprint
```

### Per-video workflow notes

| Video | Key pattern | Tools |
|---|---|---|
| Complete FREE AI 3D Workflow (MjsQhbaonDc) | Full free pipeline concept→game-ready | Google AI Studio, Hunyuan 3D, Blender, RetopoFlow, Modddif, AccuRig |
| AI Image → Game-Ready 3D (mXlD8jKSa7s) | Detailed concept gen + cleanup checklist | ComfyUI workflows, Unreal import |
| Modular Character with AI (gZIxrX1n2D4) | One concept → interchangeable outfits/parts in UE5 | AssetHub, Unreal modular system |
| Game Level in 1 Day (4TI4XYbNEu0) | Concept→3D→Blender→Unreal playable level fast | Varco 3D, Blender, Unreal |
| Rig ANY 3D Model (fYXsSmPg-uw) | Open-source auto-rig, low VRAM (6GB) | Skintoken, ComfyUI, Customuse |
| AI Images → UE5 Characters (piD3sf_WJIQ) | Rodin Gen-1.5 image→model→UE5 playable | Rodin (Deemos), UE5 |

## Patterns that apply to Impact City

1. **Backbone is stable and free-able.** The concept→image→3D→cleanup→rig→import
   flow maps directly to our `agents/pi-game-creator` + Blender pipeline.
2. **Modular character = good fit for Thomas.** One Thomas base + swappable
   outfits (courier jacket, satchel) mirrors the "modular character" pattern.
3. **Open-source rigging (Skintoken) is viable on modest hardware** (6GB VRAM).
   Good fit for Cosmos (simpler rig than Thomas).
4. **Unreal is the cinematic target, not the playable target.** Every video
   lands in UE5 for the reveal — but our public MVP stays web (React/Vite).
   Unreal = cinematic intro shots only.
5. **World Labs fills the environment gap.** None of Stefan's videos cover
   full-environment generation; that's where our World Labs Rustgarden world
   complements the character pipeline.

## Patterns to AVOID copying

- **Sponsored tool lock-in.** Several videos are sponsored (Varco, AssetHub,
  Customuse, Rodin). We choose tools by license + fit, not sponsorship.
- **"Build a level in 1 day" speed-first framing.** Impact City's value is
  *impact + education*, not raw speed. We borrow technique, not hype.
- **Photoreal celebrity-adjacent outputs.** Some AI-image pipelines drift
  toward celebrity likeness. Impact City explicitly avoids that (see
  `character-bible-thomas-cosmos.md` → avoid list).

## Applied Impact City workflow

```
Thomas/Cosmos concept (our canon prompt)
  → AI image gen (Google AI Studio / HF, license-checked)
  → Image→3D (Hunyuan 3D or Rodin, license-checked)
  → Blender cleanup + retopo (our scripts/blender/)
  → Rig (AccuRig for Thomas, Skintoken option for Cosmos)
  → Export GLB (web) + FBX (Unreal)
  → Web hero: GLB via React-Three-Fiber (stretch)
  → Unreal cinematic: FBX + Sequencer (stretch)
  → World Labs Rustgarden world as environment reference/backplate
```

## Tooling decisions (license-first)

| Stage | Primary | Open-source fallback | License note |
|---|---|---|---|
| Concept image | Google AI Studio | Stable Diffusion (local) | Check output license |
| Image→3D | Hunyuan 3D | — | Commerical-friendly |
| Cleanup/retopo | Blender | Blender + RetopoFlow | GPL/proprietary add-on |
| Rig | AccuRig | Skintoken | Free / open-source |
| Engine (cinematic) | Unreal 5 | Godot | EULA / MIT |
| Engine (web MVP) | Vite + React | — | MIT |
| Environment ref | World Labs Marble | Manual Blender blockout | API quota |

## Files
- `stefan-video-ids.json` — full collected video list (30 found, 20 kept).
- `stefan-video-details.json` — scraped markdown for 6 top workflow videos.
- `stefan-search-raw.txt` — raw Firecrawl search responses (audit trail).

## Rerun inputs (for automation)
```
Firecrawl key: from vault (FIRECRAWL_API_TOKEN) — rotate, chat key compromised
Queries: see stefan-search-raw.txt
Channel: https://www.youtube.com/@stefan_3d_ai/videos
Limit: 20 videos, scrape top 6 for full markdown
```

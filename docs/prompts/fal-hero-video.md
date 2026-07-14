# Fal AI — Hero Video Generation Brief

**Goal:** Produce a full-page cinematic hero video for impact-city-2026.vercel.app.
**Output:** `public/assets/impact-city/hero/hero.mp4` (lights up the hero automatically).
**Poster:** `public/assets/impact-city/hero/hero-poster.png` (first-frame still for instant paint).

This doc tells you (or the Pi agent) exactly what to generate, with which model, at what params, and how much it costs. The hero component already probes for `hero.mp4` and will play it the moment it's dropped in.

---

## The two paths (pick one)

### Path A — Image-to-Video (RECOMMENDED)
**Pre-req:** You already have `hero-main.png` generated (from the GPT-5.5 art handoff). Animate that exact frame.
**Why:** Character consistency. Kling/Veo image-to-video locks the frame's composition and just adds motion. Thomas looks like Thomas.

### Path B — Text-to-Video (fallback if no hero image yet)
**Pre-req:** None — describe the scene directly.
**Why:** Faster to try. But character consistency across regenerations is poor; Thomas may look different every run.

**Use Path A once the hero splash exists. Use Path B only if you want a placeholder video today.**

---

## Model pick (June 2026 pricing)

| Model | Price | 5s clip cost | Verdict |
|-------|-------|--------------|---------|
| **Kling 2.5 Turbo Pro (i2v)** | $0.07/sec | **~$0.35** | ✅ Best value. Proven character consistency. Use this. |
| Kling 2.5 Turbo Standard | $0.042/sec | ~$0.21 | Cheaper; slightly less motion coherence. |
| Kling v2 Master (i2v) | per-video billing | varies | Higher-end; try only if Pro disappoints. |
| Wan 2.5 (t2v, 480p) | $0.05/sec | ~$0.25 | Cheapest overall; open-source; lower quality. |
| Veo 3.1 Lite | ~$0.05/sec | ~$0.25 | Fast; less cinematic than Kling Pro. |
| Veo 3 / 3.1 Standard (with audio) | $0.40/sec | ~$2.00 | Premium; not needed — we synthesize audio via WebAudio. |

**Recommendation: Kling 2.5 Turbo Pro, image-to-video, 5 seconds, 16:9.** Total cost ≈ $0.35 per render. At $75/mo budget this is essentially free — you can afford dozens of iterations.

---

## The generation prompt (Fal accepts a motion prompt + image input)

### For Path A (image-to-video)
**Image input:** `hero-main.png` (already in `public/assets/impact-city/hero/`)
**Motion prompt:**
```
Slow cinematic push-in. Thomas steps forward through the fractured doorway,
his patched courier hoodie shifting gently. Cosmos the parrot flies ahead,
trailing emerald light particles that drift and fade. Vines on the cracked
concrete walls sway softly. Emerald light pulses subtly from the broken
machines in the walls. The distant machine watchtower's blue beam sweeps
once across the skyline. The Emerald Tablet shard in Thomas's hand glows
brighter, then settles. Moody, suspenseful, hopeful. Handcrafted stop-motion
texture throughout — slight frame-stutter, clay-and-fabric feel. No camera
shake. No fast motion. No new characters entering frame.
```
**Params:**
- `aspect_ratio`: "16:9"
- `duration`: "5"  (seconds — Kling's sweet spot; longer = more $ and more drift)
- `negative_prompt`: "fast motion, camera shake, new characters, weapons, gore, text, watermark, photoreal, glossy, plastic, blur, morphing faces"

### For Path B (text-to-video, only if no hero image yet)
Same motion prompt, prepend the full scene description from the hero splash prompt in `docs/prompts/hero-character-image-prompts.md` PROMPT 1. Expect worse consistency.

---

## How to run it

### Option 1 — Fal web UI (easiest, no code)
1. Go to fal.ai/models and pick "Kling 2.5 Turbo Pro Image-to-Video".
2. Upload `public/assets/impact-city/hero/hero-main.png` as the input image.
3. Paste the motion prompt above.
4. Set 16:9, 5 seconds.
5. Generate. Download the MP4.
6. Save as `public/assets/impact-city/hero/hero.mp4`.
7. Extract the first frame as `hero-poster.png` (Fal usually provides a thumbnail; otherwise open the MP4 in any editor and export frame 1).
8. Commit + push. Vercel deploys automatically.

### Option 2 — Pi agent runner script
```bash
# From the impact-city-2026 repo root:
node agents/pi-game-creator/src/tools/falVideoTool.js generate \
  --image public/assets/impact-city/hero/hero-main.png \
  --model "kling-25-turbo-pro" \
  --duration 5 \
  --aspect "16:9" \
  --prompt-file docs/prompts/fal-hero-video.md \
  --output public/assets/impact-city/hero/hero.mp4
```
(Requires `FAL_KEY` in `.env`. Script not yet built — see "Open work" below.)

### Option 3 — Direct API call
```bash
curl -X POST "https://fal.run/fal-ai/kling-video/v1/master/image-to-video" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "image_url": "<hosted-url-of-hero-main.png>",
    "prompt": "<motion prompt above>",
    "duration": "5",
    "aspect_ratio": "16:9"
  }'
```

---

## Costs and iteration math

- **First good render:** likely 3–5 tries to dial in the motion prompt = ~$1.05–$1.75.
- **Final hero video:** $0.35 per keeper.
- **At $75/mo budget:** you can afford ~200 renders/month. This is a rounding error against your budget.
- **Poster image:** free (frame extract from the MP4).

**Honest note:** Kling 2.5 Turbo Pro sometimes produces a "breathing" morph where Thomas's face subtly shifts mid-clip. If that happens, shorten to 4 seconds, lower the motion intensity, or try Kling v2 Master. Master costs more but holds faces better.

---

## File deliverables (exact paths)

| File | Purpose | Required? |
|------|---------|-----------|
| `public/assets/impact-city/hero/hero.mp4` | The video itself | ✅ |
| `public/assets/impact-city/hero/hero-poster.png` | First-frame still (poster attr) | Recommended |
| `public/assets/impact-city/hero/hero-main.png` | Source image for Path A | ✅ for Path A |

The hero component auto-detects `hero.mp4` via HEAD request. No code changes needed once the file is dropped in.

---

## Open work (for me to build when you greenlight)

- [ ] Build `agents/pi-game-creator/src/tools/falVideoTool.js` (Node runner with queue + poll + download).
- [ ] Add `FAL_KEY` to `.env.example`.
- [ ] Wire the Pi agent's `heroBuilder` tool to optionally animate via Fal after the static hero is generated.
- [ ] Update this doc with the exact endpoint URL once you confirm which model variant you pick (the Kling model registry has multiple IDs — I'll match the one you choose).

---

## Sources

- [Fal.ai Pricing Page](https://fal.ai/pricing)
- [Fal.ai Image-to-Video Models Guide](https://fal.ai/learn/tools/ai-image-to-video-generators)
- [Fal.ai Models Directory](https://fal.ai/models)

# GPT-5.5 Starter Prompt — copy/paste this as your first message

Paste the block below into ChatGPT (5.5) as your first message. Then upload the three reference images (Frankenstack, Thomas, Cosmos) and let it run.

---

You are taking over the visual-art layer of Impact City: The Emerald Algorithm — a nonviolent, story-driven browser game that teaches real AI-safety concepts to kids. It's built by a Seattle 501(c)(3) non-profit. The game code is already finished and deployed; I need you to produce the art that drops into specific file paths and lights up immediately. No code changes needed from you — just images.

YOUR INSTRUCTIONS LIVE IN A HANDOFF DOC. Read it fully before generating anything:
https://github.com/executiveusa/impact-city-2026/blob/main/docs/handoffs/2026-06-22-imagery-handoff-gpt55.md

That handoff tells you:
- The 6 files in the repo to read first (characters.ts, frankenstack-canon.md, character-bible, the comic script, existing prompts, and the React components that load your images)
- The visual canon: "Emerald Gothic Hopepunk" — handcrafted claymation/stop-motion texture, NOT clean 3D, NOT photoreal
- The exact 6-color palette with hex codes and when to use each
- The hard IP boundaries (no weapons, no gore, no celebrity likeness, no copying South of Midnight/Coraline/Kubo, no gang styling on Thomas, Cosmos is not a pirate parrot)
- The 6 deliverables with exact file paths, aspect ratios, and prompt seeds
- A consistency checklist and what NOT to do

I AM UPLOADING THREE REFERENCE IMAGES. Treat each as canon for that character's face/silhouette/mood:
1. Frankenstack — weathered older scientist, haunted, intense (the Cassandra archetype)
2. Thomas — young Black teen with dreadlocks (the hero, not a sidekick)
3. Cosmos — the parrot companion (emerald/gold/blue feathers, geometric glow, ankle charm)
If any uploaded reference conflicts with the canon in characters.ts, the uploaded reference wins on face/silhouette and characters.ts wins on constraints.

DO THIS, IN THIS ORDER:
1. Read the handoff doc and the 6 files it points to.
2. Generate the 5 hero/character/environment images FIRST (these light up the live website immediately):
   - public/assets/impact-city/hero/hero-main.png  (16:9 hero splash — the most important image)
   - public/assets/impact-city/characters/thomas/thomas-portrait.png  (4:5)
   - public/assets/impact-city/characters/cosmos/cosmos-portrait.png  (4:5 or 1:1)
   - public/assets/impact-city/characters/frankenstack/frankenstack-portrait.png  (4:5)
   - public/assets/impact-city/hero/rustgarden-backplate.png  (16:9, no characters)
3. Then generate the 8 comic ashcan pages:
   - public/assets/impact-city/comic/page-01.png through page-08.png
   - The full 8-page script is in docs/comic/impact-city-preview-script.md — read it before drawing.
4. Show me each image as you produce it so I can review before you move to the next.

CRITICAL — CONSISTENCY:
The same Thomas, same Cosmos, same Frankenstack, same Rustgarden must appear across every image. A funder will see the hero splash, scroll to the character portraits, and click into the comic — if the characters look like different people across images, the spell breaks. Treat this like one stop-motion film where every puppet was built by the same studio.

CRITICAL — RESTRAINT:
Emerald green (#19F59A) is the ONLY warm/good light source. Use it sparingly — it's the spotlight, not the wash. Amber (#FFB84D) = machine warning or human warmth (Frankenstack's lamp). Cold blue-gray = the Warden Stack (the antagonist AI). Never break this semantic.

CRITICAL — TEXTURE OVER SMOOTHNESS:
I want visible clay, fabric, weathered metal, fingerprints. NOT glossy. NOT plastic. NOT over-smoothed AI-slop. If your tool over-smooths, push harder on texture.

When you've read the handoff and the 6 files, confirm by telling me: (a) the six deliverable file paths, (b) the palette hex codes, and (c) one sentence on Thomas's canon appearance. Then start with the hero splash.

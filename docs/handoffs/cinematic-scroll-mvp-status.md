# Cinematic Scroll MVP Status

Branch: `feature/cinematic-scroll-mvp`

## Implemented
- Landing redesigned as an isolated cinematic GSAP/ScrollTrigger experience.
- `/game` remains unchanged.
- `LandingLegacy.tsx` preserves rollback.
- Seven deterministic art slots are defined.
- Missing art falls back to the existing Rustgarden thumbnail.
- Thomas is canonically a nomadic orphan; his sea-glass shard is wire-wrapped in an hourglass shape.

## Merge gate
User approved merging this front-end slice. Production verification remains separate from merge verification.

## After merge
1. Verify Vercel deployment status.
2. Smoke-test `/` and `/game`.
3. Upload/replace final cinematic binary assets.
4. Continue mission-world shots and motion assets.

# Phase 0 status (feat/3d-phase-0)

Status: **built, not yet measured on real hardware. GO/NO-GO pending.**

## Done (proven in the build sandbox)
| Ticket | Result |
|---|---|
| P0-1 | three 0.186.0, @react-three/fiber 9.8.0, drei 10.7.8, rapier 2.2.0, @sparkjsdev/spark 2.2.0, zustand 5.0.15 pinned exact. React 19.3.0 is inside every peer range (fiber needs >=19 <19.4). `/play` route is lazy-loaded and flag-gated (`VITE_ENABLE_PLAY_3D=1` or `?play3d=1`); without the flag it redirects to `/game`. |
| P0-2 | Rustgarden SPZ 100k/150k/500k + collider GLB downloaded from the World Labs CDN (no auth needed today) and self-hosted in `public/assets/worldlabs/rustgarden/splat/` (~31 MB). Collider and 150k SPZ share one frame: bounds agree within ~0.4 units on every axis. |
| P0-3 | Kinematic capsule (Rapier KinematicCharacterController, autostep, snap-to-ground, 50 deg slope) + third-person follow camera. The capsule spawns at the Marble capture origin and lands on the collider (playerGrounded mark 1.1-3.7 s after canvas ready in 3 headless runs). |
| P0-4 | 3 prop GLBs (gate, terminal, water filter) with a procedural clay material and a per-zone record-decay uniform (desaturate + darken), cycled with G. |
| P0-5 | `scripts/perf-p0.mjs` (`npm run perf:p0`) runs a scripted figure-eight walk per tier and writes `ops/reports/perf-p0.json`. |
| Regression | `tsc --noEmit` passes, `vite build` passes, `/game` loads with no page errors. 2D entry chunk 453.47 kB -> 454.08 kB (3D code is split out). |

## Not proven
- **Frame rate.** The build sandbox has no GPU (2 vCPU, 1 GB RAM, SwiftShader). Its run (0.38 fps p50) is recorded in `perf-p0.json` as INVALID and is not evidence either way. The gate needs a run on the reference laptop.
- **World cohesion (G2 mini-check).** Needs a real-GPU render; the SwiftShader frames only confirm that the splat and the collider draw.
- Visual scale: the Marble world is a small bubble (~5-6 units across). Expect a tight play space; this matters for Phase 1 layout.

## Known issues to watch
- 3D chunk is 5.7 MB (2.0 MB gzip), mostly Spark + Rapier WASM. Load-time budget TBD.
- Collider is 754k triangles / 19.6 MB. It parses in ~1.2-4 s in the sandbox; a decimated copy is the first thing to try if load time or Rapier memory hurts.
- One unexplained 404 on `/play` in headless runs (not on `/game`).
- `tsconfig.json`: removed `baseUrl` (TypeScript 7 rejects it, so typecheck was already failing on main) and added `vite/client` types.
- jcodemunch / RTK not installed in this sandbox yet (no cargo); does not affect the build.

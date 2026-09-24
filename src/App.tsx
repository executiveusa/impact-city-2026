import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "@/pages/Landing";
import Game from "@/pages/Game";

// 3D spike is code-split so the 2D routes do not pay for three/rapier/spark.
const Game3D = lazy(() => import("@/pages/Game3D"));

/** /play is behind a flag: VITE_ENABLE_PLAY_3D=1 at build time, or ?play3d=1 once (remembered in localStorage). */
function play3dEnabled(): boolean {
  if (import.meta.env.VITE_ENABLE_PLAY_3D === "1") return true;
  if (typeof window === "undefined") return false;
  if (new URLSearchParams(window.location.search).get("play3d") === "1") localStorage.setItem("ic3d_play_flag", "1");
  return localStorage.getItem("ic3d_play_flag") === "1";
}

/**
 * Impact City standalone app.
 *  - "/"      cinematic landing (hero, Thomas & Cosmos, abilities, impact teaser)
 *  - "/game"  playable MVP shell (menu → missions → rebuild → dashboard)
 *  - "/play"  3D Phase 0 spike, flag-gated (see play3dEnabled)
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/game" element={<Game />} />
        <Route
          path="/play"
          element={play3dEnabled() ? <Suspense fallback={null}><Game3D /></Suspense> : <Navigate to="/game" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

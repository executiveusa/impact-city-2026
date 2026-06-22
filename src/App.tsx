import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "@/pages/Landing";
import Game from "@/pages/Game";

/**
 * Impact City standalone app.
 *  - "/"      cinematic landing (hero, Thomas & Cosmos, abilities, impact teaser)
 *  - "/game"  playable MVP shell (menu → missions → rebuild → dashboard)
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/game" element={<Game />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

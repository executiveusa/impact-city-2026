import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Game from "@/pages/Game";

/**
 * Standalone Impact City app. The game IS the whole app here — root redirects
 * to /game so the build opens straight into the playable MVP.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/game" element={<Game />} />
        <Route path="/" element={<Navigate to="/game" replace />} />
        <Route path="*" element={<Navigate to="/game" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

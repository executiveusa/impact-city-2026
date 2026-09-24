import { useMemo, useState } from "react";

/**
 * P2-1 decode renderer: rebuild a message from fragments after Glyph Translate.
 * Click-to-place (keyboard and pointer friendly, no drag required); no timer.
 */
export function Decode({ prompt, fragments, translated, onSolved }: { prompt: string; fragments: string[]; translated: boolean; onSolved: () => void }) {
  const shuffled = useMemo(() => fragments.map((f, i) => ({ f, i })).sort((a, b) => ((a.i * 7919) % 5) - ((b.i * 7919) % 5)), [fragments]);
  const [placed, setPlaced] = useState<number[]>([]);
  const solved = placed.length === fragments.length && placed.every((v, k) => v === k);
  const wrong = placed.length === fragments.length && !solved;
  return (
    <div>
      <p style={{ marginTop: 0 }}>{prompt}</p>
      {!translated && <p style={{ color: "#ffb35c" }}>The glyphs won't hold still. Ask Cosmos to translate them first.</p>}
      <div aria-live="polite" style={{ minHeight: 28, margin: "6px 0", color: "#3dffa0" }}>{placed.map((i) => fragments[i]).join(" / ")}</div>
      {translated && !solved && shuffled.map(({ f, i }) => (
        <button key={i} disabled={placed.includes(i)} onClick={() => setPlaced([...placed, i])} style={{ margin: "4px 6px 0 0", opacity: placed.includes(i) ? 0.35 : 1 }}>{f}</button>
      ))}
      {wrong && <p>That reads wrong. <button onClick={() => setPlaced([])}>Clear and try again</button></p>}
      {solved && <button onClick={onSolved}>Continue</button>}
    </div>
  );
}

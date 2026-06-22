/**
 * DialogueBox — a single styled dialogue line with optional speaker hint.
 * Always rendered as live text (subtitles-on by default; a11y §8).
 */
export function DialogueBox({
  line,
  speaker,
}: {
  line: string;
  speaker?: string;
}) {
  return (
    <p className="ic-dialogue" aria-live="polite">
      {speaker && <span className="ic-dialogue__speaker">{speaker}: </span>}
      {line}
    </p>
  );
}

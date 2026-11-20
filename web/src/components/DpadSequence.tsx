// Renders a GTA6 cheat's D-pad input sequence (e.g. "Down, Up, Left, Left")
// as PS5-style D-pad direction chips instead of plain text. GTA6's cheats
// are entered via the console D-pad (see /cheats' "How It Works" section),
// not face buttons, so there's no Triangle/Circle/Square/X glyph to show.
const ARROWS: Record<string, string> = {
  Up: "▲",
  Down: "▼",
  Left: "◀",
  Right: "▶",
};

export default function DpadSequence({ sequence }: { sequence: string }) {
  const steps = sequence.split(",").map((s) => s.trim());
  return (
    <span className="dpad-sequence" aria-label={sequence}>
      {steps.map((step, i) => (
        <span className="dpad-key" key={i} title={step}>
          {ARROWS[step] ?? step}
        </span>
      ))}
    </span>
  );
}

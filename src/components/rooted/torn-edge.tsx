/** Builds a jagged, torn-paper diagonal clip-path for the packaging rip. */
export function tearClipPath(progress: number) {
  // Tear travels left -> right; bottom of the rip leads the top.
  const bottom = -20 + progress * 150;
  const top = bottom - 32;
  const steps = 14;
  const points: string[] = ["100% 0%", "100% 100%"];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = 100 - t * 100;
    const base = bottom + (top - bottom) * t;
    const jag = (i % 2 === 0 ? 1 : -1) * (2.2 + ((i * 7) % 5) * 0.6);
    points.push(`${(base + jag).toFixed(2)}% ${y.toFixed(2)}%`);
  }

  return `polygon(${points.join(", ")})`;
}

/** Horizontal torn kraft strip used along the bottom of the purple screens. */
export function TornStrip({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-kraft ${className}`}
      style={{
        clipPath:
          "polygon(0% 38%, 6% 22%, 13% 45%, 21% 26%, 29% 48%, 37% 24%, 46% 44%, 54% 20%, 63% 42%, 71% 22%, 80% 46%, 88% 25%, 95% 44%, 100% 30%, 100% 100%, 0% 100%)",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
    </div>
  );
}

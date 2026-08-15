/** Builds an organic, irregular torn-paper diagonal clip-path for the packaging rip. */
export function tearClipPath(progress: number) {
  // Tear travels left -> right. The edge has small, natural paper-like variations.
  const bottom = -18 + progress * 150;
  const top = bottom - 34;
  const steps = 28;
  const points: string[] = ["100% 0%", "100% 100%"];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = 100 - t * 100;
    const base = bottom + (top - bottom) * t;
    const wave = Math.sin(i * 1.71) * 1.8;
    const rough = Math.sin(i * 4.37) * 0.9;
    points.push(`${(base + wave + rough).toFixed(2)}% ${y.toFixed(2)}%`);
  }

  return `polygon(${points.join(", ")})`;
}

/** Horizontal torn kraft-paper edge used along the bottom of the purple screens. */
export function TornStrip({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-[22%] overflow-hidden bg-kraft ${className}`}
      style={{
        clipPath:
          "polygon(0% 14%, 3% 20%, 7% 11%, 11% 23%, 15% 13%, 19% 25%, 24% 12%, 29% 22%, 34% 10%, 39% 24%, 44% 13%, 49% 21%, 54% 9%, 59% 23%, 64% 12%, 69% 20%, 74% 10%, 79% 24%, 84% 12%, 89% 22%, 94% 11%, 97% 19%, 100% 13%, 100% 100%, 0% 100%)",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_10%,rgba(255,255,255,0.28),transparent_62%)]" />
    </div>
  );
}

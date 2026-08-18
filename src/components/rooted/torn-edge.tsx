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

const RIP =
  "polygon(0% 14%, 3% 20%, 7% 11%, 11% 23%, 15% 13%, 19% 25%, 24% 12%, 29% 22%, 34% 10%, 39% 24%, 44% 13%, 49% 21%, 54% 9%, 59% 23%, 64% 12%, 69% 20%, 74% 10%, 79% 24%, 84% 12%, 89% 22%, 94% 11%, 97% 19%, 100% 13%, 100% 100%, 0% 100%)";

/** Horizontal torn kraft-paper edge used along the bottom of the purple screens. */
export function TornStrip({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-[22%] overflow-hidden bg-kraft ${className}`}
      style={{ clipPath: RIP }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_10%,rgba(255,255,255,0.28),transparent_62%)]" />
    </div>
  );
}

/** Layered torn kraft-paper "soil": several ripped sheets in different kraft tones. */
export function KraftSoil({ className = "" }: { className?: string }) {
  const layers = [
    { h: "100%", color: "var(--kraft)", opacity: 0.55, shiftX: "-3%" },
    { h: "84%", color: "var(--kraft-deep)", opacity: 0.8, shiftX: "2%" },
    { h: "64%", color: "color-mix(in oklab, var(--kraft-deep) 70%, #3d2614)", opacity: 0.92, shiftX: "-2%" },
    { h: "44%", color: "color-mix(in oklab, var(--kraft-deep) 40%, #2a1a0e)", opacity: 1, shiftX: "3%" },
  ];
  return (
    <div className={`pointer-events-none absolute inset-x-0 bottom-0 ${className}`}>
      {layers.map((l, i) => (
        <div
          key={i}
          className="absolute inset-x-[-6%] bottom-0"
          style={{
            height: l.h,
            background: l.color,
            opacity: l.opacity,
            clipPath: RIP,
            transform: `translateX(${l.shiftX}) scaleX(${1 + i * 0.02})`,
          }}
        />
      ))}
    </div>
  );
}


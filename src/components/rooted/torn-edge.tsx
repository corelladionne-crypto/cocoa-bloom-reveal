/** Deterministic pseudo-random in [0,1) so the tear shape is stable across renders. */
function noise(i: number, seed = 1) {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Builds a jagged, torn-paper diagonal clip-path for the packaging rip.
 * The edge gains fine irregularity (micro-jags layered on macro-jags) and the
 * whole contour shifts subtly with progress so it reads as fibres pulling apart.
 */
export function tearClipPath(progress: number) {
  // Tear travels left -> right; bottom of the rip leads the top.
  const bottom = -20 + progress * 150;
  const top = bottom - 32;
  const steps = 42;
  const points: string[] = ["100% 0%", "100% 100%"];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = 100 - t * 100;
    const base = bottom + (top - bottom) * t;
    // macro jag (big rips) + micro jag (fibre roughness), both drifting with progress
    const macro = (noise(i, 3) - 0.5) * 6.5;
    const micro = (noise(i * 3.7, 9) - 0.5) * 2.4;
    const drift = Math.sin(t * 18 + progress * 6) * 1.1;
    points.push(`${(base + macro + micro + drift).toFixed(2)}% ${y.toFixed(2)}%`);
  }

  return `polygon(${points.join(", ")})`;
}

/**
 * Loose paper fibres clinging to the torn edge. Strand length and angle react to
 * the drag position so the rip feels physical rather than a hard mask.
 */
export function PaperFibers({
  progress,
  reduceMotion = false,
}: {
  progress: number;
  reduceMotion?: boolean;
}) {
  if (progress <= 0.01) return null;
  const bottom = -20 + progress * 150;
  const top = bottom - 32;
  const strands = 34;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      {Array.from({ length: strands }, (_, i) => {
        const t = i / (strands - 1);
        const y = 100 - t * 100;
        const x = bottom + (top - bottom) * t + (noise(i, 3) - 0.5) * 6.5;
        const len = (0.7 + noise(i, 21) * 2.1) * (reduceMotion ? 1 : 0.6 + progress * 0.9);
        const lift = (noise(i, 42) - 0.5) * 2.6;
        return (
          <path
            key={i}
            d={`M ${x} ${y} q ${len * 0.5} ${lift} ${len} ${lift * 1.6}`}
            stroke="var(--kraft-deep)"
            strokeWidth={0.22 + noise(i, 7) * 0.28}
            strokeLinecap="round"
            fill="none"
            opacity={0.45 + noise(i, 11) * 0.4}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
}

/** Horizontal torn kraft strip used along the bottom of the purple screens. */
export function TornStrip({ className = "" }: { className?: string }) {
  const steps = 40;
  const pts = Array.from({ length: steps + 1 }, (_, i) => {
    const x = (i / steps) * 100;
    const yv = 34 + (noise(i, 5) - 0.5) * 22 + (noise(i * 2.3, 13) - 0.5) * 8;
    return `${x.toFixed(2)}% ${yv.toFixed(2)}%`;
  });

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-kraft ${className}`}
      style={{ clipPath: `polygon(${pts.join(", ")}, 100% 100%, 0% 100%)` }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
    </div>
  );
}

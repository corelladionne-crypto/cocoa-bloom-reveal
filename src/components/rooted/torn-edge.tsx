/** Deterministic pseudo-random in [0,1) so the tear shape is stable across renders. */
function noise(i: number, seed = 1) {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const STEPS = 46;

/** Jagged vertical seam down the middle of the packaging, in % of width. */
function seamX(i: number) {
  const macro = (noise(i, 3) - 0.5) * 7;
  const micro = (noise(i * 3.7, 9) - 0.5) * 2.6;
  const wander = Math.sin((i / STEPS) * 5.2) * 3.4;
  return 50 + macro + micro + wander;
}

/**
 * Clip-path for one half of the packaging as it rips apart down the middle.
 * The seam only opens as far as the drag has travelled: above `progress`
 * the halves are separated, below it the paper is still joined.
 */
export function tearHalfPath(side: "left" | "right", progress: number) {
  const open = Math.min(1, Math.max(0, progress));
  const pts: string[] = [];
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS;
    const y = t * 100;
    // Below the tear front the seam snaps back to centre so the paper is intact.
    const openness = t <= open ? 1 : Math.max(0, 1 - (t - open) * 14);
    const x = 50 + (seamX(i) - 50) * openness;
    pts.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  }
  return side === "left"
    ? `polygon(0% 0%, ${pts.join(", ")}, 0% 100%)`
    : `polygon(100% 0%, ${pts.join(", ")}, 100% 100%)`;
}

/**
 * Loose paper fibres clinging to the vertical rip. Strand length reacts to the
 * drag position so the tear feels physical rather than a hard mask.
 */
export function PaperFibers({
  progress,
  reduceMotion = false,
}: {
  progress: number;
  reduceMotion?: boolean;
}) {
  if (progress <= 0.01) return null;
  const strands = 36;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      {Array.from({ length: strands }, (_, i) => {
        const t = i / (strands - 1);
        if (t > progress) return null;
        const idx = Math.round(t * STEPS);
        const x = seamX(idx);
        const y = t * 100;
        const len = (0.8 + noise(i, 21) * 2.2) * (reduceMotion ? 1 : 0.6 + progress * 0.9);
        const dir = i % 2 === 0 ? -1 : 1;
        const lift = (noise(i, 42) - 0.5) * 2.4;
        return (
          <path
            key={i}
            d={`M ${x} ${y} q ${dir * len * 0.5} ${lift} ${dir * len} ${lift * 1.4}`}
            stroke="var(--kraft-deep)"
            strokeWidth={0.22 + noise(i, 7) * 0.3}
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
import kraftPaper from "@/assets/kraft-paper.png";

export function TornStrip({ className = "" }: { className?: string }) {
  const steps = 40;

  const pts = Array.from({ length: steps + 1 }, (_, i) => {
    const x = (i / steps) * 100;

    const yv =
      34 +
      (noise(i, 5) - 0.5) * 22 +
      (noise(i * 2.3, 13) - 0.5) * 8;

    return `${x.toFixed(2)}% ${yv.toFixed(2)}%`;
  });

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-kraft ${className}`}
      style={{
        clipPath: `polygon(${pts.join(", ")}, 100% 100%, 0% 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
    </div>
  );
}

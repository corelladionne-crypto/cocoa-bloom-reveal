import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import cacaoPod from "@/assets/cacao-pod.png";
import cacaoSeed from "@/assets/cacao-seed.png";
import cacaoTree from "@/assets/cacao-tree.png";
import { AsuMark, CadburyMark, ChangingFuturesMark } from "@/components/rooted/logos";
import { TornStrip, tearClipPath } from "@/components/rooted/torn-edge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "COCOA / Rooted — A Gifting Reveal" },
      {
        name: "description",
        content:
          "Tear the packaging, sow a cacao seed with Cadbury, ASU and Changing Futures, and watch a living grove grow.",
      },
      { property: "og:title", content: "COCOA / Rooted — A Gifting Reveal" },
      {
        property: "og:description",
        content: "A four-step unwrapping ritual that plants a real cacao tree.",
      },
    ],
  }),
  component: RootedExperience,
});

const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const SOFT = "cubic-bezier(0.22, 1, 0.36, 1)";

type Step = 1 | 2 | 3 | 4 | 5;

function RootedExperience() {
  const [step, setStep] = useState<Step>(1);
  const [dimmed, setDimmed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tearDone, setTearDone] = useState(false);
  const [growing, setGrowing] = useState(false);
  const [zooming, setZooming] = useState(false);
  const [name, setName] = useState("");
  const [trees, setTrees] = useState(137);

  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const countedRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setDimmed(true), 1000);
    return () => clearTimeout(t);
  }, []);

  const completeTear = useCallback(() => {
    draggingRef.current = false;
    setProgress(1);
    setTearDone(true);
    setTimeout(() => setStep(2), 700);
  }, []);

  const updateFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      setProgress(p);
      if (p >= 0.9) completeTear();
    },
    [completeTear],
  );

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (draggingRef.current) updateFromClientX(e.clientX);
    };
    const up = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setProgress((p) => (p >= 0.9 ? 1 : 0));
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [updateFromClientX]);

  const startGrowth = () => {
    setGrowing(true);
    setTimeout(() => setStep(4), 1200);
  };

  const submitName = (e: React.FormEvent) => {
    e.preventDefault();
    setZooming(true);
    setTimeout(() => setStep(5), 1000);
  };

  useEffect(() => {
    if (step === 5 && !countedRef.current) {
      countedRef.current = true;
      setTrees((t) => t + 1);
    }
  }, [step]);

  if (step === 5) {
  return <ThankYouScreen name={name} />;
}

  return (
    <main className="flex min-h-screen items-center justify-center bg-[oklch(0.16_0.03_305.5)] p-4">
      <div
        className="relative overflow-hidden rounded-[2rem] shadow-2xl"
        style={{ width: 390, height: 844 }}
      >
        {/* Underlying purple journey */}
        <div
          className="absolute inset-0 transition-transform duration-1000"
          style={{
            transform: zooming ? "scale(0.25)" : "scale(1)",
            opacity: zooming ? 0 : 1,
            transitionTimingFunction: SOFT,
            transitionProperty: "transform, opacity",
          }}
        >
          {step === 1 || step === 2 ? <SowScreen onNext={() => setStep(3)} /> : null}
          {step === 3 ? <PlantScreen growing={growing} onPlant={startGrowth} /> : null}
          {step === 4 ? (
            <GrowScreen name={name} setName={setName} onSubmit={submitName} />
          ) : null}
        </div>

        {/* Screen 1 packaging, torn away by the drag */}
        {step === 1 ? (
          <div
            className="absolute inset-0"
            style={{
              clipPath: tearClipPath(progress),
              opacity: tearDone ? 0 : 1,
              transition: draggingRef.current
                ? "none"
                : `clip-path 600ms ${SPRING}, opacity 600ms ${SOFT}`,
            }}
          >
            <WelcomeScreen
              dimmed={dimmed}
              progress={progress}
              trackRef={trackRef}
              onHandleDown={(e) => {
                draggingRef.current = true;
                (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
              }}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
}

function WelcomeScreen({
  dimmed,
  progress,
  trackRef,
  onHandleDown,
}: {
  dimmed: boolean;
  progress: number;
  trackRef: React.RefObject<HTMLDivElement | null>;
  onHandleDown: (e: React.PointerEvent) => void;
}) {
  return (
    <section className="relative h-full w-full overflow-hidden bg-kraft">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.28),transparent_65%)]" />
      <div
        className="absolute inset-0 bg-plum-deep/55 transition-opacity duration-700"
        style={{ opacity: dimmed ? 1 : 0, transitionTimingFunction: SOFT }}
      />

      <div className="relative flex h-full flex-col items-center justify-center px-10 text-center">
        <img
          src={cacaoPod}
          alt="Gold line drawing of a cacao pod"
          width={1024}
          height={1024}
          className="w-64 drop-shadow-[0_0_30px_rgba(233,194,90,0.35)]"
        />
        <h1 className="mt-6 font-display text-5xl font-light tracking-wide text-gold-soft">
          COCOA
        </h1>
        <p className="mt-2 font-display text-lg italic text-gold/80">Theobroma Cacao</p>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 px-7 pb-10 transition-all duration-700"
        style={{
          opacity: dimmed ? 1 : 0,
          transform: dimmed ? "translateY(0)" : "translateY(24px)",
          transitionTimingFunction: SPRING,
        }}
      >
        <p className="mb-5 text-center font-sans text-[13px] leading-relaxed text-gold-soft/90">
          Slide the arrow across the screen to rip the bottom of the packaging.
        </p>
        <div
          ref={trackRef}
          className="relative h-16 rounded-full border border-gold/40 bg-plum-deep/60 backdrop-blur-sm"
        >
          <div
            className="absolute inset-y-1 left-1 rounded-full bg-gold/15"
            style={{ width: `calc(${Math.max(progress, 0.001) * 100}% - 0.5rem)` }}
          />
          <button
            type="button"
            aria-label="Drag to tear the packaging"
            onPointerDown={onHandleDown}
            className="absolute top-1/2 grid size-14 -translate-y-1/2 cursor-grab touch-none place-items-center rounded-full bg-gold text-plum-deep glow-gold active:cursor-grabbing"
            style={{
              left: `calc(0.25rem + ${progress} * (100% - 4rem))`,
              transition: `left 400ms ${SPRING}`,
            }}
          >
            <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden>
              <path
                d="M5 12h13m0 0-5-5m5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

function SowScreen({ onNext }: { onNext: () => void }) {
  const [seeding, setSeeding] = useState(false);

  const begin = () => {
    setSeeding(true);
    setTimeout(onNext, 1100);
  };

  return (
    <section className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-plum px-8 pb-28 pt-16">
      <div className="animate-soft-in">
        <CadburyMark />
      </div>

      <div className="animate-soft-in" style={{ animationDelay: "120ms" }}>
        <h2 className="font-display text-6xl font-bold leading-none text-gold-soft">
          Sow
          <span className="mt-2 block font-display text-xl font-normal italic text-gold/70">
            Cadbury
          </span>
        </h2>
        <p className="mt-5 max-w-[19rem] font-sans text-sm leading-relaxed text-foreground/75">
          Every bean inside this bar comes through Cocoa Life — a programme working
          alongside farming communities in Ghana and Côte d'Ivoire to grow cacao that
          restores soil, shade and income rather than stripping them away.
        </p>
        <button
          type="button"
          onClick={begin}
          disabled={seeding}
          className="mt-8 w-full rounded-full bg-gold px-6 py-4 font-sans text-sm font-bold uppercase tracking-[0.2em] text-plum-deep transition-transform duration-300 ease-spring hover:scale-[1.03] active:scale-95 disabled:opacity-70"
        >
          {seeding ? "Growing…" : "Begin growing"}
        </button>
      </div>

      {/* Kraft paper bottom gathers itself into a single gold seed */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[24%]"
        style={{
          transform: seeding ? "translateY(30%) scaleX(0.08)" : "translateY(0) scaleX(1)",
          opacity: seeding ? 0 : 1,
          transformOrigin: "50% 100%",
          transition: `transform 900ms ${SOFT}, opacity 900ms ${SOFT}`,
        }}
      >
        <TornStrip />
      </div>

      <img
        src={cacaoSeed}
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-16 left-1/2 w-40 -translate-x-1/2"
        style={{
          transform: seeding
            ? "translate(-50%, 0) scale(1)"
            : "translate(-50%, 90px) scale(0.15)",
          opacity: seeding ? 1 : 0,
          transition: `transform 1000ms ${SPRING}, opacity 700ms ${SOFT}`,
        }}
      />
    </section>
  );
}

function PlantScreen({ growing, onPlant }: { growing: boolean; onPlant: () => void }) {
  return (
    <section className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-plum px-8 pb-14 pt-16">
      <div className="animate-soft-in">
        <AsuMark />
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center">
        <img
          src={cacaoSeed}
          alt="Gold line drawing of a cacao seed pod"
          width={1024}
          height={1024}
          loading="lazy"
          className="relative w-48"
          style={{
            transform: growing
              ? "translateY(180px) scale(0.45)"
              : "translateY(0) scale(1)",
            opacity: growing ? 0 : 1,
            filter: "drop-shadow(0 0 18px rgba(233,194,90,0.35))",
            transition: `transform 1100ms ${SOFT}, opacity 900ms ${SOFT}`,
          }}
        />
        {/* soil line the seed sinks into */}
        <div
          className="absolute bottom-4 h-[2px] w-2/3 rounded-full bg-gold/50"
          style={{
            transform: growing ? "scaleX(1)" : "scaleX(0.6)",
            opacity: growing ? 1 : 0.4,
            transition: `transform 900ms ${SPRING}, opacity 900ms ${SOFT}`,
          }}
        />
      </div>

      <div>
        <h2 className="font-display text-6xl font-bold leading-none text-gold-soft">
          Plant
          <span className="mt-2 block font-display text-xl font-normal italic text-gold/70">
            Arizona State University
          </span>
        </h2>
        <p className="mt-5 max-w-[19rem] font-sans text-sm leading-relaxed text-foreground/75">
          ASU's Tribal Nations Policy Institute and Center for Tribal Digital Sovereignty
          plant knowledge alongside the seed — pairing Indigenous stewardship with digital
          tools so communities own the data behind the land they care for.
        </p>
        <button
          type="button"
          onClick={onPlant}
          disabled={growing}
          className="mt-7 w-full rounded-full bg-gold px-6 py-4 font-sans text-sm font-bold uppercase tracking-[0.2em] text-plum-deep transition-transform duration-300 ease-spring hover:scale-[1.03] active:scale-95 disabled:opacity-70"
        >
          {growing ? "Planting…" : "Plant my seed"}
        </button>
      </div>
    </section>
  );
}

function GrowScreen({
  name,
  setName,
  onSubmit,
}: {
  name: string;
  setName: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const [rooted, setRooted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRooted(true);
    setTimeout(() => onSubmit(e), 900);
  };

  return (
    <section className="relative flex h-full w-full animate-soft-in flex-col justify-between overflow-hidden bg-plum px-8 pb-14 pt-16">
      <ChangingFuturesMark />

      <img
        src={cacaoTree}
        alt="Gold line drawing of a full cacao tree"
        width={1024}
        height={1024}
        loading="lazy"
        className="mx-auto w-72 origin-bottom"
        style={{
          transform: rooted ? "scale(1.18)" : "scale(0.86)",
          opacity: rooted ? 1 : 0.85,
          filter: rooted ? "drop-shadow(0 0 30px rgba(233,194,90,0.4))" : "none",
          transition: `transform 900ms ${SPRING}, opacity 900ms ${SOFT}, filter 900ms ${SOFT}`,
        }}
      />

      <form onSubmit={handleSubmit}>
        <h2 className="font-display text-6xl font-bold leading-none text-gold-soft">
          Grow
          <span className="mt-2 block font-display text-xl font-normal italic text-gold/70">
            Changing Futures
          </span>
        </h2>
        <label className="mt-6 block font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/60">
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name your tree"
            className="mt-2 w-full rounded-xl border border-gold/40 bg-plum-deep/60 px-4 py-3 font-sans text-base font-normal normal-case tracking-normal text-foreground outline-none transition-colors focus:border-gold"
          />
        </label>
        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-gold px-6 py-4 font-sans text-sm font-bold uppercase tracking-[0.2em] text-plum-deep transition-transform duration-300 ease-spring hover:scale-[1.03] active:scale-95"
        >
          Root my tree
        </button>
      </form>
    </section>
  );
}

function ThankYouScreen({ name }: { name: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[oklch(0.16_0.03_305.5)] p-4">
      <div
        className="relative overflow-hidden rounded-[2rem] bg-plum shadow-2xl"
        style={{
          width: 390,
          height: 844,
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(233,194,90,0.12),transparent_70%)]" />

        <img
          src={cacaoTree}
          alt=""
          className="absolute bottom-[-120px] right-[-140px] w-[520px] opacity-15"
        />

        <div className="relative flex h-full animate-soft-in flex-col items-center justify-center px-10 text-center">
          <h2 className="font-display text-7xl font-bold leading-[0.9] text-gold-soft">
            Thank
            <span className="block">you</span>
          </h2>

          {name ? (
            <p className="mt-8 font-display text-3xl italic text-gold/80">{name}</p>
          ) : null}

          <p className="mt-8 max-w-[280px] font-display text-2xl italic leading-relaxed text-gold-soft">
            Your cocoa tree is now rooted.
          </p>

          <p className="mt-8 max-w-[300px] font-sans text-sm leading-7 text-foreground/75">
            Look to the front of the room to watch your tree join the grove, standing
            alongside all the others planted tonight.
          </p>
        </div>
      </div>
    </main>
  );
}

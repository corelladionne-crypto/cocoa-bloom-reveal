import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import cacaoBranch from "@/assets/cacao-branch.png.asset.json";
import cacaoBean from "@/assets/cacao-bean.png.asset.json";
import cacaoTree from "@/assets/cacao-tree-gold.png.asset.json";
import kraftPaper from "@/assets/kraft-paper.png.asset.json";
import kraftStrip from "@/assets/kraft-strip.png.asset.json";
import { AsuMark, CadburyMark, ChangingFuturesMark } from "@/components/rooted/logos";
import { PaperFibers, tearHalfPath } from "@/components/rooted/torn-edge";

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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RootedExperience,
});

const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const SOFT = "cubic-bezier(0.22, 1, 0.36, 1)";

type Step = 1 | 2 | 2.5 | 3 | 4 | 5;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("rooted-reduced-motion");
    if (stored !== null) setReduced(stored === "1");
    else setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const toggle = useCallback(() => {
    setReduced((r) => {
      window.localStorage.setItem("rooted-reduced-motion", r ? "0" : "1");
      return !r;
    });
  }, []);

  return { reduced, toggle };
}

function MotionToggle({ reduced, toggle }: { reduced: boolean; toggle: () => void }) {
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={reduced}
      className="absolute right-3 top-3 z-30 grid min-h-11 min-w-11 place-items-center rounded-full border border-gold/40 bg-plum-deep/70 px-4 font-sans text-[11px] uppercase tracking-[0.15em] text-gold-soft backdrop-blur-sm"
    >
      {reduced ? "Motion off" : "Motion on"}
    </button>
  );
}

function RootedExperience() {
  const { reduced, toggle } = useReducedMotion();
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

  const ms = useCallback((v: number) => (reduced ? Math.min(v, 120) : v), [reduced]);

  // The tear handle only appears once the guest taps the packaging.


  const completeTear = useCallback(() => {
    draggingRef.current = false;
    setProgress(1);
    setTearDone(true);
    setTimeout(() => setStep(2), ms(900));
  }, [ms]);

  const updateFromClientY = useCallback(
    (clientY: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
      setProgress(p);
      if (p >= 0.9) completeTear();
    },
    [completeTear],
  );

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (draggingRef.current) updateFromClientY(e.clientY);
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
  }, [updateFromClientY]);

  // Sow -> the torn paper balls up into a seed -> Plant
  const startGrowing = () => {
    setStep(2.5);
    setTimeout(() => setStep(3), ms(2400));
  };

  const startGrowth = () => {
    setGrowing(true);
    setTimeout(() => setStep(4), ms(2200));
  };

  const submitName = (e: React.FormEvent) => {
    e.preventDefault();
    setZooming(true);
    setTimeout(() => setStep(5), ms(1000));
  };

  useEffect(() => {
    if (step === 5 && !countedRef.current) {
      countedRef.current = true;
      setTrees((t) => t + 1);
    }
  }, [step]);

  if (step === 5) {
    return <GroveScreen trees={trees} name={name} reduced={reduced} toggle={toggle} />;
  }

  const halfTransition = draggingRef.current
    ? "none"
    : `clip-path ${ms(700)}ms ${SPRING}, transform ${ms(700)}ms ${SPRING}, opacity ${ms(600)}ms ${SOFT}`;

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[oklch(0.16_0.03_305.5)] p-4">
      <div
        className="relative overflow-hidden rounded-[2rem] shadow-2xl"
        style={{ width: 390, height: 844 }}
      >
        <MotionToggle reduced={reduced} toggle={toggle} />

        {/* Underlying purple journey */}
        <div
          className="absolute inset-0"
          style={{
            transform: zooming && !reduced ? "scale(0.25)" : "scale(1)",
            opacity: zooming ? 0 : 1,
            transition: `transform ${ms(1000)}ms ${SOFT}, opacity ${ms(1000)}ms ${SOFT}`,
          }}
        >
          {step === 1 || step === 2 || step === 2.5 ? (
            <SowScreen onNext={startGrowing} />
          ) : null}
          {step === 3 ? (
            <PlantScreen growing={growing} onPlant={startGrowth} reduced={reduced} />
          ) : null}
          {step === 4 ? (
            <GrowScreen name={name} setName={setName} onSubmit={submitName} />
          ) : null}
        </div>

        {/* Screen 1 packaging, ripped apart down the middle */}
        {step === 1 ? (
          <div
            className="absolute inset-0 select-none"
            style={{
              opacity: tearDone ? 0 : 1,
              pointerEvents: tearDone ? "none" : undefined,
              transition: `opacity ${ms(600)}ms ${SOFT}`,
            }}
          >
            {(["left", "right"] as const).map((side) => (
              <div
                key={side}
                className="absolute inset-0"
                style={{
                  clipPath: tearHalfPath(side, progress),
                  transform: `translateX(${(side === "left" ? -1 : 1) * progress * 150}px) rotate(${
                    (side === "left" ? -1 : 1) * progress * 4
                  }deg)`,
                  transformOrigin: side === "left" ? "left bottom" : "right bottom",
                  transition: halfTransition,
                }}
              >
                <WelcomeScreen dimmed={dimmed} reduced={reduced} />
              </div>
            ))}
            <PaperFibers progress={progress} reduceMotion={reduced} />
            <TearControls
              dimmed={dimmed}
              progress={progress}
              reduced={reduced}
              trackRef={trackRef}
              onHandleDown={(e) => {
                draggingRef.current = true;
                (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
              }}
            />
          </div>
        ) : null}


        {/* The torn paper crumples into a seed on the way to the Plant screen */}
        {step === 2.5 ? <PaperToSeed reduced={reduced} /> : null}
      </div>
    </main>
  );
}

/** The torn kraft scrap balls up, becomes a cacao seed and falls into the soil. */
function PaperToSeed({ reduced }: { reduced: boolean }) {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const a = setTimeout(() => setPhase(1), reduced ? 40 : 500);
    const b = setTimeout(() => setPhase(2), reduced ? 120 : 1400);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [reduced]);

  const dur = reduced ? 120 : 900;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-plum/80">
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          transform: `translate(-50%, ${phase === 2 ? "160px" : "-50%"}) scale(${
            phase === 0 ? 1 : 0.6
          }) rotate(${phase === 0 ? 0 : 18}deg)`,
          transition: `transform ${dur}ms ${phase === 2 ? SPRING : SOFT}`,
        }}
      >
        {/* crumpling paper scrap */}
        <div
          className="size-40 rounded-[45%_55%_60%_40%/50%_45%_55%_50%] bg-kraft shadow-2xl"
          style={{
            backgroundImage: `url(${kraftPaper.url})`,
            backgroundSize: "cover",
            opacity: phase === 0 ? 1 : 0,
            transition: `opacity ${dur / 2}ms ${SOFT}`,
          }}
        />
        {/* the seed it becomes */}
        <img
          src={cacaoBean.url}
          alt="Cacao seed formed from the torn packaging"
          className="absolute inset-0 m-auto w-40"
          style={{
            opacity: phase === 0 ? 0 : 1,
            transition: `opacity ${dur / 2}ms ${SOFT}`,
          }}
        />
      </div>

      {/* soil the seed lands in */}
      <img
        src={kraftStrip.url}
        alt=""
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-28 w-full object-cover"
        style={{
          transform: `translateY(${phase === 2 ? "0" : "40%"})`,
          transition: `transform ${dur}ms ${SOFT}`,
        }}
      />
    </div>
  );
}

function WelcomeScreen({
  dimmed,
  reduced,
}: {
  dimmed: boolean;
  reduced: boolean;
}) {
  return (
    <section
      className="relative h-full w-full overflow-hidden bg-kraft"
      style={{ backgroundImage: `url(${kraftPaper.url})`, backgroundSize: "cover" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.22),transparent_65%)]" />
      <div
        className="absolute inset-0 bg-plum-deep/45 transition-opacity"
        style={{
          opacity: dimmed ? 1 : 0,
          transitionDuration: reduced ? "120ms" : "700ms",
          transitionTimingFunction: SOFT,
        }}
      />

      <div className="relative flex h-full flex-col items-center justify-center px-10 text-center">
        <img
          src={cacaoBranch.url}
          alt="Gold line drawing of a cacao pod"
          draggable={false}
          className="w-64 drop-shadow-[0_0_30px_rgba(233,194,90,0.35)]"
        />
        <h1 className="mt-6 font-display text-5xl font-light tracking-wide text-gold-soft">
          COCOA
        </h1>
        <p className="mt-2 font-display text-lg italic text-gold/80">Theobroma Cacao</p>
      </div>
    </section>
  );
}

/** Vertical rip control: pull downwards to tear the pack open. */
function TearControls({
  dimmed,
  progress,
  reduced,
  trackRef,
  onHandleDown,
}: {
  dimmed: boolean;
  progress: number;
  reduced: boolean;
  trackRef: React.RefObject<HTMLDivElement | null>;
  onHandleDown: (e: React.PointerEvent) => void;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 transition-all"
      style={{
        opacity: dimmed ? 1 : 0,
        transitionDuration: reduced ? "120ms" : "700ms",
        transitionTimingFunction: SPRING,
      }}
    >
      <p
        className="absolute inset-x-0 top-10 px-10 text-center font-sans text-[13px] leading-relaxed text-gold-soft"
        style={{ opacity: 1 - progress }}
      >
        Pull the handle straight down to rip the packaging open.
      </p>
      <div
        ref={trackRef}
        className="pointer-events-auto absolute left-1/2 w-[72px] -translate-x-1/2 rounded-full border border-gold/30 bg-plum-deep/40 backdrop-blur-sm"
        style={{ top: "20%", height: "66%" }}
      >
        <div
          className="absolute inset-x-1 top-1 rounded-full bg-gold/15"
          style={{ height: `calc(${Math.max(progress, 0.001) * 100}% - 0.5rem)` }}
        />
        <button
          type="button"
          aria-label="Drag down to rip the packaging"
          onPointerDown={onHandleDown}
          className="absolute left-1/2 grid size-16 -translate-x-1/2 cursor-grab touch-none place-items-center rounded-full bg-gold text-plum-deep glow-gold active:cursor-grabbing"
          style={{
            top: `calc(0.25rem + ${progress} * (100% - 4.5rem))`,
            transition: `top ${reduced ? 100 : 400}ms ${SPRING}`,
          }}
        >
          <svg viewBox="0 0 24 24" className="size-7" fill="none" aria-hidden>
            <path
              d="M12 5v13m0 0-5-5m5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}


const BUTTON =
  "mt-8 min-h-14 w-full rounded-full bg-gold px-6 py-4 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-plum-deep transition-transform duration-300 ease-spring hover:scale-[1.03] active:scale-95";

function SowScreen({ onNext }: { onNext: () => void }) {
  return (
    <section className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-plum px-8 pb-28 pt-16">
      <div className="animate-soft-in">
        <CadburyMark />
      </div>

      <div className="animate-soft-in" style={{ animationDelay: "120ms" }}>
        <h2 className="font-display text-5xl font-light leading-tight text-gold-soft">
          Sow
          <span className="block font-display text-xl italic text-gold/70">Cadbury</span>
        </h2>
        <p className="mt-5 max-w-[19rem] font-sans text-sm leading-relaxed text-foreground/75">
          Every bean inside this bar comes through Cocoa Life — a programme working
          alongside farming communities in Ghana and Côte d'Ivoire to grow cacao that
          restores soil, shade and income rather than stripping them away.
        </p>
        <button type="button" onClick={onNext} className={BUTTON}>
          Start growing
        </button>
      </div>

      <img
        src={kraftStrip.url}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full object-cover"
      />
    </section>
  );
}

function PlantScreen({
  growing,
  onPlant,
  reduced,
}: {
  growing: boolean;
  onPlant: () => void;
  reduced: boolean;
}) {
  const dur = reduced ? 150 : 1400;

  return (
    <section className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-plum px-8 pb-14 pt-16">
      <div className="animate-soft-in">
        <AsuMark />
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-end pb-24">
        {/* sprout stem rising out of the soil */}
        <div
          className="absolute bottom-24 w-[3px] origin-bottom rounded-full bg-gradient-to-t from-gold via-gold-soft to-transparent"
          style={{
            height: 300,
            transform: growing ? "scaleY(1)" : "scaleY(0)",
            opacity: growing ? 1 : 0,
            filter: "drop-shadow(0 0 14px rgba(233,194,90,0.8))",
            transition: `transform ${dur}ms ${SOFT}, opacity ${dur / 2}ms ${SOFT}`,
          }}
        />
        {/* young tree unfurling from the planted seed */}
        <img
          src={cacaoTree.url}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute bottom-24 w-64 origin-bottom"
          style={{
            transform: growing ? "scale(1)" : "scale(0.05)",
            opacity: growing ? 1 : 0,
            transition: `transform ${dur}ms ${SPRING} ${reduced ? 0 : 500}ms, opacity ${dur}ms ${SOFT} ${
              reduced ? 0 : 500
            }ms`,
          }}
        />
        {/* the seed itself, dropping onto the ground as it is planted */}
        <img
          src={cacaoBean.url}
          alt="Gold line drawing of a cacao seed resting on the soil"
          loading="lazy"
          className="relative mb-20 w-40"
          style={{
            transform: growing ? "translateY(90px) scale(0.45)" : "translateY(0) scale(1)",
            opacity: growing ? 0 : 1,
            transition: `transform ${dur}ms ${SOFT}, opacity ${dur}ms ${SOFT} ${reduced ? 0 : 400}ms`,
          }}
        />
        {/* soil bed */}
        <img
          src={kraftStrip.url}
          alt=""
          aria-hidden
          className="absolute inset-x-[-2rem] bottom-0 h-24 w-[calc(100%+4rem)] object-cover"
        />
      </div>

      <div>
        <h2 className="font-display text-5xl font-light leading-tight text-gold-soft">
          Plant
          <span className="block font-display text-xl italic text-gold/70">
            Arizona State University
          </span>
        </h2>
        <button
          type="button"
          onClick={onPlant}
          disabled={growing}
          className={`${BUTTON} disabled:opacity-70`}
        >
          {growing ? "Growing…" : "Plant my seed"}
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
  return (
    <section className="relative flex h-full w-full animate-soft-in flex-col justify-between overflow-hidden bg-plum px-8 pb-14 pt-16">
      <ChangingFuturesMark />

      <img
        src={cacaoTree.url}
        alt="Gold line drawing of a full cacao tree"
        loading="lazy"
        className="mx-auto w-72"
      />

      <form onSubmit={onSubmit}>
        <h2 className="font-display text-5xl font-light leading-tight text-gold-soft">
          Grow
          <span className="block font-display text-xl italic text-gold/70">
            Changing Futures
          </span>
        </h2>
        <label className="mt-6 block font-sans text-[11px] uppercase tracking-[0.3em] text-foreground/60">
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name your tree"
            className="mt-2 min-h-14 w-full rounded-xl border border-gold/40 bg-plum-deep/60 px-4 py-3 font-sans text-base normal-case tracking-normal text-foreground outline-none transition-colors focus:border-gold"
          />
        </label>
        <button type="submit" className={BUTTON}>
          Root my tree
        </button>
      </form>
    </section>
  );
}

/** Wide room display: the shared grove that fills up as guests plant. */
function GroveScreen({
  trees,
  name,
  reduced,
  toggle,
}: {
  trees: number;
  name: string;
  reduced: boolean;
  toggle: () => void;
}) {
  // Deterministic scatter of planted trees/seedlings across the field.
  const plants = useMemo(() => {
    const n = 26;
    return Array.from({ length: n }, (_, i) => {
      const r = (s: number) => {
        const x = Math.sin(i * 91.3 + s * 47.7) * 43758.5453;
        return x - Math.floor(x);
      };
      const stage = r(1);
      return {
        left: 4 + r(2) * 88,
        top: 32 + r(3) * 54,
        size: stage < 0.35 ? 22 : stage < 0.7 ? 54 : 96,
        delay: r(4) * 1200,
        opacity: 0.55 + r(5) * 0.45,
      };
    });
  }, []);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[oklch(0.16_0.03_305.5)] p-4">
      <div className="relative w-full max-w-6xl overflow-hidden rounded-3xl bg-plum shadow-2xl aspect-[16/9]">
        <MotionToggle reduced={reduced} toggle={toggle} />

        {/* oversized watermark leaf illustration */}
        <img
          src={cacaoTree.url}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -right-24 top-0 h-full opacity-[0.06]"
        />

        {/* header */}
        <div className="relative flex flex-wrap items-baseline gap-x-6 gap-y-1 px-10 pt-8">
          <h1 className="font-display text-3xl font-semibold uppercase tracking-[0.08em] text-gold md:text-4xl">
            A Living Grove
          </h1>
          <p className="font-display text-sm italic uppercase tracking-[0.06em] text-foreground/85 md:text-lg">
            Presented to you by Arizona State University × Cadbury × Changing Futures
          </p>
        </div>

        {/* the grove itself */}
        <div className="absolute inset-0">
          {plants
            .slice(0, Math.max(4, Math.min(plants.length, trees % plants.length || 12)))
            .map((p, i) => (
              <img
                key={i}
                src={p.size > 30 ? cacaoTree.url : cacaoBean.url}
                alt=""
                aria-hidden
                className={reduced ? "absolute" : "absolute animate-soft-in"}
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  width: p.size,
                  opacity: p.opacity,
                  animationDelay: `${p.delay}ms`,
                }}
              />
            ))}
        </div>

        {/* newest tree, called out with its name */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="font-display text-lg italic text-gold-soft/90">
            {name ? `${name} is rooted.` : "Your tree is rooted."}
          </p>
        </div>

        {/* footer */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-10 pb-8">
          <div className="flex items-center gap-10 opacity-90">
            <ChangingFuturesMark className="h-12 w-24" />
            <CadburyMark className="h-8 w-32" />
            <AsuMark className="h-8 w-20" />
          </div>
          <div className="text-right">
            <p className="font-display text-lg italic text-foreground/90 md:text-2xl">
              Trees Planted: {trees}/400
            </p>
            <div className="mt-2 h-1 w-64 overflow-hidden rounded-full bg-foreground/15">
              <div
                className="h-full rounded-full bg-gold transition-all duration-1000 ease-spring"
                style={{ width: `${(trees / 400) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

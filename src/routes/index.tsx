import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";

import cacaoBean from "@/assets/cacao-bean.svg";
import cacaoBranch from "@/assets/cacao-branch.svg";
import cacaoTree from "@/assets/cacao-tree-gold.svg";
import kraftStrip from "@/assets/kraft-strip.svg";
import { AsuMark, CadburyMark, ChangingFuturesMark } from "@/components/rooted/logos";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "COCOA / Rooted — A Gifting Reveal" },
      { name: "description", content: "A tactile cocoa experience: reveal, sow, plant, and grow." },
    ],
  }),
  component: RootedExperience,
});

type Step = 1 | 2 | 3 | 4 | 5;
type Planting = {
  id: string;
  name: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  plantedAt: number;
};

const STORE_KEY = "cocoa-rooted-plantings";
const CHANNEL_NAME = "cocoa-rooted-grove";
const BUTTON =
  "inline-flex min-h-14 items-center justify-center rounded-full bg-gold px-7 py-4 font-sans text-xs font-semibold uppercase tracking-[0.24em] text-plum-deep transition duration-300 hover:scale-[1.02] hover:bg-gold-soft active:scale-95 disabled:opacity-50";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return reduced;
}

function MotionToggle({ reduced }: { reduced: boolean }) {
  return (
    <span className="absolute right-5 top-5 z-50 rounded-full border border-gold/20 bg-plum-deep/50 px-3 py-2 font-sans text-[9px] uppercase tracking-[0.18em] text-gold/70 backdrop-blur-sm">
      {reduced ? "Reduced motion" : "Rooted"}
    </span>
  );
}

function readPlantings(): Planting[] {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as Planting[]) : [];
  } catch {
    return [];
  }
}

function savePlanting(planting: Planting) {
  const next = [...readPlantings(), planting];
  window.localStorage.setItem(STORE_KEY, JSON.stringify(next));
  window.dispatchEvent(new StorageEvent("storage", { key: STORE_KEY, newValue: JSON.stringify(next) }));
  try {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage({ type: "planting", planting, plantings: next });
    channel.close();
  } catch {
    // BroadcastChannel is optional; localStorage still keeps the same-browser projector in sync.
  }
}

function RootedExperience() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [landingOpened, setLandingOpened] = useState(false);
  const [planting, setPlanting] = useState(false);
  const submittedRef = useRef(false);

  const rootTree = () => {
    if (submittedRef.current || !name.trim()) return;
    submittedRef.current = true;
    const planting: Planting = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      x: 7 + Math.random() * 86,
      y: 48 + Math.random() * 38,
      scale: 0.55 + Math.random() * 0.65,
      rotation: -7 + Math.random() * 14,
      plantedAt: Date.now(),
    };
    savePlanting(planting);
    setStep(5);
  };

  const startAgain = () => {
    submittedRef.current = false;
    setName("");
    setLandingOpened(false);
    setStep(1);
  };

  return (
    <main className="min-h-dvh overflow-hidden bg-[#24152A] text-foreground">
      <div className="relative min-h-dvh w-full">
        <MotionToggle reduced={reduced} />
        {step === 1 && (
          <LandingScreen
            opened={landingOpened}
            onOpen={() => setLandingOpened(true)}
            onBegin={() => setStep(2)}
          />
        )}
        {step === 2 && <SowScreen onNext={() => setStep(3)} reduced={reduced} />}
        {step === 3 && (
          <PlantScreen
            planting={planting}
            onPlant={() => {
              setPlanting(true);
              window.setTimeout(() => setStep(4), reduced ? 500 : 1900);
            }}
            reduced={reduced}
          />
        )}
        {step === 4 && (
          <GrowScreen
            name={name}
            setName={setName}
            onSubmit={(event) => {
              event.preventDefault();
              rootTree();
            }}
          />
        )}
        {step === 5 && <ThankYouScreen name={name} onAgain={startAgain} />}
      </div>
    </main>
  );
}

function LandingScreen({ opened, onOpen, onBegin }: { opened: boolean; onOpen: () => void; onBegin: () => void }) {
  return (
    <section
      className="relative min-h-dvh overflow-hidden bg-plum"
      onClick={() => {
        if (!opened) onOpen();
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(233,194,90,0.08),transparent_38%),linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.16))]" />
      <div className="relative flex min-h-dvh flex-col items-center justify-center px-6 pb-24 text-center">
        <div className="mb-8 font-sans text-[10px] uppercase tracking-[0.42em] text-gold/60">COCOA / ROOTED</div>
        <img src={cacaoBranch} alt="Cacao pod and leaves" className="w-[min(68vw,560px)] drop-shadow-[0_0_28px_rgba(233,194,90,0.12)]" draggable={false} />
        <h1 className="mt-8 font-display text-[clamp(4rem,11vw,8rem)] font-light leading-none tracking-[0.08em] text-gold">COCOA</h1>
        <p className="mt-3 font-display text-xl italic text-gold-soft/80">Grown, not just made.</p>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpen();
          }}
          className="mt-10 font-display text-lg italic text-gold/75 transition hover:text-gold"
        >
          Tap anywhere to begin
        </button>
      </div>

      <div
        className={`absolute inset-x-0 bottom-0 z-20 transform transition-transform duration-700 ease-soft ${opened ? "translate-y-0" : "translate-y-full"}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto max-w-3xl rounded-t-[2.5rem] border border-gold/15 bg-plum-deep/95 px-7 pb-8 pt-6 shadow-2xl backdrop-blur-xl md:px-12 md:pt-8">
          <div className="mx-auto mb-7 h-1 w-12 rounded-full bg-gold/30" />
          <div className="flex items-end justify-between gap-5">
            <div className="max-w-xl text-left">
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/55">A small action can grow something bigger.</p>
              <h2 className="mt-2 font-display text-4xl font-light text-gold-soft md:text-5xl">Open the reveal.</h2>
              <p className="mt-2 max-w-lg font-sans text-sm leading-relaxed text-foreground/65">Unwrap the story of cacao, place a seed in the ground, and leave a living mark behind.</p>
            </div>
            <button type="button" onClick={onBegin} className={`${BUTTON} shrink-0`}>Begin</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SowScreen({ onNext, reduced }: { onNext: () => void; reduced: boolean }) {
  const [transitioning, setTransitioning] = useState(false);

  const beginGrowing = () => {
    if (transitioning) return;
    setTransitioning(true);
    window.setTimeout(onNext, reduced ? 350 : 1250);
  };

  return (
    <section className={`relative min-h-dvh overflow-hidden bg-plum transition-all duration-700 ${transitioning ? "scale-[1.02] opacity-0" : "opacity-100"}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(233,194,90,0.08),transparent_34%)]" />
      <div className="relative z-10 flex min-h-dvh flex-col px-6 pb-8 pt-8 md:px-12 md:pt-10">
        <div className="flex items-center justify-between">
          <CadburyMark className="h-12 w-48" />
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/45">01 / 04</span>
        </div>

        <div className="mx-auto mt-12 flex w-full max-w-4xl flex-1 flex-col items-center justify-end text-center">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-[2.25rem] bg-[#C99E68] px-7 pb-10 pt-16 text-left shadow-2xl shadow-black/20 md:px-12">
            <img src={kraftStrip} alt="Torn kraft paper" className="absolute inset-x-0 top-0 h-16 w-full" draggable={false} />
            <div className="relative z-10">
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-plum-deep/55">SOW / CADBURY</p>
              <h2 className="mt-2 font-display text-5xl font-light leading-none text-plum-deep md:text-7xl">Sow.</h2>
              <p className="mt-5 max-w-xl font-sans text-sm leading-7 text-plum-deep/75 md:text-base">Every bar begins with cacao. This moment is about what happens before chocolate — the seed, the soil, and the people who grow it.</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button type="button" onClick={beginGrowing} className={BUTTON} disabled={transitioning}>Start growing</button>
                <span className="font-display text-sm italic text-plum-deep/55">Watch the paper become a seed.</span>
              </div>
            </div>
          </div>

          <div className={`pointer-events-none absolute bottom-[18%] left-1/2 -translate-x-1/2 transition-all duration-1000 ease-soft ${transitioning ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
            <img src={cacaoBean} alt="Cacao seed" className="w-32 md:w-44" />
          </div>
        </div>
      </div>
    </section>
  );
}

function PlantScreen({ planting, onPlant, reduced }: { planting: boolean; onPlant: () => void; reduced: boolean }) {
  return (
    <section className="relative min-h-dvh overflow-hidden bg-plum px-6 pb-8 pt-8 md:px-12 md:pt-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(233,194,90,0.08),transparent_40%)]" />
      <div className="relative z-10 flex min-h-dvh flex-col">
        <div className="flex items-center justify-between">
          <AsuMark className="h-12 w-32" />
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/45">02 / 04</span>
        </div>

        <div className="relative flex flex-1 items-end justify-center pb-24 pt-10">
          <div className="absolute bottom-20 left-0 right-0 h-20 overflow-hidden bg-[#C99E68]/90">
            <img src={kraftStrip} alt="Torn soil edge" className="absolute -top-8 h-14 w-full rotate-180" />
            <div className="absolute inset-x-0 bottom-0 h-10 bg-[#B88955]/60" />
          </div>
          <img
            src={cacaoTree}
            alt="Cacao tree illustration"
            className="absolute bottom-[5.4rem] w-[min(65vw,560px)] origin-bottom transition-all ease-spring"
            style={{
              transform: planting ? "scale(1)" : "scale(0.02)",
              opacity: planting ? 1 : 0,
              transitionDuration: reduced ? "250ms" : "1300ms",
              transitionDelay: reduced ? "0ms" : "600ms",
            }}
          />
          <img
            src={cacaoBean}
            alt="Cacao seed"
            className="relative z-10 w-[min(22vw,150px)] transition-all ease-soft"
            style={{
              transform: planting ? "translateY(190px) scale(0.3) rotate(12deg)" : "translateY(-20px) scale(1)",
              opacity: planting ? 0 : 1,
              transitionDuration: reduced ? "250ms" : "800ms",
            }}
          />
        </div>

        <div className="mx-auto w-full max-w-2xl text-center">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/55">PLANT / ARIZONA STATE UNIVERSITY</p>
          <h2 className="mt-2 font-display text-5xl font-light text-gold-soft md:text-6xl">Put it in the ground.</h2>
          <button type="button" onClick={onPlant} disabled={planting} className={`mt-6 ${BUTTON}`}>{planting ? "Taking root…" : "Plant my seed"}</button>
        </div>
      </div>
    </section>
  );
}

function GrowScreen({ name, setName, onSubmit }: { name: string; setName: (value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <section className="relative min-h-dvh overflow-hidden bg-plum px-6 pb-8 pt-8 md:px-12 md:pt-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(233,194,90,0.08),transparent_38%)]" />
      <div className="relative z-10 flex min-h-dvh flex-col">
        <div className="flex items-center justify-between">
          <ChangingFuturesMark className="h-20 w-44" />
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/45">03 / 04</span>
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <img src={cacaoTree} alt="Cacao tree illustration" className="w-[min(58vw,500px)] opacity-95" />
        </div>

        <form onSubmit={onSubmit} className="mx-auto w-full max-w-xl">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/55">GROW / CHANGING FUTURES</p>
          <h2 className="mt-2 font-display text-5xl font-light leading-none text-gold-soft md:text-6xl">Give your tree a name.</h2>
          <label className="mt-7 block">
            <span className="sr-only">Name your tree</span>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Type your name"
              className="h-16 w-full rounded-2xl border border-gold/30 bg-plum-deep/70 px-5 font-display text-2xl italic text-gold-soft outline-none placeholder:text-gold/30 focus:border-gold"
            />
          </label>
          <button type="submit" className={`mt-4 w-full ${BUTTON}`}>Root my tree</button>
        </form>
      </div>
    </section>
  );
}

function ThankYouScreen({ name, onAgain }: { name: string; onAgain: () => void }) {
  return (
    <section className="relative min-h-dvh overflow-hidden bg-plum px-6 py-8 md:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(233,194,90,0.1),transparent_36%)]" />
      <div className="relative flex min-h-dvh flex-col items-center justify-between text-center">
        <div className="flex w-full items-center justify-between">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/45">04 / 04</span>
          <span className="font-display text-lg italic text-gold/70">COCOA / ROOTED</span>
        </div>

        <div className="flex flex-col items-center">
          <img src={cacaoBranch} alt="Cacao illustration" className="mb-8 w-[min(54vw,420px)]" />
          <p className="font-sans text-[10px] uppercase tracking-[0.34em] text-gold/55">THANK YOU</p>
          <h2 className="mt-4 font-display text-6xl font-light text-gold-soft md:text-8xl">{name || "Friend"}</h2>
          <p className="mt-4 max-w-lg font-display text-xl italic leading-relaxed text-foreground/75">Your seed is rooted. Look to the grove to see it join the others.</p>
        </div>

        <button type="button" onClick={onAgain} className="mb-2 font-display text-lg italic text-gold/70 transition hover:text-gold">Plant another tree</button>
      </div>
    </section>
  );
}

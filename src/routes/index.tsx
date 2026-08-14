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
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const SOFT = "cubic-bezier(0.22, 1, 0.36, 1)";
const KRAFT = "#C99E68";
const GOLD = "#E9C25A";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return reduced;
}

function MotionToggle({ reduced }: { reduced: boolean }) {
  return (
    <span className="absolute right-3 top-3 z-50 rounded-full border border-gold/20 bg-plum-deep/50 px-3 py-2 font-sans text-[9px] uppercase tracking-[0.18em] text-gold/70 backdrop-blur-sm">
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

function seamY(i: number, total = 70) {
  const n = (x: number) => {
    const v = Math.sin(x * 127.1 + 311.7) * 43758.5453;
    return v - Math.floor(v);
  };
  const t = i / total;
  return 50 + Math.sin(t * Math.PI * 7) * 1.2 + (n(i) - 0.5) * 2.4 + Math.sin(t * Math.PI * 2.2) * 1.8;
}

function halfClip(side: "top" | "bottom", progress: number) {
  const total = 70;
  const points = Array.from({ length: total + 1 }, (_, i) => `${((i / total) * 100).toFixed(2)}% ${seamY(i, total).toFixed(2)}%`);
  if (side === "top") return `polygon(0 0,100% 0,100% ${seamY(total, total)}%,${points.slice().reverse().join(",")})`;
  return `polygon(${points.join(",")},100% 100%,0 100%)`;
}

function RootedExperience() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
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
    setPlanting(false);
    setStep(1);
  };

  return (
    <main className="min-h-dvh overflow-hidden bg-[#24152A] text-foreground">
      <div className="relative mx-auto min-h-dvh w-full max-w-[430px] overflow-hidden">
        <MotionToggle reduced={reduced} />
        {step === 1 && <LandingScreen onBegin={() => setStep(2)} reduced={reduced} />}
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

function LandingScreen({ onBegin, reduced }: { onBegin: () => void; reduced: boolean }) {
  const [tearProgress, setTearProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const completedRef = useRef(false);

  const setProgressFromPointer = (clientX: number, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setTearProgress(progress);
  };

  const finishTear = () => {
    if (completedRef.current) return;
    setDragging(false);
    if (tearProgress >= 0.72) {
      completedRef.current = true;
      const start = performance.now();
      const from = tearProgress;
      const duration = reduced ? 180 : 520;
      const animate = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        setTearProgress(from + (1 - from) * p);
        if (p < 1) requestAnimationFrame(animate);
        else window.setTimeout(onBegin, reduced ? 100 : 500);
      };
      requestAnimationFrame(animate);
    } else {
      const start = performance.now();
      const from = tearProgress;
      const duration = reduced ? 100 : 300;
      const animate = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        setTearProgress(from * (1 - p));
        if (p < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  };

  return (
    <section className="relative min-h-dvh overflow-hidden bg-plum touch-none">
      <div
        className="absolute inset-0"
        style={{
          background: KRAFT,
          backgroundImage: "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.18), transparent 62%)",
        }}
      />

      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: halfClip("top", tearProgress),
          transform: `translateY(${-tearProgress * 90}px) rotate(${-tearProgress * 1.2}deg)`,
          transition: dragging ? "none" : `transform ${reduced ? 180 : 600}ms ${SPRING}`,
        }}
      >
        <WelcomePackaging />
      </div>
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: halfClip("bottom", tearProgress),
          transform: `translateY(${tearProgress * 90}px) rotate(${tearProgress * 1.2}deg)`,
          transition: dragging ? "none" : `transform ${reduced ? 180 : 600}ms ${SPRING}`,
        }}
      >
        <WelcomePackaging />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[17%] z-30 px-8">
        <p className="mb-3 text-center font-sans text-[10px] uppercase tracking-[0.24em] text-gold/80 drop-shadow-[0_1px_8px_rgba(0,0,0,0.22)]">
          Slide the arrow across the screen to rip the packaging
        </p>
        <div
          className="pointer-events-auto relative h-14 w-full rounded-full bg-plum-deep/90 shadow-xl ring-1 ring-gold/20 touch-none"
          onPointerMove={(event) => {
            if (!dragging || completedRef.current) return;
            setProgressFromPointer(event.clientX, event.currentTarget);
          }}
          onPointerUp={finishTear}
          onPointerCancel={finishTear}
        >
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-gold/20"
            style={{ width: `${Math.max(8, tearProgress * 100)}%` }}
          />
          <button
            type="button"
            aria-label="Slide to rip the packaging"
            disabled={completedRef.current}
            className="absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-plum-deep shadow-lg transition-transform active:scale-95"
            style={{ left: `calc(${tearProgress * 100}% - 24px)`, transform: `translateY(-50%) ${dragging ? "scale(1.06)" : "scale(1)"}` }}
            onPointerDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setDragging(true);
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (!dragging || completedRef.current) return;
              const track = event.currentTarget.parentElement;
              if (track) setProgressFromPointer(event.clientX, track);
            }}
            onPointerUp={(event) => {
              event.stopPropagation();
              finishTear();
            }}
          >
            <span className="text-xl leading-none">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

function WelcomePackaging() {
  return (
    <section className="relative h-full w-full overflow-hidden" style={{ background: KRAFT }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.18),transparent_62%)]" />
      <div className="relative flex h-full flex-col items-center justify-center px-8 text-center">
        <img src={cacaoBranch} alt="Cocoa pod illustration" className="w-[74%] drop-shadow-[0_0_24px_rgba(233,194,90,0.32)]" draggable={false} />
        <p className="mt-7 font-display text-[11px] italic text-plum-deep/80">An academic experience presented by Arizona State University and Cadbury</p>
        <h1 className="mt-2 font-display text-6xl font-light tracking-wide text-[#E9C25A]">COCOA</h1>
        <p className="mt-1 font-display text-xl italic text-plum-deep">Theobroma Cacao</p>
        <p className="absolute bottom-16 font-display text-base italic text-[#E9C25A]">Grown, not just made</p>
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

      <div className={`absolute bottom-0 left-0 right-0 z-0 transition-transform duration-1000 ease-soft ${transitioning ? "translate-y-[115%]" : "translate-y-0"}`}>
        <div className="relative h-[72vh] w-full bg-[#C99E68] shadow-2xl">
          <img src={kraftStrip} alt="Torn kraft paper" className="absolute inset-x-0 -top-10 h-14 w-full" draggable={false} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_20%,rgba(255,255,255,0.16),transparent_52%)]" />
        </div>
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col px-6 pb-8 pt-8">
        <div className="flex items-center justify-between">
          <CadburyMark className="h-12 w-48" />
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/45">01 / 04</span>
        </div>

        <div className="mx-auto mt-12 flex w-full flex-1 flex-col justify-end text-left">
          <div className="relative mx-auto w-[92%] overflow-hidden rounded-[2rem] bg-[#C99E68] px-7 pb-10 pt-16 shadow-2xl shadow-black/20">
            <img src={kraftStrip} alt="Torn kraft paper edge" className="absolute inset-x-0 top-0 h-16 w-full" draggable={false} />
            <div className="relative z-10">
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-plum-deep/55">SOW / CADBURY</p>
              <h2 className="mt-2 font-display text-5xl font-light leading-none text-plum-deep">Sow.</h2>
              <p className="mt-5 font-sans text-sm leading-7 text-plum-deep/75">Every bean inside this Cocoa Life programme comes through farming communities working to grow cacao, restore soil and build sustainable income.</p>
              <button type="button" onClick={beginGrowing} className={`mt-8 ${BUTTON}`} disabled={transitioning}>Start growing</button>
            </div>
          </div>
        </div>

        <div className={`pointer-events-none absolute bottom-[19%] left-1/2 z-20 -translate-x-1/2 transition-all ease-soft ${transitioning ? "scale-100 opacity-100" : "scale-0 opacity-0"}`} style={{ transitionDuration: reduced ? "250ms" : "800ms" }}>
          <img src={cacaoBean} alt="Cacao seed" className="w-32" />
        </div>
      </div>
    </section>
  );
}

function PlantScreen({ planting, onPlant, reduced }: { planting: boolean; onPlant: () => void; reduced: boolean }) {
  return (
    <section className="relative min-h-dvh overflow-hidden bg-plum px-6 pb-8 pt-8">
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
            className="absolute bottom-[5.4rem] w-[72%] origin-bottom transition-all ease-spring"
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
            className="relative z-10 w-[32%] transition-all ease-soft"
            style={{
              transform: planting ? "translateY(190px) scale(0.3) rotate(12deg)" : "translateY(-20px) scale(1)",
              opacity: planting ? 0 : 1,
              transitionDuration: reduced ? "250ms" : "800ms",
            }}
          />
        </div>

        <div className="mx-auto w-full text-center">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/55">PLANT / ARIZONA STATE UNIVERSITY</p>
          <h2 className="mt-2 font-display text-5xl font-light text-gold-soft">Put it in the ground.</h2>
          <button type="button" onClick={onPlant} disabled={planting} className={`mt-6 ${BUTTON}`}>{planting ? "Taking root…" : "Plant my seed"}</button>
        </div>
      </div>
    </section>
  );
}

function GrowScreen({ name, setName, onSubmit }: { name: string; setName: (value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <section className="relative min-h-dvh overflow-hidden bg-plum px-6 pb-8 pt-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(233,194,90,0.08),transparent_38%)]" />
      <div className="relative z-10 flex min-h-dvh flex-col">
        <div className="flex items-center justify-between">
          <ChangingFuturesMark className="h-20 w-44" />
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/45">03 / 04</span>
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <img src={cacaoTree} alt="Cacao tree illustration" className="w-[58%] opacity-95" />
        </div>

        <form onSubmit={onSubmit} className="mx-auto w-full">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/55">GROW / CHANGING FUTURES</p>
          <h2 className="mt-2 font-display text-5xl font-light leading-none text-gold-soft">Give your tree a name.</h2>
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
    <section className="relative min-h-dvh overflow-hidden bg-plum px-6 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(233,194,90,0.1),transparent_36%)]" />
      <div className="relative flex min-h-dvh flex-col items-center justify-between text-center">
        <div className="flex w-full items-center justify-between">
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/45">04 / 04</span>
          <span className="font-display text-lg italic text-gold/70">COCOA / ROOTED</span>
        </div>

        <div className="flex flex-col items-center">
          <img src={cacaoBranch} alt="Cacao illustration" className="mb-8 w-[54%]" />
          <p className="font-sans text-[10px] uppercase tracking-[0.34em] text-gold/55">THANK YOU</p>
          <h2 className="mt-4 max-w-full break-words font-display text-6xl font-light text-gold-soft">{name || "Friend"}</h2>
          <p className="mt-4 max-w-sm font-display text-xl italic leading-relaxed text-foreground/75">Your seed is rooted. Look to the grove to see it join the others.</p>
        </div>

        <button type="button" onClick={onAgain} className="mb-2 font-display text-lg italic text-gold/70 transition hover:text-gold">Plant another tree</button>
      </div>
    </section>
  );
}

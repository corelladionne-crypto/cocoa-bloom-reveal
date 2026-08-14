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
    return JSON.parse(window.localStorage.getItem(STORE_KEY) || "[]") as Planting[];
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
  } catch {}
}

function tornEdge(progress: number) {
  const total = 28;
  return Array.from({ length: total + 1 }, (_, i) => {
    const y = (i / total) * 100;
    const wobble = Math.sin(i * 1.8) * 0.45 + Math.sin(i * 4.2) * 0.22;
    return `${Math.max(0, Math.min(100, progress * 100 + wobble))}% ${y}%`;
  });
}

function tearClip(side: "left" | "right", progress: number) {
  const edge = tornEdge(progress);
  if (side === "left") return `polygon(0 0,${edge.join(",")},0 100%)`;
  return `polygon(${edge.join(",")},100% 100%,100% 0)`;
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
    savePlanting({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      x: 7 + Math.random() * 86,
      y: 48 + Math.random() * 38,
      scale: 0.55 + Math.random() * 0.65,
      rotation: -7 + Math.random() * 14,
      plantedAt: Date.now(),
    });
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
              window.setTimeout(() => setStep(4), reduced ? 550 : 1900);
            }}
            reduced={reduced}
          />
        )}
        {step === 4 && <GrowScreen name={name} setName={setName} onSubmit={(e) => { e.preventDefault(); rootTree(); }} />}
        {step === 5 && <ThankYouScreen name={name} onAgain={startAgain} />}
      </div>
    </main>
  );
}

function LandingScreen({ onBegin, reduced }: { onBegin: () => void; reduced: boolean }) {
  const [tearProgress, setTearProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const complete = useRef(false);

  const setProgress = (clientX: number, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    setTearProgress(Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)));
  };

  const finish = () => {
    if (complete.current) return;
    setDragging(false);
    if (tearProgress < 0.72) {
      const from = tearProgress;
      const start = performance.now();
      const animate = (now: number) => {
        const p = Math.min(1, (now - start) / (reduced ? 120 : 280));
        setTearProgress(from * (1 - p));
        if (p < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      return;
    }
    complete.current = true;
    const from = tearProgress;
    const start = performance.now();
    const animate = (now: number) => {
      const p = Math.min(1, (now - start) / (reduced ? 180 : 500));
      setTearProgress(from + (1 - from) * p);
      if (p < 1) requestAnimationFrame(animate);
      else window.setTimeout(onBegin, reduced ? 100 : 420);
    };
    requestAnimationFrame(animate);
  };

  return (
    <section className="relative min-h-dvh overflow-hidden bg-plum touch-none">
      <div className="absolute inset-0 bg-plum" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: tearClip("left", tearProgress), transform: `translateX(${-tearProgress * 7}px)`, transition: dragging ? "none" : `transform ${reduced ? 150 : 500}ms ${SPRING}` }}>
          <WelcomePackaging />
        </div>
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: tearClip("right", tearProgress), transform: `translateX(${tearProgress * 7}px)`, transition: dragging ? "none" : `transform ${reduced ? 150 : 500}ms ${SPRING}` }}>
          <WelcomePackaging />
        </div>
        <div aria-hidden className="pointer-events-none absolute top-0 z-20 h-full w-5 -translate-x-1/2 bg-plum-deep/90" style={{ left: `${tearProgress * 100}%`, clipPath: "polygon(38% 0,72% 4%,42% 9%,72% 14%,35% 20%,70% 25%,40% 31%,74% 37%,36% 44%,68% 50%,38% 57%,72% 63%,34% 70%,70% 76%,40% 83%,72% 89%,36% 95%,68% 100%)", opacity: tearProgress > 0.01 ? 1 : 0 }} />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[6%] z-30 px-7">
        <p className="mx-auto mb-3 max-w-[280px] text-center font-sans text-[10px] uppercase leading-[1.45] tracking-[0.2em] text-gold/80">Slide the arrow across the screen to rip the packaging</p>
        <div className="pointer-events-auto relative h-14 w-full rounded-full bg-plum-deep/95 shadow-xl ring-1 ring-gold/20" onPointerMove={(e) => dragging && setProgress(e.clientX, e.currentTarget)} onPointerUp={finish} onPointerCancel={finish}>
          <div className="absolute inset-y-0 left-0 rounded-full bg-gold/20" style={{ width: `${Math.max(8, tearProgress * 100)}%` }} />
          <button type="button" aria-label="Slide to rip the packaging" className="absolute top-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-gold text-plum-deep shadow-lg" style={{ left: `calc(${tearProgress * 100}% - 24px)`, transform: "translateY(-50%)" }} onPointerDown={(e) => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); setDragging(true); }} onPointerMove={(e) => { const track = e.currentTarget.parentElement; if (dragging && track) setProgress(e.clientX, track); }} onPointerUp={finish}>
            <span className="text-xl leading-none">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

function WelcomePackaging() {
  return (
    <section className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#C99E68]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.18),transparent_60%)]" />
      <div className="relative flex h-full w-full flex-col items-center justify-center px-7 pb-32 pt-10 text-center">
        <img src={cacaoBranch} alt="Cocoa pod illustration" className="w-[62%] max-h-[29vh] object-contain drop-shadow-[0_0_24px_rgba(233,194,90,0.32)]" draggable={false} />
        <p className="mt-5 max-w-[260px] font-display text-[11px] italic leading-tight text-plum-deep/80">An academic experience presented by Arizona State University and Cadbury</p>
        <h1 className="mt-2 font-display text-[4.25rem] font-light leading-none tracking-wide text-[#E9C25A]">COCOA</h1>
        <p className="mt-1 font-display text-lg italic text-plum-deep">Theobroma Cacao</p>
        <p className="absolute bottom-28 font-display text-sm italic text-[#E9C25A]">Grown, not just made</p>
      </div>
    </section>
  );
}

function SowScreen({ onNext, reduced }: { onNext: () => void; reduced: boolean }) {
  const [transitioning, setTransitioning] = useState(false);
  return (
    <section className={`relative min-h-dvh overflow-hidden bg-plum transition-all ${transitioning ? "scale-[1.015] opacity-0" : ""}`} style={{ transitionDuration: reduced ? "350ms" : "750ms" }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(233,194,90,0.08),transparent_34%)]" />
      <div className={`absolute inset-x-0 bottom-0 z-0 h-[66vh] transition-transform ${transitioning ? "translate-y-[108%]" : ""}`} style={{ transitionDuration: reduced ? "350ms" : "1050ms", transitionTimingFunction: SOFT }}>
        <div className="relative h-full w-full bg-[#C99E68]"><img src={kraftStrip} alt="Torn kraft paper" className="absolute inset-x-0 -top-8 h-16 w-full object-cover" draggable={false} /><div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_20%,rgba(255,255,255,0.16),transparent_52%)]" /></div>
      </div>
      <div className="relative z-10 flex min-h-dvh flex-col px-6 pb-8 pt-8">
        <div className="flex items-center justify-between"><CadburyMark className="h-12 w-44" /><span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/45">01 / 04</span></div>
        <div className="mx-auto flex w-full flex-1 flex-col justify-end pb-4 text-left">
          <div className="relative mx-auto w-[92%] overflow-hidden rounded-[2rem] bg-[#C99E68] px-7 pb-9 pt-14 shadow-2xl shadow-black/20">
            <img src={kraftStrip} alt="Torn kraft paper edge" className="absolute inset-x-0 top-0 h-14 w-full object-cover" draggable={false} />
            <div className="relative z-10"><p className="font-sans text-[10px] uppercase tracking-[0.3em] text-plum-deep/55">SOW / CADBURY</p><h2 className="mt-2 font-display text-[3.25rem] font-light leading-none text-plum-deep">Sow.</h2><p className="mt-4 font-sans text-[13px] leading-6 text-plum-deep/75">Every bean inside this Cocoa Life programme comes through farming communities working to grow cacao, restore soil and build sustainable income.</p><button type="button" onClick={() => { setTransitioning(true); window.setTimeout(onNext, reduced ? 350 : 1150); }} disabled={transitioning} className={`mt-6 ${BUTTON}`}>Start growing</button></div>
          </div>
        </div>
        <div className={`pointer-events-none absolute bottom-[17%] left-1/2 z-20 -translate-x-1/2 transition-all ${transitioning ? "scale-100 opacity-100" : "scale-0 opacity-0"}`} style={{ transitionDuration: reduced ? "220ms" : "700ms", transitionTimingFunction: SOFT }}><img src={cacaoBean} alt="Cacao seed" className="w-28" /></div>
      </div>
    </section>
  );
}

function PlantScreen({ planting, onPlant, reduced }: { planting: boolean; onPlant: () => void; reduced: boolean }) {
  return (
    <section className="relative min-h-dvh overflow-hidden bg-plum px-6 pb-8 pt-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(233,194,90,0.08),transparent_40%)]" />
      <div className="relative z-10 flex min-h-dvh flex-col">
        <div className="flex items-center justify-between"><AsuMark className="h-12 w-32" /><span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/45">02 / 04</span></div>
        <div className="relative flex flex-1 items-end justify-center pb-24 pt-10">
          <div className="absolute bottom-20 left-0 right-0 h-28 overflow-hidden bg-transparent"><img src={kraftStrip} alt="Torn soil edge" className="absolute inset-x-0 bottom-0 h-24 w-full object-cover" draggable={false} /></div>
          <img src={cacaoTree} alt="Cacao tree illustration" className="absolute bottom-[5.5rem] w-[72%] origin-bottom" style={{ transform: planting ? "scale(1)" : "scale(0.03)", opacity: planting ? 1 : 0, transition: `transform ${reduced ? 250 : 1200}ms ${SPRING}, opacity ${reduced ? 200 : 450}ms ease`, transitionDelay: reduced ? "0ms" : "650ms" }} />
          <img src={cacaoBean} alt="Cacao seed" className="relative z-10 w-[29%]" style={{ transform: planting ? "translateY(175px) rotate(10deg) scale(.45)" : "translateY(-35px) scale(1)", opacity: planting ? 0 : 1, transition: `transform ${reduced ? 250 : 850}ms ${SOFT}, opacity ${reduced ? 180 : 420}ms ease` }} />
        </div>
        <div className="mx-auto w-full text-center"><p className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/55">PLANT / ARIZONA STATE UNIVERSITY</p><h2 className="mt-2 font-display text-[3.15rem] font-light leading-none text-gold-soft">Put it in the ground.</h2><button type="button" onClick={onPlant} disabled={planting} className={`mt-6 ${BUTTON}`}>{planting ? "Taking root…" : "Plant my seed"}</button></div>
      </div>
    </section>
  );
}

function GrowScreen({ name, setName, onSubmit }: { name: string; setName: (v: string) => void; onSubmit: (e: FormEvent<HTMLFormElement>) => void }) {
  return (
    <section className="relative min-h-dvh overflow-hidden bg-plum px-6 pb-8 pt-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(233,194,90,0.08),transparent_38%)]" />
      <div className="relative z-10 flex min-h-dvh flex-col"><div className="flex items-center justify-between"><ChangingFuturesMark className="h-20 w-44" /><span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/45">03 / 04</span></div><div className="flex flex-1 items-center justify-center py-8"><img src={cacaoTree} alt="Cacao tree illustration" className="w-[58%] opacity-95" /></div><form onSubmit={onSubmit} className="mx-auto w-full"><p className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/55">GROW / CHANGING FUTURES</p><h2 className="mt-2 font-display text-[3.15rem] font-light leading-none text-gold-soft">Give your tree a name.</h2><input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Type your name" className="mt-7 h-16 w-full rounded-2xl border border-gold/30 bg-plum-deep/70 px-5 font-display text-2xl italic text-gold-soft outline-none placeholder:text-gold/30 focus:border-gold" /><button type="submit" className={`mt-4 w-full ${BUTTON}`}>Root my tree</button></form></div>
    </section>
  );
}

function ThankYouScreen({ name, onAgain }: { name: string; onAgain: () => void }) {
  return (
    <section className="relative min-h-dvh overflow-hidden bg-plum px-6 py-8"><div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(233,194,90,0.1),transparent_36%)]" /><div className="relative flex min-h-dvh flex-col items-center justify-between text-center"><div className="flex w-full items-center justify-between"><span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/45">04 / 04</span><span className="font-display text-lg italic text-gold/70">COCOA / ROOTED</span></div><div className="flex flex-col items-center"><img src={cacaoBranch} alt="Cacao illustration" className="mb-8 w-[50%]" /><p className="font-sans text-[10px] uppercase tracking-[0.34em] text-gold/55">THANK YOU</p><h2 className="mt-4 max-w-full break-words font-display text-6xl font-light text-gold-soft">{name || "Friend"}</h2><p className="mt-4 max-w-sm font-display text-xl italic leading-relaxed text-foreground/75">Your seed is rooted. Look to the grove to see it join the others.</p></div><button type="button" onClick={onAgain} className="mb-2 font-display text-lg italic text-gold/70 transition hover:text-gold">Plant another tree</button></div></section>
  );
}

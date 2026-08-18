import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import cocoaPodMockup from "@/assets/cocoa-pod.png";
import cocoaSeed from "@/assets/cacao-seed.png";
import cocoaTree from "@/assets/cacao-tree.png";
import { AsuMark, CadburyMark, ChangingFuturesMark } from "@/components/rooted/logos";
import { KraftSoil, TornStrip, tearClipPath } from "@/components/rooted/torn-edge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "COCOA / Rooted — A Gifting Reveal" },
      { name: "description", content: "Tear the packaging, sow a cocoa seed with Cadbury, ASU and Changing Futures, and watch a living grove grow." },
      { property: "og:title", content: "COCOA / Rooted — A Gifting Reveal" },
      { property: "og:description", content: "An unwrapping ritual that plants a cocoa seed and grows a living grove." },
    ],
  }),
  component: RootedExperience,
});

const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const SOFT = "cubic-bezier(0.22, 1, 0.36, 1)";
const BODONI = '"Bodoni 72", "Bodoni MT", Didot, Georgia, serif';
const HAAS = '"Neue Haas Grotesk Display Pro", "Neue Haas Grotesk Text Pro", "Helvetica Neue", Arial, sans-serif';
const AVENIR = 'Avenir, "Avenir Next", "Helvetica Neue", Arial, sans-serif';
const GARAMOND = '"EB Garamond", Georgia, serif';

type Step = 1 | 2 | 3 | 4 | 5;
type SeedPhase = "hidden" | "forming" | "traveling" | "center" | "planting" | "planted";
type SoilPhase = "hidden" | "rising" | "receding";

function RootedExperience() {
  const [step, setStep] = useState<Step>(1);
  const [dimmed, setDimmed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tearDone, setTearDone] = useState(false);
  const [seedPhase, setSeedPhase] = useState<SeedPhase>("hidden");
  const [soilPhase, setSoilPhase] = useState<SoilPhase>("hidden");
  const [planting, setPlanting] = useState(false);
  const [treeGrowing, setTreeGrowing] = useState(false);
  const [name, setName] = useState("");
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setDimmed(true), 700);
    return () => clearTimeout(t);
  }, []);

  const completeTear = useCallback(() => {
    draggingRef.current = false;
    setProgress(1);
    setTearDone(true);
    setTimeout(() => setStep(2), 620);
  }, []);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setProgress(p);
    if (p >= 0.9) completeTear();
  }, [completeTear]);

  useEffect(() => {
    const move = (e: PointerEvent) => draggingRef.current && updateFromClientX(e.clientX);
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

  const beginGrowing = () => {
    if (step !== 2 || seedPhase !== "hidden") return;
    setSeedPhase("forming");
    setTimeout(() => setSeedPhase("traveling"), 90);
    setTimeout(() => setStep(3), 420);
    setTimeout(() => setSeedPhase("center"), 900);
  };

  const plantSeed = () => {
    if (step !== 3 || planting) return;
    setPlanting(true);
    setSeedPhase("planting");
    setSoilPhase("rising");
    setTimeout(() => setSeedPhase("planted"), 700);
    setTimeout(() => setStep(4), 720);
    setTimeout(() => setSoilPhase("receding"), 900);
    setTimeout(() => setSoilPhase("hidden"), 1550);
  };

  const rootTree = (e: React.FormEvent) => {
    e.preventDefault();
    setTreeGrowing(true);
    setTimeout(() => setStep(5), 1250);
  };

  if (step === 5) return <ThankYouScreen name={name} />;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[oklch(0.16_0.03_305.5)] p-4">
      <div className="relative overflow-hidden rounded-[2rem] shadow-2xl" style={{ width: 390, height: 844 }}>
        <div className="absolute inset-0">
          {step === 1 ? (
            <div className="absolute inset-0 z-40" style={{
              clipPath: tearClipPath(progress),
              opacity: tearDone ? 0 : 1,
              transition: draggingRef.current ? "none" : `clip-path 650ms ${SPRING}, opacity 650ms ${SOFT}`,
            }}>
              <WelcomeScreen dimmed={dimmed} progress={progress} trackRef={trackRef} onHandleDown={(e) => {
                draggingRef.current = true;
                (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
              }} />
            </div>
          ) : null}
          {step === 2 ? <SowScreen seeding={seedPhase !== "hidden"} onBegin={beginGrowing} /> : null}
          {step === 3 ? <PlantScreen growing={planting} onPlant={plantSeed} /> : null}
          {step === 4 ? <GrowScreen name={name} setName={setName} rooted={treeGrowing} onSubmit={rootTree} /> : null}
        </div>
        {(step === 2 || step === 3) && seedPhase !== "hidden" && seedPhase !== "planted" ? <SeedOverlay phase={seedPhase} /> : null}
        {(step === 3 || step === 4) && soilPhase !== "hidden" ? <SoilWipe phase={soilPhase} /> : null}
      </div>
    </main>
  );
}

function WelcomeScreen({ dimmed, progress, trackRef, onHandleDown }: { dimmed: boolean; progress: number; trackRef: React.RefObject<HTMLDivElement | null>; onHandleDown: (e: React.PointerEvent) => void }) {
  return (
    <section className="relative h-full w-full overflow-hidden bg-kraft">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,.3),transparent_65%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.18),transparent_35%,rgba(64,42,25,.2))]" />
      <div className="absolute inset-0 bg-plum-deep/45 transition-opacity duration-700" style={{ opacity: dimmed ? 1 : 0, transitionTimingFunction: SOFT }} />
      <div className="relative flex h-full flex-col items-center justify-start px-6 pt-14 text-center">
        <h1 className="text-6xl font-bold leading-none tracking-tight" style={{ fontFamily: BODONI, backgroundImage: "linear-gradient(180deg,#f4dc9a,#e9c25a 55%,#b98f2c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>COCOA</h1>
        <p className="mt-2 text-xl italic text-plum-deep/75" style={{ fontFamily: GARAMOND }}>Theobroma Cacao</p>
        <img src={cocoaPodMockup} alt="Cocoa pod packaging artwork" className="mt-2 w-[27rem] max-w-none object-contain drop-shadow-[0_18px_35px_rgba(61,38,20,.25)]" />
      </div>

      <div className="absolute inset-x-0 bottom-0 px-7 pb-9 transition-all duration-700" style={{ opacity: dimmed ? 1 : 0, transform: dimmed ? "translateY(0)" : "translateY(18px)", transitionTimingFunction: SPRING }}>
        <p className="mb-4 text-center text-[14px] italic leading-relaxed text-gold-soft/95" style={{ fontFamily: GARAMOND }}>Slide the arrow across the screen to rip the bottom of the packaging.</p>
        <div ref={trackRef} className="relative h-16 rounded-full border border-gold/45 bg-plum-deep/60 backdrop-blur-sm">
          <div className="absolute inset-y-1 left-1 rounded-full bg-gold/15" style={{ width: `calc(${Math.max(progress, 0.001) * 100}% - 0.5rem)` }} />
          <button type="button" aria-label="Drag to tear the packaging" onPointerDown={onHandleDown} className="absolute top-1/2 grid size-14 -translate-y-1/2 cursor-grab touch-none place-items-center rounded-full bg-gold text-plum-deep glow-gold active:cursor-grabbing" style={{ left: `calc(0.25rem + ${progress} * (100% - 4rem))`, transition: `left 400ms ${SPRING}` }}>
            <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden><path d="M5 12h13m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}

function SowScreen({ seeding, onBegin }: { seeding: boolean; onBegin: () => void }) {
  return (
    <section className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-plum px-8 pb-28 pt-16">
      <div className="animate-soft-in"><CadburyMark /></div>
      <div className="animate-soft-in" style={{ animationDelay: "120ms" }}>
        <h2 className="text-6xl font-bold leading-none text-gold-soft" style={{ fontFamily: BODONI }}>Sow</h2>
        <span className="mt-2 block text-xl italic text-gold/70" style={{ fontFamily: BODONI }}>Cadbury</span>
        <p className="mt-5 max-w-[19rem] text-[15px] italic leading-relaxed text-foreground/80" style={{ fontFamily: GARAMOND }}>Grown from real cacao, sourced through Cadbury’s Cocoa Life — a real commitment to the farmers and forests cacao comes from, restoring the land a good harvest depends on.</p>
        <button type="button" onClick={onBegin} disabled={seeding} className="mt-8 w-full rounded-full bg-gold px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-plum-deep transition-transform duration-300 ease-spring hover:scale-[1.03] active:scale-95 disabled:opacity-70" style={{ fontFamily: HAAS }}>{seeding ? "Planting…" : "Begin growing"}</button>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[24%]" style={{ transform: seeding ? "translateY(28%) scaleX(.12)" : "translateY(0) scaleX(1)", opacity: seeding ? .7 : 1, transformOrigin: "50% 100%", transition: `transform 820ms ${SOFT}, opacity 620ms ${SOFT}` }}><TornStrip /></div>
    </section>
  );
}

function SeedOverlay({ phase }: { phase: SeedPhase }) {
  const positions: Record<SeedPhase, { bottom: string; transform: string; opacity: number }> = {
    hidden: { bottom: "8%", transform: "translate(-50%, 90px) scale(.12)", opacity: 0 },
    forming: { bottom: "10%", transform: "translate(-50%, 62px) scale(.18)", opacity: .35 },
    traveling: { bottom: "40%", transform: "translate(-50%, 0) scale(.78)", opacity: 1 },
    center: { bottom: "47%", transform: "translate(-50%, 0) scale(1)", opacity: 1 },
    planting: { bottom: "44%", transform: "translate(-50%, 22px) scale(.9)", opacity: 1 },
    planted: { bottom: "43%", transform: "translate(-50%, 30px) scale(.82)", opacity: 0 },
  };
  const s = positions[phase];
  return <div aria-hidden className="pointer-events-none absolute left-1/2 z-50" style={{ bottom: s.bottom, transform: s.transform, opacity: s.opacity, transition: `bottom 950ms ${SOFT}, transform 900ms ${SPRING}, opacity 520ms ${SOFT}` }}><img src={cocoaSeed} alt="" className="w-44 object-contain drop-shadow-[0_0_24px_rgba(233,194,90,.4)]" /></div>;
}

function PlantScreen({ growing, onPlant }: { growing: boolean; onPlant: () => void }) {
  return (
    <section className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-plum px-8 pb-14 pt-16">
      <div className="animate-soft-in"><AsuMark /></div>
      <div className="relative flex flex-1 items-center justify-center overflow-visible" />
      <div className="relative z-10">
        <h2 className="text-6xl font-bold leading-none text-gold-soft" style={{ fontFamily: BODONI }}>Plant</h2>
        <span className="mt-2 block text-xl italic text-gold/70" style={{ fontFamily: BODONI }}>Arizona State University</span>
        <p className="mt-5 max-w-[19rem] text-[15px] italic leading-relaxed text-foreground/80" style={{ fontFamily: GARAMOND }}>ASU was built on a different idea: that excellence and access shouldn’t compete. Planting below adds your name to something built for everyone in this room, not a few.</p>
        <button type="button" onClick={onPlant} disabled={growing} className="mt-7 w-full rounded-full bg-gold px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-plum-deep transition-transform duration-300 ease-spring hover:scale-[1.03] active:scale-95 disabled:opacity-70" style={{ fontFamily: HAAS }}>{growing ? "Planting…" : "Plant my seed"}</button>
      </div>
    </section>
  );
}

function SoilWipe({ phase }: { phase: SoilPhase }) {
  const transform = phase === "rising" ? "translateY(0)" : "translateY(78%)";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[60] h-[30%] overflow-hidden"
      style={{ transform, transition: `transform 1050ms ${SOFT}` }}
    >
      <KraftSoil className="h-full" />
    </div>
  );
}


function GrowScreen({ name, setName, rooted, onSubmit }: { name: string; setName: (v: string) => void; rooted: boolean; onSubmit: (e: React.FormEvent) => void }) {
  return (
    <section className="relative flex h-full w-full animate-soft-in flex-col justify-between overflow-hidden bg-plum px-8 pb-14 pt-16">
      <ChangingFuturesMark />
      <div className="relative flex flex-1 items-center justify-center overflow-visible">
        <div className="absolute bottom-[15%] left-0 right-0 h-8 overflow-hidden"><div className="h-full bg-[#5a3b24] [clip-path:polygon(0_35%,8%_10%,16%_32%,25%_14%,34%_36%,43%_12%,52%_30%,61%_10%,70%_32%,79%_14%,88%_34%,100%_12%,100%_100%,0_100%)]" /></div>
        <img src={cocoaTree} alt="Gold line drawing of a full cocoa tree" className="mx-auto w-72 origin-bottom object-contain" style={{ transform: rooted ? "scale(1.12)" : "scale(.64)", opacity: rooted ? 1 : 0, filter: rooted ? "drop-shadow(0 0 30px rgba(233,194,90,.4))" : "none", transition: `transform 1150ms ${SPRING},opacity 950ms ${SOFT},filter 950ms ${SOFT}` }} />
      </div>
      <form onSubmit={onSubmit} className="relative z-10">
        <h2 className="text-6xl font-bold leading-none text-gold-soft" style={{ fontFamily: BODONI }}>Grow</h2>
        <span className="mt-2 block text-xl italic text-gold/70" style={{ fontFamily: BODONI }}>Changing Futures</span>
        <p className="mt-5 max-w-[19rem] text-[15px] italic leading-relaxed text-foreground/80" style={{ fontFamily: GARAMOND }}>The world ahead doesn’t look like the one behind it. Name your tree, and root it as part of tonight.</p>
        <label className="mt-6 block text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/60" style={{ fontFamily: HAAS }}>Name
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name your tree" className="mt-2 w-full rounded-xl border border-gold/40 bg-plum-deep/60 px-4 py-3 text-base font-normal normal-case tracking-normal text-foreground outline-none transition-colors focus:border-gold" style={{ fontFamily: GARAMOND }} />
        </label>
        <button type="submit" className="mt-6 w-full rounded-full bg-gold px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-plum-deep transition-transform duration-300 ease-spring hover:scale-[1.03] active:scale-95" style={{ fontFamily: HAAS }}>Root my tree</button>
      </form>
    </section>
  );
}

function ThankYouScreen({ name }: { name: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[oklch(0.16_0.03_305.5)] p-4">
      <div className="relative overflow-hidden rounded-[2rem] bg-plum shadow-2xl" style={{ width: 390, height: 844 }}>
        <img src={cocoaTree} alt="" className="absolute bottom-[-120px] right-[-140px] w-[520px] object-contain opacity-15" />
        <div className="relative flex h-full animate-soft-in flex-col items-center justify-center px-10 text-center">
          <h2 className="text-7xl font-bold leading-[.9] text-gold-soft" style={{ fontFamily: BODONI }}>Thank<span className="block">you</span></h2>
          {name ? <p className="mt-8 text-3xl italic text-gold/80" style={{ fontFamily: BODONI }}>{name}</p> : null}
          <p className="mt-8 max-w-[280px] text-2xl italic leading-relaxed text-gold-soft" style={{ fontFamily: BODONI }}>Your cocoa tree is now rooted.</p>
          <p className="mt-8 max-w-[320px] text-[15px] italic leading-7 text-foreground/80" style={{ fontFamily: GARAMOND }}>Look toward the front of the room to see everyone’s trees growing together in the grove — something to grow, long after the <span className="whitespace-nowrap">gift is opened.</span></p>
        </div>
      </div>
    </main>
  );
}

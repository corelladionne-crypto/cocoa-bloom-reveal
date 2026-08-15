import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import cacaoPod from "@/assets/cacao-pod.png";
import cacaoSeed from "@/assets/cacao-seed.png";
import cacaoTree from "@/assets/cacao-tree.png";
import { AsuMark, CadburyMark, ChangingFuturesMark } from "@/components/rooted/logos";
import { TornStrip, tearClipPath } from "@/components/rooted/torn-edge";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "COCOA / Rooted — A Gifting Reveal" },
    { name: "description", content: "Tear the packaging, sow a cacao seed with Cadbury, ASU and Changing Futures, and watch a living grove grow." },
    { property: "og:title", content: "COCOA / Rooted — A Gifting Reveal" },
    { property: "og:description", content: "A four-step unwrapping ritual that plants a real cacao tree." },
  ] }),
  component: RootedExperience,
});

const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const SOFT = "cubic-bezier(0.22, 1, 0.36, 1)";
const BODONI = '"Bodoni 72", "Bodoni MT", Didot, Georgia, serif';
const HAAS = '"Neue Haas Grotesk Display Pro", "Neue Haas Grotesk Text Pro", "Helvetica Neue", Arial, sans-serif';
const AVENIR = 'Avenir, "Avenir Next", "Helvetica Neue", Arial, sans-serif';
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

  useEffect(() => { const t = setTimeout(() => setDimmed(true), 1000); return () => clearTimeout(t); }, []);
  const completeTear = useCallback(() => { draggingRef.current = false; setProgress(1); setTearDone(true); setTimeout(() => setStep(2), 700); }, []);
  const updateFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setProgress(p); if (p >= 0.9) completeTear();
  }, [completeTear]);
  useEffect(() => {
    const move = (e: PointerEvent) => { if (draggingRef.current) updateFromClientX(e.clientX); };
    const up = () => { if (!draggingRef.current) return; draggingRef.current = false; setProgress((p) => p >= 0.9 ? 1 : 0); };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [updateFromClientX]);
  const startGrowth = () => { setGrowing(true); setTimeout(() => setStep(4), 1250); };
  const submitName = (e: React.FormEvent) => { e.preventDefault(); setZooming(true); setTimeout(() => setStep(5), 1000); };
  useEffect(() => { if (step === 5 && !countedRef.current) { countedRef.current = true; setTrees((t) => t + 1); } }, [step]);
  if (step === 5) return <ThankYouScreen name={name} />;

  return <main className="flex min-h-screen items-center justify-center bg-[oklch(0.16_0.03_305.5)] p-4">
    <style>{`@keyframes rootedSlideIn { from { transform: translate3d(100%, 0, 0); opacity: .72; } to { transform: translate3d(0, 0, 0); opacity: 1; } }`}</style>
    <div className="relative overflow-hidden rounded-[2rem] shadow-2xl" style={{ width: 390, height: 844 }}>
      <div className="absolute inset-0" style={{ transform: zooming ? "scale(0.25)" : "scale(1)", opacity: zooming ? 0 : 1, transition: `transform 1000ms ${SOFT}, opacity 850ms ${SOFT}` }}>
        <div key={step} className="absolute inset-0" style={{ animation: step > 1 ? `rootedSlideIn 760ms ${SOFT} both` : undefined }}>
          {step === 1 || step === 2 ? <SowScreen onNext={() => setStep(3)} /> : null}
          {step === 3 ? <PlantScreen growing={growing} onPlant={startGrowth} /> : null}
          {step === 4 ? <GrowScreen name={name} setName={setName} onSubmit={submitName} /> : null}
        </div>
      </div>
      {step === 1 ? <div className="absolute inset-0" style={{ clipPath: tearClipPath(progress), opacity: tearDone ? 0 : 1, transition: draggingRef.current ? "none" : `clip-path 600ms ${SPRING}, opacity 600ms ${SOFT}` }}>
        <WelcomeScreen dimmed={dimmed} progress={progress} trackRef={trackRef} onHandleDown={(e) => { draggingRef.current = true; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); }} />
      </div> : null}
    </div>
  </main>;
}

function WelcomeScreen({ dimmed, progress, trackRef, onHandleDown }: { dimmed: boolean; progress: number; trackRef: React.RefObject<HTMLDivElement | null>; onHandleDown: (e: React.PointerEvent) => void }) {
  return <section className="relative h-full w-full overflow-hidden bg-kraft">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.28),transparent_65%)]" />
    <div className="absolute inset-0 bg-plum-deep/55 transition-opacity duration-700" style={{ opacity: dimmed ? 1 : 0, transitionTimingFunction: SOFT }} />
    <div className="relative flex h-full flex-col items-center justify-center px-10 text-center">
      <img src={cacaoPod} alt="Gold line drawing of a cacao pod" width={1024} height={1024} className="w-64 drop-shadow-[0_0_30px_rgba(233,194,90,0.35)]" />
      <h1 className="mt-6 text-5xl font-bold tracking-wide text-gold-soft" style={{ fontFamily: BODONI }}>COCOA</h1>
      <p className="mt-2 text-lg italic text-gold/80" style={{ fontFamily: BODONI }}>Theobroma Cacao</p>
    </div>
    <div className="absolute inset-x-0 bottom-0 px-7 pb-10 transition-all duration-700" style={{ opacity: dimmed ? 1 : 0, transform: dimmed ? "translateY(0)" : "translateY(24px)", transitionTimingFunction: SPRING }}>
      <p className="mb-5 text-center text-[13px] leading-relaxed text-gold-soft/90" style={{ fontFamily: AVENIR }}>Slide the arrow across the screen to rip the bottom of the packaging.</p>
      <div ref={trackRef} className="relative h-16 rounded-full border border-gold/40 bg-plum-deep/60 backdrop-blur-sm">
        <div className="absolute inset-y-1 left-1 rounded-full bg-gold/15" style={{ width: `calc(${Math.max(progress, 0.001) * 100}% - 0.5rem)` }} />
        <button type="button" aria-label="Drag to tear the packaging" onPointerDown={onHandleDown} className="absolute top-1/2 grid size-14 -translate-y-1/2 cursor-grab touch-none place-items-center rounded-full bg-gold text-plum-deep glow-gold active:cursor-grabbing" style={{ left: `calc(0.25rem + ${progress} * (100% - 4rem))`, transition: `left 400ms ${SPRING}` }}>
          <svg viewBox="0 0 24 24" className="size-6" fill="none" aria-hidden><path d="M5 12h13m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  </section>;
}

function SowScreen({ onNext }: { onNext: () => void }) {
  const [seeding, setSeeding] = useState(false);
  const begin = () => { setSeeding(true); setTimeout(onNext, 1150); };
  return <section className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-plum px-8 pb-28 pt-16">
    <div className="animate-soft-in"><CadburyMark /></div>
    <div className="animate-soft-in" style={{ animationDelay: "120ms" }}>
      <h2 className="text-6xl font-bold leading-none text-gold-soft" style={{ fontFamily: BODONI }}>Sow</h2>
      <span className="mt-2 block text-xl italic text-gold/70" style={{ fontFamily: BODONI }}>Cadbury</span>
      <p className="mt-5 max-w-[19rem] text-sm leading-relaxed text-foreground/75" style={{ fontFamily: HAAS }}>Every bean inside this bar comes through Cocoa Life — a programme working alongside farming communities in Ghana and Côte d'Ivoire to grow cacao that restores soil, shade and income rather than stripping them away.</p>
      <button type="button" onClick={begin} disabled={seeding} className="mt-8 w-full rounded-full bg-gold px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-plum-deep transition-transform duration-300 ease-spring hover:scale-[1.03] active:scale-95 disabled:opacity-70" style={{ fontFamily: HAAS }}>{seeding ? "Growing…" : "Begin growing"}</button>
    </div>
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[24%]" style={{ transform: seeding ? "translateY(30%) scaleX(0.08)" : "translateY(0) scaleX(1)", opacity: seeding ? 0 : 1, transformOrigin: "50% 100%", transition: `transform 900ms ${SOFT}, opacity 900ms ${SOFT}` }}>
      <div style={{ filter: "sepia(1) saturate(3) hue-rotate(350deg) brightness(1.2)", opacity: 0.9 }}><TornStrip /></div>
    </div>
    <div className="pointer-events-none absolute bottom-16 left-1/2" style={{ transform: seeding ? "translate(-50%, -12px) scale(1)" : "translate(-50%, 75px) scale(0.12)", opacity: seeding ? 1 : 0, transition: `transform 1000ms ${SPRING}, opacity 700ms ${SOFT}` }}><img src={cacaoSeed} alt="" aria-hidden className="w-40 drop-shadow-[0_0_18px_rgba(233,194,90,0.4)]" /></div>
  </section>;
}

function PlantScreen({ growing, onPlant }: { growing: boolean; onPlant: () => void }) {
  return <section className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-plum px-8 pb-14 pt-16">
    <div className="animate-soft-in"><AsuMark /></div>
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-visible">
      <div className="relative flex items-center justify-center overflow-visible" style={{ transform: growing ? "translateY(180px) scale(0.42)" : "translateY(0) scale(1)", opacity: growing ? 0 : 1, transition: `transform 1100ms ${SOFT}, opacity 900ms ${SOFT}` }}><img src={cacaoSeed} alt="Gold line drawing of a cacao seed" width={1024} height={1024} loading="lazy" className="w-48 object-contain" style={{ filter: "drop-shadow(0 0 18px rgba(233,194,90,0.35))" }} /></div>
      <div className="absolute bottom-4 h-[2px] w-2/3 rounded-full bg-gold/50" style={{ transform: growing ? "scaleX(1)" : "scaleX(0.6)", opacity: growing ? 1 : 0.4, transition: `transform 900ms ${SPRING}, opacity 900ms ${SOFT}` }} />
    </div>
    <div>
      <h2 className="text-6xl font-bold leading-none text-gold-soft" style={{ fontFamily: BODONI }}>Plant</h2>
      <span className="mt-2 block text-xl italic text-gold/70" style={{ fontFamily: BODONI }}>Arizona State University</span>
      <p className="mt-5 max-w-[19rem] text-sm leading-relaxed text-foreground/75" style={{ fontFamily: HAAS }}>ASU's Tribal Nations Policy Institute and Center for Tribal Digital Sovereignty plant knowledge alongside the seed — pairing Indigenous stewardship with digital tools so communities own the data behind the land they care for.</p>
      <button type="button" onClick={onPlant} disabled={growing} className="mt-7 w-full rounded-full bg-gold px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-plum-deep transition-transform duration-300 ease-spring hover:scale-[1.03] active:scale-95 disabled:opacity-70" style={{ fontFamily: HAAS }}>{growing ? "Planting…" : "Plant my seed"}</button>
    </div>
  </section>;
}

function GrowScreen({ name, setName, onSubmit }: { name: string; setName: (v: string) => void; onSubmit: (e: React.FormEvent) => void }) {
  const [rooted, setRooted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setRooted(true); setTimeout(() => onSubmit(e), 900); };
  return <section className="relative flex h-full w-full animate-soft-in flex-col justify-between overflow-hidden bg-plum px-8 pb-14 pt-16">
    <ChangingFuturesMark />
    <div className="flex flex-1 items-center justify-center overflow-visible"><img src={cacaoTree} alt="Gold line drawing of a full cacao tree" width={1024} height={1024} loading="lazy" className="mx-auto w-72 object-contain origin-bottom" style={{ transform: rooted ? "scale(1.18)" : "scale(0.86)", opacity: rooted ? 1 : 0.85, filter: rooted ? "drop-shadow(0 0 30px rgba(233,194,90,0.4))" : "none", transition: `transform 900ms ${SPRING}, opacity 900ms ${SOFT}, filter 900ms ${SOFT}` }} /></div>
    <form onSubmit={handleSubmit}>
      <h2 className="text-6xl font-bold leading-none text-gold-soft" style={{ fontFamily: BODONI }}>Grow</h2>
      <span className="mt-2 block text-xl italic text-gold/70" style={{ fontFamily: BODONI }}>Changing Futures</span>
      <p className="mt-5 max-w-[19rem] text-sm leading-relaxed text-foreground/75" style={{ fontFamily: AVENIR }}>Your seed is becoming part of a living grove. Give your tree a name before it takes its place with everyone else's.</p>
      <label className="mt-6 block text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/60" style={{ fontFamily: HAAS }}>Name
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name your tree" className="mt-2 w-full rounded-xl border border-gold/40 bg-plum-deep/60 px-4 py-3 text-base font-normal normal-case tracking-normal text-foreground outline-none transition-colors focus:border-gold" style={{ fontFamily: AVENIR }} />
      </label>
      <button type="submit" className="mt-6 w-full rounded-full bg-gold px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-plum-deep transition-transform duration-300 ease-spring hover:scale-[1.03] active:scale-95" style={{ fontFamily: HAAS }}>Root my tree</button>
    </form>
  </section>;
}

function ThankYouScreen({ name }: { name: string }) {
  return <main className="flex min-h-screen items-center justify-center bg-[oklch(0.16_0.03_305.5)] p-4">
    <div className="relative overflow-hidden rounded-[2rem] bg-plum shadow-2xl" style={{ width: 390, height: 844 }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(233,194,90,0.12),transparent_70%)]" />
      <img src={cacaoTree} alt="" className="absolute bottom-[-120px] right-[-140px] w-[520px] opacity-15 object-contain" />
      <div className="relative flex h-full animate-soft-in flex-col items-center justify-center px-10 text-center">
        <h2 className="text-7xl font-bold leading-[0.9] text-gold-soft" style={{ fontFamily: BODONI }}>Thank<span className="block">you</span></h2>
        {name ? <p className="mt-8 text-3xl italic text-gold/80" style={{ fontFamily: BODONI }}>{name}</p> : null}
        <p className="mt-8 max-w-[280px] text-2xl italic leading-relaxed text-gold-soft" style={{ fontFamily: BODONI }}>Your cocoa tree is now rooted.</p>
        <p className="mt-8 max-w-[300px] text-sm leading-7 text-foreground/75" style={{ fontFamily: AVENIR }}>Look toward the front of the room to see everyone's trees growing together in the grove.</p>
      </div>
    </div>
  </main>;
}

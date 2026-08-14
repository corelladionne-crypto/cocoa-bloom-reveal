import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import cacaoBranch from "@/assets/cacao-branch.png.asset.json";
import cacaoBean from "@/assets/cacao-bean.png.asset.json";
import cacaoTree from "@/assets/cacao-tree-gold.png.asset.json";
import { AsuMark, CadburyMark, ChangingFuturesMark } from "@/components/rooted/logos";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "COCOA / Rooted — A Gifting Reveal" },
      { name: "description", content: "Tear the cocoa package, plant a cacao seed, and grow a living tree." },
    ],
  }),
  component: RootedExperience,
});

const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const SOFT = "cubic-bezier(0.22, 1, 0.36, 1)";
const KRAFT = "#C99E68";
const GOLD = "#E9C25A";

type Step = 1 | 2 | 3 | 4 | 5;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const stored = window.localStorage.getItem("rooted-reduced-motion");
    setReduced(stored !== null ? stored === "1" : window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  const toggle = useCallback(() => setReduced((v) => {
    const next = !v;
    window.localStorage.setItem("rooted-reduced-motion", next ? "1" : "0");
    return next;
  }), []);
  return { reduced, toggle };
}

function MotionToggle({ reduced, toggle }: { reduced: boolean; toggle: () => void }) {
  return (
    <button type="button" onClick={toggle} aria-pressed={reduced}
      className="absolute right-3 top-3 z-50 rounded-full border border-gold/40 bg-plum-deep/70 px-4 py-3 font-sans text-[10px] uppercase tracking-[0.15em] text-gold-soft backdrop-blur-sm">
      {reduced ? "Motion off" : "Motion on"}
    </button>
  );
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
  const { reduced, toggle } = useReducedMotion();
  const [step, setStep] = useState<Step>(1);
  const [tearProgress, setTearProgress] = useState(0);
  const [tearing, setTearing] = useState(false);
  const [growing, setGrowing] = useState(false);
  const [name, setName] = useState("");
  const [trees, setTrees] = useState(137);
  const startedRef = useRef(false);
  const countedRef = useRef(false);

  const ms = useCallback((n: number) => reduced ? Math.min(n, 140) : n, [reduced]);

  const begin = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    setTearing(true);
    const start = performance.now();
    const duration = ms(1800);
    const animate = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setTearProgress(p);
      if (p < 1) requestAnimationFrame(animate);
      else setTimeout(() => setStep(2), ms(650));
    };
    requestAnimationFrame(animate);
  };

  const plantSeed = () => {
    setGrowing(true);
    setTimeout(() => setStep(4), ms(2100));
  };

  const submitName = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => setStep(5), ms(700));
  };

  useEffect(() => {
    if (step === 5 && !countedRef.current) {
      countedRef.current = true;
      setTrees((v) => v + 1);
    }
  }, [step]);

  if (step === 5) return <GroveScreen trees={trees} name={name} reduced={reduced} toggle={toggle} />;

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[oklch(0.16_0.03_305.5)] p-4">
      <div className="relative h-[844px] w-[390px] overflow-hidden rounded-[2rem] shadow-2xl">
        <MotionToggle reduced={reduced} toggle={toggle} />

        {step === 1 && (
          <div className="absolute inset-0 overflow-hidden" onClick={!tearing ? begin : undefined}>
            <div className="absolute inset-0 bg-plum" />
            <div className="absolute inset-0" style={{ clipPath: halfClip("top", tearProgress), transform: `translateY(${-tearProgress * 90}px) rotate(${-tearProgress * 1.2}deg)`, transition: tearing ? "none" : `transform ${ms(600)}ms ${SPRING}` }}>
              <WelcomePackaging />
            </div>
            <div className="absolute inset-0" style={{ clipPath: halfClip("bottom", tearProgress), transform: `translateY(${tearProgress * 90}px) rotate(${tearProgress * 1.2}deg)`, transition: tearing ? "none" : `transform ${ms(600)}ms ${SPRING}` }}>
              <WelcomePackaging />
            </div>
            <TearLine progress={tearProgress} />
            {!tearing && <ClickToBegin />}
          </div>
        )}

        {step === 2 && <SowScreen onNext={() => setStep(3)} />}
        {step === 3 && <PlantScreen growing={growing} onPlant={plantSeed} reduced={reduced} />}
        {step === 4 && <GrowScreen name={name} setName={setName} onSubmit={submitName} />}
      </div>
    </main>
  );
}

function WelcomePackaging() {
  return (
    <section className="relative h-full w-full overflow-hidden" style={{ background: KRAFT }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.18),transparent_62%)]" />
      <div className="relative flex h-full flex-col items-center justify-center px-8 text-center">
        <img src={cacaoBranch.url} alt="Cocoa pod illustration" className="w-[290px] drop-shadow-[0_0_24px_rgba(233,194,90,0.32)]" draggable={false} />
        <p className="mt-7 font-display text-[11px] italic text-plum-deep/80">An academic experience presented by Arizona State University and Cadbury</p>
        <h1 className="mt-2 font-display text-6xl font-light tracking-wide text-[#E9C25A]">COCOA</h1>
        <p className="mt-1 font-display text-xl italic text-plum-deep">Theobroma Cacao</p>
        <p className="absolute bottom-16 font-display text-base italic text-[#E9C25A]">Grown, not just made</p>
      </div>
    </section>
  );
}

function ClickToBegin() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-20 flex justify-center">
      <p className="font-display text-xl italic text-[#E9C25A] drop-shadow-[0_1px_8px_rgba(0,0,0,0.18)]">Click to begin</p>
    </div>
  );
}

function TearLine({ progress }: { progress: number }) {
  const arrowX = 8 + progress * 84;
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[18%] h-10">
      <div className="absolute left-[8%] right-[8%] top-1/2 h-[2px] -translate-y-1/2 origin-left bg-[#E9C25A]" style={{ transform: `scaleX(${progress})`, boxShadow: "0 0 12px rgba(233,194,90,.55)" }} />
      <div className="absolute top-1/2 -translate-y-1/2" style={{ left: `${arrowX}%`, opacity: progress > 0 ? 1 : 0 }}>
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden>
          <path d="M3 15h20M17 8l7 7-7 7" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

const BUTTON = "mt-8 min-h-14 w-full rounded-full bg-gold px-6 py-4 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-plum-deep transition-transform duration-300 hover:scale-[1.03] active:scale-95";

function SowScreen({ onNext }: { onNext: () => void }) {
  return (
    <section className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-plum px-8 pb-14 pt-16">
      <CadburyMark />
      <div>
        <h2 className="font-display text-5xl font-light leading-tight text-gold-soft">Sow<span className="block text-xl italic text-gold/70">Cadbury</span></h2>
        <p className="mt-5 font-sans text-sm leading-relaxed text-foreground/75">Every bean inside this bar comes through Cocoa Life — a programme working alongside farming communities in Ghana and Côte d'Ivoire to grow cacao that restores soil, shade and income.</p>
        <button type="button" onClick={onNext} className={BUTTON}>Start growing</button>
      </div>
    </section>
  );
}

function PlantScreen({ growing, onPlant, reduced }: { growing: boolean; onPlant: () => void; reduced: boolean }) {
  const dur = reduced ? 150 : 1400;
  return (
    <section className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-plum px-8 pb-14 pt-16">
      <AsuMark />
      <div className="relative flex flex-1 flex-col items-center justify-end pb-24">
        <div className="absolute bottom-24 w-[3px] origin-bottom rounded-full bg-gradient-to-t from-gold via-gold-soft to-transparent" style={{ height: 300, transform: growing ? "scaleY(0)" : "scaleY(1)", opacity: growing ? 0 : 1, transition: `transform ${dur}ms ${SOFT}, opacity ${dur / 2}ms ${SOFT}` }} />
        <img src={cacaoTree.url} alt="" aria-hidden className="absolute bottom-24 w-64 origin-bottom" style={{ transform: growing ? "scale(1)" : "scale(0.05)", opacity: growing ? 1 : 0, transition: `transform ${dur}ms ${SPRING} ${reduced ? 0 : 500}ms, opacity ${dur}ms ${SOFT} ${reduced ? 0 : 500}ms` }} />
        <img src={cacaoBean.url} alt="Cacao seed" className="relative mb-20 w-40" style={{ transform: growing ? "translateY(90px) scale(.45)" : "none", opacity: growing ? 0 : 1, transition: `transform ${dur}ms ${SOFT}, opacity ${dur}ms ${SOFT}` }} />
      </div>
      <div>
        <h2 className="font-display text-5xl font-light leading-tight text-gold-soft">Plant<span className="block text-xl italic text-gold/70">Arizona State University</span></h2>
        <button type="button" onClick={onPlant} disabled={growing} className={`${BUTTON} disabled:opacity-70`}>{growing ? "Growing…" : "Plant my seed"}</button>
      </div>
    </section>
  );
}

function GrowScreen({ name, setName, onSubmit }: { name: string; setName: (v: string) => void; onSubmit: (e: React.FormEvent) => void }) {
  return (
    <section className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-plum px-8 pb-14 pt-16">
      <ChangingFuturesMark />
      <img src={cacaoTree.url} alt="Gold cacao tree" className="mx-auto w-72" />
      <form onSubmit={onSubmit}>
        <h2 className="font-display text-5xl font-light leading-tight text-gold-soft">Grow<span className="block text-xl italic text-gold/70">Changing Futures</span></h2>
        <label className="mt-6 block font-sans text-[11px] uppercase tracking-[0.3em] text-foreground/60">Name
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Name your tree" className="mt-2 min-h-14 w-full rounded-xl border border-gold/40 bg-plum-deep/60 px-4 py-3 font-sans text-base normal-case tracking-normal text-foreground outline-none focus:border-gold" />
        </label>
        <button type="submit" className={BUTTON}>Root my tree</button>
      </form>
    </section>
  );
}

function GroveScreen({ trees, name, reduced, toggle }: { trees: number; name: string; reduced: boolean; toggle: () => void }) {
  const plants = useMemo(() => Array.from({ length: 28 }, (_, i) => {
    const r = (s: number) => { const x = Math.sin(i * 91.3 + s * 47.7) * 43758.5453; return x - Math.floor(x); };
    return { left: 4 + r(2) * 88, top: 30 + r(3) * 52, size: r(1) < .35 ? 22 : r(1) < .7 ? 54 : 90, opacity: .55 + r(5) * .45 };
  }), []);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[oklch(0.16_0.03_305.5)] p-4">
      <div className="relative aspect-[16/9] w-full max-w-6xl overflow-hidden rounded-3xl bg-plum shadow-2xl">
        <MotionToggle reduced={reduced} toggle={toggle} />
        <div className="relative px-10 pt-8">
          <h1 className="font-display text-3xl font-semibold uppercase tracking-[0.08em] text-gold md:text-4xl">A Living Grove</h1>
          <p className="font-display text-sm italic text-foreground/85 md:text-lg">Presented to you by Arizona State University × Cadbury × Changing Futures</p>
        </div>
        <div className="absolute inset-0">
          {plants.slice(0, Math.max(4, Math.min(plants.length, trees % plants.length || 12))).map((p, i) => <img key={i} src={p.size > 30 ? cacaoTree.url : cacaoBean.url} alt="" aria-hidden className="absolute" style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, opacity: p.opacity }} />)}
        </div>
        <div className="absolute left-1/2 top-[46%] flex -translate-x-1/2 flex-col items-center text-center">
          <img src={cacaoTree.url} alt={name ? `${name}'s cacao tree` : "Cacao tree"} className="w-56 md:w-72" />
          {name && <p className="mt-3 font-display text-2xl italic text-gold-soft md:text-3xl">{name}</p>}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-10 pb-8">
          <div className="flex items-center gap-10 opacity-90"><ChangingFuturesMark className="h-12 w-24" /><CadburyMark className="h-8 w-32" /><AsuMark className="h-8 w-20" /></div>
          <div className="text-right"><p className="font-display text-lg italic text-foreground/90 md:text-2xl">Trees Planted: {trees}/400</p><div className="mt-2 h-1 w-64 overflow-hidden rounded-full bg-foreground/15"><div className="h-full rounded-full bg-gold transition-all duration-1000" style={{ width: `${(trees / 400) * 100}%` }} /></div></div>
        </div>
      </div>
    </main>
  );
}

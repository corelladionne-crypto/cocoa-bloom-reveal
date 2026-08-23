import { useEffect, useMemo, useState } from "react";

import cocoaSeed from "@/assets/cacao-seed.png";
import cocoaTree from "@/assets/cacao-tree.png";
import { AsuMark, CadburyMark, ChangingFuturesMark } from "@/components/rooted/logos";
import { KraftSoil } from "@/components/rooted/torn-edge";

const SOFT = "cubic-bezier(0.22, 1, 0.36, 1)";
const BODONI = '"Bodoni 72", "Bodoni MT", Didot, Georgia, serif';
const HAAS = '"Neue Haas Grotesk Display Pro", "Neue Haas Grotesk Text Pro", "Helvetica Neue", Arial, sans-serif';
const GARAMOND = '"EB Garamond", Georgia, serif';

type StoredTree = { id: string; planted_at: string };

type Props = { guestId: string };

function storageKey(id: string) {
  return `rooted:tree:${id}`;
}

function readTree(id: string): StoredTree | null {
  try {
    const raw = window.localStorage.getItem(storageKey(id));
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<StoredTree>;
    if (value.id === id && typeof value.planted_at === "string" && !Number.isNaN(Date.parse(value.planted_at))) {
      return { id, planted_at: value.planted_at };
    }
  } catch {
    // A blocked/corrupt localStorage entry is treated as a first visit.
  }
  return null;
}

function saveTree(id: string) {
  const tree: StoredTree = { id, planted_at: new Date().toISOString() };
  window.localStorage.setItem(storageKey(id), JSON.stringify(tree));
  return tree;
}

export function LocalTreeExperience({ guestId }: Props) {
  const id = useMemo(() => guestId, [guestId]);
  const [tree, setTree] = useState<StoredTree | null>(null);
  const [page, setPage] = useState(1);
  const [tapCount, setTapCount] = useState(0);
  const [opened, setOpened] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const saved = readTree(id);
    if (saved) {
      setTree(saved);
      setPage(5);
    }
  }, [id]);

  const tapGift = () => {
    if (opened) return;
    const next = Math.min(3, tapCount + 1);
    setTapCount(next);
    if (next === 3) {
      setOpened(true);
      window.setTimeout(() => setPage(4), 900);
    }
  };

  const plant = () => {
    if (tree) return;
    const saved = saveTree(id);
    setTree(saved);
    setPage(5);
  };

  if (page === 5 && tree) return <LocalLivingTree tree={tree} />;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[oklch(0.16_0.03_305.5)] p-4">
      <div className="relative h-[844px] w-[390px] overflow-hidden rounded-[2rem] shadow-2xl">
        {page === 1 ? <RelationshipPage onContinue={() => setPage(2)} /> : null}
        {page === 2 ? <StoryPage onContinue={() => setPage(3)} /> : null}
        {page === 3 ? <GiftPage tapCount={tapCount} opened={opened} onTap={tapGift} /> : null}
        {page === 4 ? <PlantPage name={name} setName={setName} onPlant={plant} /> : null}
      </div>
    </main>
  );
}

function RelationshipPage({ onContinue }: { onContinue: () => void }) {
  return (
    <section className="relative flex h-full w-full flex-col overflow-hidden bg-kraft px-7 pb-8 pt-10 text-plum-deep">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,.28),transparent_62%)]" />
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center justify-between"><AsuMark /><CadburyMark /></div>
        <div className="mt-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ fontFamily: HAAS }}>Rooted / Changing Futures</p>
          <h1 className="mt-3 text-6xl font-bold leading-[.9]" style={{ fontFamily: BODONI }}>A seed can<br />change a future.</h1>
          <p className="mt-5 text-[16px] italic leading-relaxed" style={{ fontFamily: GARAMOND }}>Cadbury’s Cocoa Life program works with cocoa-growing communities in West Africa to support farmers, strengthen livelihoods, and protect the landscapes cocoa depends on.</p>
          <p className="mt-3 text-[16px] italic leading-relaxed" style={{ fontFamily: GARAMOND }}>Arizona State University’s Changing Futures brings that same belief in possibility into education: opportunity can change the direction of a life.</p>
        </div>
        <div className="mt-auto"><p className="mb-3 text-center text-[13px] italic text-plum-deep/70" style={{ fontFamily: GARAMOND }}>Three stories. One growing future.</p><button type="button" onClick={onContinue} className="w-full rounded-full bg-gold px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-plum-deep" style={{ fontFamily: HAAS }}>Continue</button></div>
      </div>
    </section>
  );
}

function StoryPage({ onContinue }: { onContinue: () => void }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const timers = [window.setTimeout(() => setStage(1), 1200), window.setTimeout(() => setStage(2), 2500)];
    return () => timers.forEach(window.clearTimeout);
  }, []);
  const stories = [
    { title: "Sow", mark: <CadburyMark />, caption: "Cocoa Life supports the people and places where cocoa begins." },
    { title: "Plant", mark: <AsuMark />, caption: "ASU helps turn opportunity into a future people can build." },
    { title: "Grow", mark: <ChangingFuturesMark />, caption: "Changing Futures asks what becomes possible when we invest in people." },
  ];
  const current = stories[Math.min(stage, 2)];
  return (
    <section className="relative flex h-full w-full flex-col overflow-hidden bg-plum px-8 pb-10 pt-16">
      <div className="flex items-center justify-between"><span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-gold-soft/70" style={{ fontFamily: HAAS }}>Rooted</span><span className="text-[11px] uppercase tracking-[0.2em] text-gold-soft/60" style={{ fontFamily: HAAS }}>{Math.min(stage + 1, 3)} / 3</span></div>
      <div className="mt-8 flex flex-1 flex-col items-center justify-center text-center"><div className="animate-soft-in">{current.mark}</div><h2 className="mt-8 text-7xl font-bold leading-none text-gold-soft" style={{ fontFamily: BODONI }}>{current.title}</h2><div className="relative mt-8 h-40 w-56"><img src={cocoaSeed} alt="" className="absolute bottom-0 left-1/2 w-24 -translate-x-1/2 object-contain" style={{ opacity: stage === 0 ? 1 : 0, transform: stage === 0 ? "translateX(-50%) scale(1)" : "translateX(-50%) scale(.6)", transition: `opacity 700ms ${SOFT}, transform 900ms ${SOFT}` }} /><img src={cocoaTree} alt="" className="absolute bottom-0 left-1/2 w-52 -translate-x-1/2 object-contain" style={{ opacity: stage === 2 ? 1 : 0, transform: stage === 2 ? "translateX(-50%) scale(1)" : "translateX(-50%) scale(.55)", transition: `opacity 900ms ${SOFT}, transform 1200ms ${SOFT}` }} /></div><p className="mt-4 max-w-[19rem] text-[15px] italic leading-relaxed text-foreground/80" style={{ fontFamily: GARAMOND }}>{current.caption}</p></div>
      <button type="button" onClick={onContinue} className="w-full rounded-full bg-gold px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-plum-deep" style={{ fontFamily: HAAS }}>Continue</button>
    </section>
  );
}

function GiftPage({ tapCount, opened, onTap }: { tapCount: number; opened: boolean; onTap: () => void }) {
  return (
    <section className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden bg-kraft px-8 pb-12 pt-16 text-plum-deep">
      <div className="text-center"><p className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ fontFamily: HAAS }}>A gift to grow</p><h2 className="mt-3 text-6xl font-bold leading-none" style={{ fontFamily: BODONI }}>Tap, tap, tap.</h2><p className="mt-3 text-[16px] italic" style={{ fontFamily: GARAMOND }}>On the third tap, the gift opens.</p></div>
      <button type="button" aria-label="Tap the gift box" onClick={onTap} className="relative grid h-64 w-64 place-items-center outline-none" style={{ transform: opened ? "translateY(8px) scale(1.03)" : "scale(1)", transition: `transform 700ms ${SOFT}` }}>
        <div className="absolute bottom-5 h-40 w-52 rounded-xl border-2 border-gold bg-plum shadow-xl" style={{ transform: opened ? "perspective(500px) rotateX(-15deg)" : "none", transition: `transform 800ms ${SOFT}` }} />
        <div className="absolute bottom-40 h-12 w-56 rounded-lg border-2 border-gold bg-plum-deep" style={{ transform: opened ? "translateY(-34px) rotate(-3deg)" : "none", transition: `transform 800ms ${SOFT}` }} />
        <img src={cocoaSeed} alt="Revealed cocoa seed" className="absolute bottom-36 z-10 w-24 object-contain" style={{ opacity: opened ? 1 : 0, transform: opened ? "translateY(-15px) scale(1)" : "translateY(30px) scale(.4)", transition: `opacity 600ms ${SOFT}, transform 800ms ${SOFT}` }} />
      </button>
      <div className="text-center"><div className="flex justify-center gap-3">{[1,2,3].map((n) => <span key={n} className="size-3 rounded-full border border-plum-deep/40" style={{ backgroundColor: tapCount >= n ? "var(--gold)" : "transparent" }} />)}</div><p className="mt-4 text-[13px] italic" style={{ fontFamily: GARAMOND }}>{opened ? "A seed, waiting to be planted." : `${3 - tapCount} tap${3 - tapCount === 1 ? "" : "s"} to open`}</p></div>
    </section>
  );
}

function PlantPage({ name, setName, onPlant }: { name: string; setName: (v: string) => void; onPlant: () => void }) {
  return (
    <section className="relative flex h-full w-full flex-col overflow-hidden bg-plum px-8 pb-10 pt-16">
      <div className="flex items-center justify-between"><span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-gold-soft/70" style={{ fontFamily: HAAS }}>Rooted</span><span className="text-[11px] uppercase tracking-[0.2em] text-gold-soft/60" style={{ fontFamily: HAAS }}>Planting / 01</span></div>
      <div className="relative flex flex-1 items-center justify-center"><div className="absolute bottom-20 left-1/2 h-28 w-56 -translate-x-1/2"><KraftSoil className="h-full" /></div><img src={cocoaSeed} alt="Cocoa seed" className="relative z-10 w-28 object-contain drop-shadow-[0_0_24px_rgba(233,194,90,.35)]" /></div>
      <div><h2 className="text-6xl font-bold leading-none text-gold-soft" style={{ fontFamily: BODONI }}>Plant</h2><p className="mt-3 text-[16px] italic leading-relaxed text-foreground/80" style={{ fontFamily: GARAMOND }}>Your seed has just been planted, in real soil, through Cadbury’s Cocoa Life program.</p><label className="mt-4 block text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/60" style={{ fontFamily: HAAS }}>Name (optional)<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="mt-2 w-full rounded-xl border border-gold/40 bg-plum-deep/60 px-4 py-3 text-base normal-case tracking-normal text-foreground outline-none" style={{ fontFamily: GARAMOND }} /></label><button type="button" onClick={onPlant} className="mt-4 w-full rounded-full bg-gold px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-plum-deep" style={{ fontFamily: HAAS }}>Plant my seed</button></div>
    </section>
  );
}

function getStage(plantedAt: string, now: number) {
  const hoursElapsed = Math.max(0, now - new Date(plantedAt).getTime()) / (1000 * 60 * 60);
  if (hoursElapsed < 6) return { key: "just planted", copy: "Your tree has just been planted, in real soil, through Cadbury’s Cocoa Life program.", progress: 0 };
  if (hoursElapsed < 18) return { key: "taking root", copy: "Your tree is taking root.", progress: 1 };
  if (hoursElapsed < 36) return { key: "first leaves", copy: "Your tree has its first leaves.", progress: 2 };
  return { key: "fully grown", copy: "Your tree has fully grown.", progress: 3 };
}

function LocalLivingTree({ tree }: { tree: StoredTree }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
  const stage = getStage(tree.planted_at, now);
  const plantedMs = new Date(tree.planted_at).getTime();
  const elapsedHours = Math.max(0, now - plantedMs) / 3600000;
  const nextThreshold = stage.progress === 0 ? 6 : stage.progress === 1 ? 18 : stage.progress === 2 ? 36 : null;
  const remaining = nextThreshold === null ? 0 : Math.max(0, (nextThreshold - elapsedHours) * 3600000);
  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return (
    <main className="flex min-h-screen items-center justify-center bg-[oklch(0.16_0.03_305.5)] p-4"><section className="relative h-[844px] w-[390px] overflow-hidden rounded-[2rem] bg-plum px-8 pb-10 pt-16 shadow-2xl"><ChangingFuturesMark /><div className="mt-5"><p className="text-[11px] uppercase tracking-[0.3em] text-gold-soft/60" style={{ fontFamily: HAAS }}>Your living tree</p><h1 className="mt-2 text-5xl font-bold leading-none text-gold-soft" style={{ fontFamily: BODONI }}>Your tree</h1></div><div className="relative mt-4 flex h-[400px] items-end justify-center"><img src={cocoaTree} alt="Your growing cocoa tree" className="w-72 object-contain transition-all duration-1000" style={{ transform: `scale(${[0.28,0.5,0.75,1][stage.progress]})`, transformOrigin: "bottom center", opacity: [0.55,0.7,0.88,1][stage.progress] }} /></div><div className="rounded-2xl border border-gold/20 bg-plum-deep/40 p-5"><p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold-soft/60" style={{ fontFamily: HAAS }}>{stage.key}</p><p className="mt-2 text-[20px] italic leading-relaxed text-foreground" style={{ fontFamily: GARAMOND }}>{stage.copy}</p>{nextThreshold !== null ? <p className="mt-3 text-[12px] uppercase tracking-[0.16em] text-gold-soft/60" style={{ fontFamily: HAAS }}>Next stage in {hours}h {minutes}m {seconds}s</p> : <p className="mt-3 text-[12px] uppercase tracking-[0.16em] text-gold-soft/60" style={{ fontFamily: HAAS }}>Fully grown — this tree stays here.</p>}</div></section></main>
  );
}

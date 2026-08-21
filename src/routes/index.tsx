import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import cocoaPodMockup from "@/assets/cocoa-pod.png";
import cocoaSeed from "@/assets/cacao-seed.png";
import cocoaTree from "@/assets/cacao-tree.png";
import { AsuMark, CadburyMark, ChangingFuturesMark } from "@/components/rooted/logos";
import { KraftSoil } from "@/components/rooted/torn-edge";
import { plantTree, type TreeRecord } from "@/lib/tree.server";

export const Route = createFileRoute("/")({ component: RootedExperience });

const SOFT = "cubic-bezier(0.22, 1, 0.36, 1)";
const BODONI = '"Bodoni 72", "Bodoni MT", Didot, Georgia, serif';
const HAAS = '"Neue Haas Grotesk Display Pro", "Neue Haas Grotesk Text Pro", "Helvetica Neue", Arial, sans-serif';
const GARAMOND = '"EB Garamond", Georgia, serif';
export const GROWTH_DURATION_HOURS = 24;

export type GuestFlowProps = { guestId?: string; existingTree?: TreeRecord | null };

export function RootedExperience({ guestId: providedGuestId, existingTree = null }: GuestFlowProps) {
  const guestId = useMemo(() => providedGuestId || makeGuestId(), [providedGuestId]);
  const [page, setPage] = useState(existingTree?.planted_at ? 5 : 1);
  const [tapCount, setTapCount] = useState(0);
  const [opened, setOpened] = useState(false);
  const [name, setName] = useState(existingTree?.name ?? "");
  const [tree, setTree] = useState<TreeRecord | null>(existingTree);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existingTree?.planted_at) setPage(5);
  }, [existingTree?.planted_at]);

  const tapGift = () => {
    if (opened) return;
    const next = Math.min(3, tapCount + 1);
    setTapCount(next);
    if (next === 3) {
      setOpened(true);
      window.setTimeout(() => setPage(4), 900);
    }
  };

  const plant = async () => {
    if (saving || tree?.planted_at) return;
    setSaving(true);
    try {
      const saved = await plantTree({ data: { id: guestId, name: name.trim() || null } });
      setTree(saved);
      setPage(5);
    } finally {
      setSaving(false);
    }
  };

  if (page === 5 && tree?.planted_at) return <LivingTree tree={tree} />;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[oklch(0.16_0.03_305.5)] p-4">
      <div className="relative h-[844px] w-[390px] overflow-hidden rounded-[2rem] shadow-2xl">
        {page === 1 ? <RelationshipPage onContinue={() => setPage(2)} /> : null}
        {page === 2 ? <StoryPage onContinue={() => setPage(3)} /> : null}
        {page === 3 ? <GiftPage tapCount={tapCount} opened={opened} onTap={tapGift} /> : null}
        {page === 4 ? <PlantPage name={name} setName={setName} saving={saving} onPlant={plant} /> : null}
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
          <p className="mt-3 text-[16px] italic leading-relaxed" style={{ fontFamily: GARAMOND }}>Arizona State University’s Changing Futures brings that same belief in possibility into education: opportunity can change the direction of a life. Rooted connects those ideas through one small gesture — planting a seed and watching what it can become.</p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3"><VideoPlaceholder label="A farmer’s story" /><VideoPlaceholder label="A student’s story" /></div>
        <div className="mt-auto"><p className="mb-3 text-center text-[13px] italic text-plum-deep/70" style={{ fontFamily: GARAMOND }}>Three stories. One growing future.</p><button type="button" onClick={onContinue} className="w-full rounded-full bg-gold px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-plum-deep" style={{ fontFamily: HAAS }}>Continue</button></div>
      </div>
    </section>
  );
}

function VideoPlaceholder({ label }: { label: string }) {
  return <div className="overflow-hidden rounded-2xl border border-plum-deep/20 bg-plum-deep/10"><video className="aspect-video w-full object-cover" controls muted playsInline preload="metadata" src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" /><p className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em]" style={{ fontFamily: HAAS }}>{label} / sample footage</p></div>;
}

function StoryPage({ onContinue }: { onContinue: () => void }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const timers = [window.setTimeout(() => setStage(1), 1200), window.setTimeout(() => setStage(2), 2500), window.setTimeout(() => setStage(3), 3900)];
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

function PlantPage({ name, setName, saving, onPlant }: { name: string; setName: (v: string) => void; saving: boolean; onPlant: () => void }) {
  return (
    <section className="relative flex h-full w-full flex-col overflow-hidden bg-plum px-8 pb-10 pt-16">
      <div className="flex items-center justify-between"><span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-gold-soft/70" style={{ fontFamily: HAAS }}>Rooted</span><span className="text-[11px] uppercase tracking-[0.2em] text-gold-soft/60" style={{ fontFamily: HAAS }}>Planting / 01</span></div>
      <div className="relative flex flex-1 items-center justify-center"><div className="absolute bottom-20 left-1/2 h-28 w-56 -translate-x-1/2"><KraftSoil className="h-full" /></div><img src={cocoaSeed} alt="Cocoa seed" className="relative z-10 w-28 object-contain drop-shadow-[0_0_24px_rgba(233,194,90,.35)]" /></div>
      <div><h2 className="text-6xl font-bold leading-none text-gold-soft" style={{ fontFamily: BODONI }}>Plant</h2><p className="mt-3 text-[16px] italic leading-relaxed text-foreground/80" style={{ fontFamily: GARAMOND }}>Your seed has just been planted in the nurseries of Cadbury’s Cocoa Life program in West Africa. From here, its growth follows real time.</p><label className="mt-4 block text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/60" style={{ fontFamily: HAAS }}>Name (optional)<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="mt-2 w-full rounded-xl border border-gold/40 bg-plum-deep/60 px-4 py-3 text-base normal-case tracking-normal text-foreground outline-none" style={{ fontFamily: GARAMOND }} /></label><button type="button" disabled={saving} onClick={onPlant} className="mt-4 w-full rounded-full bg-gold px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-plum-deep disabled:opacity-60" style={{ fontFamily: HAAS }}>{saving ? "Planting…" : "Plant my seed"}</button></div>
    </section>
  );
}

export function LivingTree({ tree }: { tree: TreeRecord }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(id); }, []);
  const elapsed = Math.max(0, now - new Date(tree.planted_at).getTime());
  const duration = GROWTH_DURATION_HOURS * 60 * 60 * 1000;
  const ratio = Math.min(1, elapsed / duration);
  const stage = ratio >= 1 ? 4 : ratio >= .72 ? 3 : ratio >= .42 ? 2 : ratio >= .12 ? 1 : 0;
  const labels = ["Your seed is settling into the soil.", "Your tree is taking root.", "Your tree has its first leaves.", "Your tree is reaching upward.", "Your tree has fully grown."];
  const next = Math.max(0, duration - elapsed);
  const hours = Math.floor(next / 3600000);
  const minutes = Math.floor((next % 3600000) / 60000);
  const seconds = Math.floor((next % 60000) / 1000);
  return (
    <main className="flex min-h-screen items-center justify-center bg-[oklch(0.16_0.03_305.5)] p-4"><section className="relative h-[844px] w-[390px] overflow-hidden rounded-[2rem] bg-plum px-8 pb-10 pt-16 shadow-2xl"><ChangingFuturesMark /><div className="mt-5"><p className="text-[11px] uppercase tracking-[0.3em] text-gold-soft/60" style={{ fontFamily: HAAS }}>Your living tree</p><h1 className="mt-2 text-5xl font-bold leading-none text-gold-soft" style={{ fontFamily: BODONI }}>{tree.name ? `${tree.name}'s tree` : "Your tree"}</h1></div><div className="relative mt-4 flex h-[400px] items-end justify-center overflow-visible"><div className="absolute bottom-0 left-0 right-0 h-28"><KraftSoil className="h-full" /></div><img src={stage === 0 ? cocoaSeed : cocoaTree} alt="Cocoa tree growth stage" className="absolute bottom-16 left-1/2 z-10 -translate-x-1/2 object-contain" style={{ width: stage === 0 ? 92 : 290, opacity: stage === 0 ? 1 : .55 + stage * .1125, transform: `translateX(-50%) scale(${stage === 0 ? 1 : .42 + stage * .145})`, transformOrigin: "bottom center", transition: `transform 1800ms ${SOFT}, opacity 1400ms ${SOFT}` }} /></div><p className="text-center text-xl italic text-gold-soft" style={{ fontFamily: GARAMOND }}>{labels[stage]}</p><div className="mt-4 rounded-2xl border border-gold/25 bg-plum-deep/45 p-4 text-center"><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gold/70" style={{ fontFamily: HAAS }}>Cocoa Life / West Africa</p><p className="mt-2 text-sm italic text-foreground/75" style={{ fontFamily: GARAMOND }}>{stage === 4 ? "Fully grown — this tree will remain rooted here." : `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s remaining`}</p></div></section></main>
  );
}

function makeGuestId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID().replace(/-/g, "").slice(0, 10);
  return Math.random().toString(36).slice(2, 12);
}

export default RootedExperience;

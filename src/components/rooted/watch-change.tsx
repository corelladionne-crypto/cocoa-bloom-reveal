import { useEffect, useMemo, useState } from "react";
import asuLogo from "@/assets/asu logo.png";
import cadburyLogo from "@/assets/Cadbury-Logo-3.png";
import changingFuturesLogo from "@/assets/ASU_Changing-Futures-Mark_3_RGB_Black-and-Gold_ASU_Vertical-150ppi-1-1.png-2.webp";
import cocoaSeed from "@/assets/cacao-seed.png";
import seedGround from "@/assets/seed-ground.png";

const MAROON = "#8C1D40";
const DARK_MAROON = "#4B1630";
const GOLD = "#FFC627";
const CREAM = "#F4E7CF";
const INK = "#2B1521";
const STORAGE_PREFIX = "rooted:guest:";
const BASE_COUNT = 12846;
const BODONI = '"Bodoni 72", "Bodoni MT", Didot, Georgia, serif';
const HAAS = '"Neue Haas Grotesk Display Pro", "Helvetica Neue", Arial, sans-serif';
const GARAMOND = '"EB Garamond", Georgia, serif';

export function WatchChange({ guestId }: { guestId: string }) {
  const [screen, setScreen] = useState(0);
  const [plantedAt, setPlantedAt] = useState<number | null>(null);
  const [animationDone, setAnimationDone] = useState(false);
  const [count, setCount] = useState(BASE_COUNT);
  const storageKey = useMemo(() => `${STORAGE_PREFIX}${guestId}`, [guestId]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as { id?: string; planted_at?: number };
        if (parsed.id === guestId && typeof parsed.planted_at === "number") {
          setPlantedAt(parsed.planted_at);
          setCount(BASE_COUNT + 1);
          setScreen(4);
        }
      }
    } catch {}
  }, [guestId, storageKey]);

  useEffect(() => {
    if (screen !== 1) return;
    const timer = window.setTimeout(() => setAnimationDone(true), 6200);
    return () => window.clearTimeout(timer);
  }, [screen]);

  const plantSeed = () => {
    if (plantedAt) return;
    const timestamp = Date.now();
    try { localStorage.setItem(storageKey, JSON.stringify({ id: guestId, planted_at: timestamp })); } catch {}
    setPlantedAt(timestamp);
    setCount(BASE_COUNT + 1);
    setScreen(1);
  };

  const resetForPreview = () => {
    try { localStorage.removeItem(storageKey); } catch {}
    setPlantedAt(null);
    setScreen(0);
    setAnimationDone(false);
    setCount(BASE_COUNT);
  };

  return (
    <main className="min-h-screen" style={{ background: DARK_MAROON }}>
      <div className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden shadow-2xl" style={{ background: CREAM, color: INK }}>
        {screen === 0 && <Invitation onPlant={plantSeed} />}
        {screen === 1 && <SeedReveal done={animationDone} onContinue={() => setScreen(2)} />}
        {screen === 2 && <CollectiveImpact count={count} onContinue={() => setScreen(3)} />}
        {screen === 3 && <Stories onContinue={() => setScreen(4)} />}
        {screen === 4 && <Landscape count={count} onContinue={() => setScreen(5)} />}
        {screen === 5 && <Takeaway onReset={resetForPreview} />}
      </div>
    </main>
  );
}

function BrandBar() {
  return <div className="flex items-center justify-between gap-4 border-b px-7 py-5" style={{ borderColor: `${INK}22` }}><img src={asuLogo} alt="Arizona State University" className="h-11 w-auto object-contain" /><img src={cadburyLogo} alt="Cadbury" className="h-10 w-auto object-contain" /></div>;
}

function Wordmark() {
  return <img src={changingFuturesLogo} alt="ASU Changing Futures" className="h-16 w-auto max-w-[210px] object-contain object-left" />;
}

function Button({ children, onClick, dark = false }: { children: React.ReactNode; onClick: () => void; dark?: boolean }) {
  return <button type="button" onClick={onClick} className="w-full rounded-full px-6 py-4 text-[12px] font-bold uppercase tracking-[0.18em] transition-transform active:scale-[.98]" style={{ background: dark ? DARK_MAROON : GOLD, color: dark ? CREAM : DARK_MAROON, fontFamily: HAAS }}>{children}</button>;
}

function Invitation({ onPlant }: { onPlant: () => void }) {
  return <section className="relative flex min-h-screen flex-col" style={{ background: CREAM }}><BrandBar /><div className="flex flex-1 flex-col px-7 pb-8 pt-10"><Wordmark /><p className="mt-10 text-[10px] font-bold uppercase tracking-[0.34em]" style={{ color: MAROON, fontFamily: HAAS }}>Watch change take root</p><h1 className="mt-4 text-[4.15rem] font-semibold leading-[.84] tracking-[-0.055em]" style={{ fontFamily: BODONI }}>Change starts<br />with a seed.</h1><p className="mt-7 max-w-[22rem] text-[20px] italic leading-[1.25]" style={{ fontFamily: GARAMOND }}>A single seed can become something greater when it is given the opportunity to take root.</p><div className="mt-auto pt-10"><p className="mb-4 text-center text-[11px] uppercase tracking-[0.22em] opacity-60" style={{ fontFamily: HAAS }}>Your invitation starts here</p><Button onClick={onPlant}>Tap to plant your seed</Button></div></div></section>;
}

function SeedReveal({ done, onContinue }: { done: boolean; onContinue: () => void }) {
  return <section className="relative flex min-h-screen flex-col overflow-hidden" style={{ background: DARK_MAROON, color: CREAM }}><div className="px-7 pt-8"><p className="text-[10px] uppercase tracking-[0.32em] opacity-60" style={{ fontFamily: HAAS }}>01 / The seed</p></div><div className="relative flex flex-1 flex-col items-center justify-center px-7 text-center"><div className="relative h-[390px] w-full overflow-hidden"><div className="absolute bottom-10 left-1/2 h-44 w-[330px] -translate-x-1/2 overflow-hidden rounded-[50%] opacity-80"><img src={seedGround} alt="Illustrated desert soil" className="h-full w-full object-cover" /></div><div className="absolute bottom-[100px] left-1/2 h-1 w-36 -translate-x-1/2 rounded-full" style={{ background: GOLD, transform: "translateX(-50%) scaleX(0)", animation: "rootline 1.7s 1.2s forwards ease-out" }} /><div className="absolute bottom-[118px] left-1/2 h-32 w-24 -translate-x-1/2" style={{ opacity: 0, animation: "stem 1.7s 3.1s forwards ease-out" }}><div className="absolute bottom-0 left-1/2 h-28 w-[3px] -translate-x-1/2" style={{ background: GOLD }} /><div className="absolute left-1/2 top-3 h-9 w-16 -translate-x-1/2 rotate-[-20deg] rounded-[100%_0_100%_0]" style={{ background: "#8BAF68" }} /></div><img src={cocoaSeed} alt="Palo Verde seed" className="absolute left-1/2 top-28 w-24 -translate-x-1/2" style={{ animation: "seedDrop 1.2s forwards cubic-bezier(.22,1,.36,1)" }} /></div><p className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: GOLD, fontFamily: HAAS }}>Roots begin to form.</p><p className="mt-4 max-w-[20rem] text-[18px] italic leading-relaxed opacity-80" style={{ fontFamily: GARAMOND }}>A small beginning can become something larger when it has room to grow.</p></div><div className="px-7 pb-9"><p className="mb-4 text-center text-[12px] opacity-65" style={{ fontFamily: GARAMOND }}>{done ? "Your seed joins thousands of others." : "Give it a moment to take root."}</p><Button dark onClick={onContinue}>{done ? "See what your seed is part of" : "Continue"}</Button></div><style>{`@keyframes seedDrop{0%{transform:translate(-50%,-80px) rotate(-18deg);opacity:0}35%{opacity:1}100%{transform:translate(-50%,150px) rotate(8deg);opacity:1}}@keyframes rootline{to{transform:translateX(-50%) scaleX(1)}}@keyframes stem{to{opacity:1;transform:translateY(-4px)}}`}</style></section>;
}

function CollectiveImpact({ count, onContinue }: { count: number; onContinue: () => void }) {
  return <section className="flex min-h-screen flex-col px-7 py-8" style={{ background: MAROON, color: CREAM }}><p className="text-[10px] uppercase tracking-[0.32em] opacity-60" style={{ fontFamily: HAAS }}>02 / The collective</p><div className="flex flex-1 flex-col justify-center"><p className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: GOLD, fontFamily: HAAS }}>Changing Futures community</p><div className="mt-4 text-[5.4rem] font-semibold leading-[.8] tracking-[-0.06em]" style={{ fontFamily: BODONI }}>{count.toLocaleString()}</div><h2 className="mt-5 text-3xl font-semibold leading-tight" style={{ fontFamily: HAAS }}>seeds planted.</h2><p className="mt-6 max-w-[22rem] text-[21px] italic leading-[1.2]" style={{ fontFamily: GARAMOND }}>You just added one.</p><div className="mt-8 border-l-2 pl-5" style={{ borderColor: GOLD }}><p className="text-[17px] leading-[1.45] opacity-90" style={{ fontFamily: GARAMOND }}>Every seed represents a person, an idea, an opportunity or a connection with the potential to create change.</p></div></div><Button onClick={onContinue}>See what your seed is part of →</Button></section>;
}

const stories = [
  { category: "EDUCATION", title: "A chance to begin earlier.", body: "Accelerate ASU brings real college courses into high schools so students can earn credit, build confidence and believe they belong in higher education." },
  { category: "LIFELONG LEARNING", title: "Learning that grows with you.", body: "ASU for Life uses personalized pathways and AI-powered tools to help learners build skills, networks and confidence throughout their careers." },
  { category: "FUTURE OF WORK", title: "Skills for what's next.", body: "CareerCatalyst offers flexible upskilling and reskilling through hundreds of courses and credentials in fields including AI, healthcare and microelectronics." },
  { category: "COMMUNITY", title: "Knowledge that strengthens communities.", body: "Health Literacy delivers accessible, community-informed learning that helps people navigate care, understand prevention and make informed decisions." },
];

function Stories({ onContinue }: { onContinue: () => void }) {
  const [active, setActive] = useState(0);
  const story = stories[active]!;
  return <section className="flex min-h-screen flex-col px-7 py-8" style={{ background: CREAM }}><div className="flex items-center justify-between"><p className="text-[10px] uppercase tracking-[0.32em]" style={{ color: MAROON, fontFamily: HAAS }}>03 / Stories</p><span className="text-[11px] opacity-50" style={{ fontFamily: HAAS }}>{active + 1} / {stories.length}</span></div><div className="mt-12"><p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: MAROON, fontFamily: HAAS }}>One seed. Many stories.</p><h2 className="mt-3 text-[3.6rem] font-semibold leading-[.9] tracking-[-0.04em]" style={{ fontFamily: BODONI }}>The seed<br />is people.</h2></div><article className="mt-9 border-t-2 pt-7" style={{ borderColor: MAROON }}><p className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: MAROON, fontFamily: HAAS }}>{story.category}</p><h3 className="mt-3 text-3xl font-semibold leading-tight" style={{ fontFamily: HAAS }}>{story.title}</h3><p className="mt-5 text-[19px] leading-[1.35]" style={{ fontFamily: GARAMOND }}>{story.body}</p></article><div className="mt-auto"><div className="mb-6 flex gap-2">{stories.map((item, i) => <button key={item.category} type="button" aria-label={`Story ${i + 1}`} onClick={() => setActive(i)} className="h-1.5 flex-1 rounded-full" style={{ background: i === active ? MAROON : `${INK}20` }} />)}</div><Button onClick={active < stories.length - 1 ? () => setActive(active + 1) : onContinue}>{active < stories.length - 1 ? "Next story" : "See the landscape →"}</Button></div></section>;
}

function Landscape({ count, onContinue }: { count: number; onContinue: () => void }) {
  const blossoms = Array.from({ length: 36 }, (_, i) => ({ left: (i * 37) % 100, top: 24 + ((i * 17) % 58), scale: 0.55 + ((i * 13) % 80) / 100, delay: (i % 8) * 80 }));
  return <section className="relative flex min-h-screen flex-col overflow-hidden" style={{ background: DARK_MAROON, color: CREAM }}><div className="relative z-20 px-7 pt-8"><p className="text-[10px] uppercase tracking-[0.32em] opacity-60" style={{ fontFamily: HAAS }}>04 / The landscape</p><h2 className="mt-8 text-[3.4rem] font-semibold leading-[.88] tracking-[-0.04em]" style={{ fontFamily: BODONI }}>Together,<br />we're changing<br />the landscape.</h2></div><div className="absolute inset-x-0 bottom-0 top-[45%] overflow-hidden" style={{ background: `linear-gradient(to top, ${MAROON}, transparent)` }}>{blossoms.map((b, i) => <span key={i} className="absolute block size-3 rounded-full" style={{ left: `${b.left}%`, top: `${b.top}%`, background: GOLD, transform: `scale(${b.scale}) rotate(${i * 19}deg)`, boxShadow: `0 0 18px ${GOLD}55`, animation: `bloom 900ms ${b.delay}ms both cubic-bezier(.22,1,.36,1)` }} />)}<div className="absolute bottom-[-20px] left-[-10%] h-32 w-[120%] rounded-[50%_50%_0_0] border-t" style={{ borderColor: `${GOLD}55`, background: MAROON }} /></div><div className="relative z-20 mt-auto px-7 pb-8 pt-12"><p className="text-[2.7rem] font-semibold leading-none" style={{ fontFamily: BODONI }}>{count.toLocaleString()} seeds planted.</p><p className="mt-3 text-[18px] italic opacity-75" style={{ fontFamily: GARAMOND }}>One growing community.</p><div className="mt-6"><Button onClick={onContinue}>Your seed is planted →</Button></div></div><style>{`@keyframes bloom{from{opacity:0;transform:scale(0) rotate(0deg)}to{opacity:1}}`}</style></section>;
}

function Takeaway({ onReset }: { onReset: () => void }) {
  return <section className="flex min-h-screen flex-col px-7 py-8" style={{ background: CREAM }}><p className="text-[10px] uppercase tracking-[0.32em]" style={{ color: MAROON, fontFamily: HAAS }}>05 / The invitation continues</p><div className="mt-12"><Wordmark /><h1 className="mt-10 text-[4rem] font-semibold leading-[.86] tracking-[-0.05em]" style={{ fontFamily: BODONI }}>Your seed<br />is planted.</h1><h2 className="mt-5 text-2xl font-semibold" style={{ fontFamily: HAAS }}>Now help it grow.</h2><p className="mt-5 text-[20px] italic leading-[1.3]" style={{ fontFamily: GARAMOND }}>Stay connected to Changing Futures and discover the people, ideas and opportunities shaping what's next.</p></div><div className="mt-auto"><Button onClick={() => window.open("https://learning.asu.edu/our-impact/changing-futures/", "_blank", "noopener,noreferrer")}>Explore Changing Futures</Button><p className="mt-5 text-center text-[10px] uppercase tracking-[0.2em] opacity-50" style={{ fontFamily: HAAS }}>Arizona State University · Changing Futures</p><button type="button" onClick={onReset} className="mt-6 w-full text-[10px] uppercase tracking-[0.18em] opacity-35" style={{ fontFamily: HAAS }}>Preview this experience again</button></div></section>;
}

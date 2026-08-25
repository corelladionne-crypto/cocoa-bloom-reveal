import { useEffect, useMemo, useState } from "react";

import cocoaSeed from "@/assets/cacao-seed.png";
import { AsuMark, CadburyMark, ChangingFuturesMark } from "@/components/rooted/logos";

const MAROON = "#8C1D40";
const GOLD = "#FFC627";
const CREAM = "#F7F0DF";
const INK = "#241A20";
const SAND = "#D9C49B";
const HAAS = '"Neue Haas Grotesk Display Pro", "Helvetica Neue", Arial, sans-serif';
const GARAMOND = '"EB Garamond", Georgia, serif';
const BODONI = '"Bodoni 72", "Bodoni MT", Didot, Georgia, serif';

const BASE_COMMUNITY_COUNT = 12846;

type Props = { guestId: string };

function storageKey(id: string) {
  return `rooted:planted:${id}`;
}

function hasPlanted(id: string) {
  try {
    return Boolean(window.localStorage.getItem(storageKey(id)));
  } catch {
    return false;
  }
}

function savePlanted(id: string) {
  window.localStorage.setItem(storageKey(id), new Date().toISOString());
}

export function LocalTreeExperience({ guestId }: Props) {
  const id = useMemo(() => guestId, [guestId]);
  const [screen, setScreen] = useState(0);
  const [planted, setPlanted] = useState(false);
  const [localCount, setLocalCount] = useState(0);

  useEffect(() => {
    if (hasPlanted(id)) {
      setPlanted(true);
      setScreen(4);
    }
  }, [id]);

  const plant = () => {
    if (!planted) {
      try {
        savePlanted(id);
      } catch {
        // The experience can continue even if browser storage is unavailable.
      }
      setPlanted(true);
      setLocalCount(1);
    }
    setScreen(1);
  };

  return (
    <main style={{ background: INK, fontFamily: GARAMOND }} className="min-h-screen">
      <div className="mx-auto min-h-screen w-full max-w-[520px] overflow-hidden shadow-2xl">
        {screen === 0 && <Invitation onPlant={plant} />}
        {screen === 1 && <SeedReveal onDone={() => setScreen(2)} />}
        {screen === 2 && <CollectiveCount localCount={localCount} onStories={() => setScreen(3)} />}
        {screen === 3 && <Stories onLandscape={() => setScreen(4)} />}
        {screen === 4 && <Landscape onExplore={() => setScreen(5)} />}
        {screen === 5 && <Takeaway />}
      </div>
    </main>
  );
}

function Shell({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <section
      className="relative flex min-h-screen flex-col overflow-hidden px-7 py-8 sm:px-10"
      style={{ background: dark ? MAROON : CREAM, color: dark ? CREAM : INK }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 20% 15%, rgba(255,198,39,.18), transparent 28%), radial-gradient(circle at 90% 80%, rgba(140,29,64,.10), transparent 32%)" }} />
      <div className="relative z-10 flex min-h-screen flex-col">{children}</div>
    </section>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between" style={{ fontFamily: HAAS }}>
      <AsuMark />
      <span className="text-[9px] font-bold uppercase tracking-[0.24em]" style={{ color: MAROON }}>Changing Futures</span>
    </header>
  );
}

function Button({ children, onClick, dark = false }: { children: React.ReactNode; onClick: () => void; dark?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center justify-between rounded-full px-5 py-4 text-left text-[12px] font-bold uppercase tracking-[0.17em] transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0"
      style={{ background: dark ? GOLD : MAROON, color: dark ? MAROON : CREAM, fontFamily: HAAS }}
    >
      <span>{children}</span><span className="text-xl transition-transform group-hover:translate-x-1">→</span>
    </button>
  );
}

function Invitation({ onPlant }: { onPlant: () => void }) {
  return (
    <Shell>
      <Header />
      <div className="mt-16 flex flex-1 flex-col">
        <p className="text-[10px] font-bold uppercase tracking-[0.34em]" style={{ fontFamily: HAAS, color: MAROON }}>A Changing Futures invitation</p>
        <h1 className="mt-5 text-[clamp(3.8rem,17vw,6.6rem)] font-bold leading-[0.82] tracking-[-0.05em]" style={{ fontFamily: BODONI, color: MAROON }}>
          CHANGE<br />STARTS<br />WITH A<br /><span style={{ color: INK }}>SEED.</span>
        </h1>
        <div className="mt-8 max-w-[25rem] border-l-2 pl-5" style={{ borderColor: GOLD }}>
          <p className="text-[21px] italic leading-[1.2]">A single seed can become something greater when it is given the opportunity to take root.</p>
        </div>
        <div className="mt-auto pt-14">
          <div className="mb-8 flex items-end justify-between">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ fontFamily: HAAS }}>Seed / Root / Connect / Flourish</p><p className="mt-2 text-sm opacity-65">Your invitation starts here.</p></div>
            <div className="h-16 w-16 rounded-full border" style={{ borderColor: `${MAROON}55` }}><img src={cocoaSeed} alt="Seed" className="h-full w-full object-contain p-2" /></div>
          </div>
          <Button onClick={onPlant}>Tap to plant your seed</Button>
        </div>
      </div>
    </Shell>
  );
}

function SeedReveal({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const timers = [
      window.setTimeout(() => setStep(1), 900),
      window.setTimeout(() => setStep(2), 2400),
      window.setTimeout(() => setStep(3), 3900),
      window.setTimeout(() => setStep(4), 5600),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, []);

  return (
    <Shell dark>
      <Header />
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.32em]" style={{ fontFamily: HAAS, color: GOLD }}>01 / Seed</p>
        <div className="relative mt-10 h-[360px] w-full overflow-hidden rounded-[2rem]" style={{ background: "linear-gradient(180deg, #8C1D40 0%, #7A2943 52%, #A88957 52%, #CBB887 100%)" }}>
          <div className="absolute bottom-[48%] left-1/2 h-px w-52 -translate-x-1/2" style={{ background: `${GOLD}88` }} />
          <div className="absolute bottom-[8%] left-1/2 h-24 w-56 -translate-x-1/2 rounded-[50%] opacity-30" style={{ background: "#5B3C2A" }} />
          <img
            src={cocoaSeed}
            alt="Palo Verde seed"
            className="absolute left-1/2 z-20 w-20 object-contain"
            style={{
              bottom: step === 0 ? "58%" : "45%",
              transform: `translateX(-50%) scale(${step === 0 ? 1.1 : 0.72})`,
              opacity: step >= 1 ? 1 : 0,
              transition: "all 1100ms cubic-bezier(.22,1,.36,1)",
            }}
          />
          <div className="absolute bottom-[22%] left-1/2 h-28 w-32 -translate-x-1/2" style={{ opacity: step >= 2 ? 1 : 0, transition: "opacity 900ms ease" }}>
            <div className="absolute left-1/2 top-0 h-28 w-px -translate-x-1/2 rotate-[12deg]" style={{ background: CREAM }} />
            <div className="absolute left-1/2 top-10 h-16 w-px -translate-x-1/2 -rotate-[48deg] origin-top" style={{ background: CREAM }} />
            <div className="absolute left-1/2 top-14 h-14 w-px -translate-x-1/2 rotate-[52deg] origin-top" style={{ background: CREAM }} />
          </div>
          <div className="absolute bottom-[34%] left-1/2 h-20 w-px -translate-x-1/2" style={{ background: GOLD, opacity: step >= 3 ? 1 : 0, transform: `translateX(-50%) scaleY(${step >= 4 ? 1 : .4})`, transformOrigin: "bottom", transition: "all 900ms ease" }} />
          <div className="absolute left-1/2 top-[19%] flex -translate-x-1/2 gap-1" style={{ opacity: step >= 4 ? 1 : 0, transform: `translateX(-50%) scale(${step >= 4 ? 1 : .4})`, transition: "all 1000ms cubic-bezier(.22,1,.36,1)" }}>
            {[0,1,2,3,4].map((n) => <span key={n} className="h-4 w-4 rounded-full" style={{ background: n % 2 ? GOLD : CREAM }} />)}
          </div>
        </div>
        <h2 className="mt-9 text-5xl font-bold leading-[.9]" style={{ fontFamily: BODONI, color: GOLD }}>{step < 2 ? "YOUR SEED." : step < 4 ? "ROOTS BEGIN\nTO FORM." : "A POSSIBILITY\nTAKES ROOT."}</h2>
        <p className="mt-4 max-w-[21rem] text-lg italic opacity-80">{step < 4 ? "Watch closely." : "Your seed joins thousands of others."}</p>
        {step >= 4 && <div className="mt-8 w-full"><Button dark onClick={onDone}>Continue</Button></div>}
      </div>
    </Shell>
  );
}

function CollectiveCount({ localCount, onStories }: { localCount: number; onStories: () => void }) {
  const count = BASE_COMMUNITY_COUNT + localCount;
  return (
    <Shell>
      <Header />
      <div className="flex flex-1 flex-col justify-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.32em]" style={{ fontFamily: HAAS, color: MAROON }}>02 / Collective impact</p>
        <p className="mt-10 text-[clamp(5rem,25vw,9rem)] font-bold leading-none tracking-[-0.06em]" style={{ fontFamily: BODONI, color: MAROON }}>{count.toLocaleString()}</p>
        <h2 className="mt-3 text-3xl font-bold uppercase tracking-[-0.02em]" style={{ fontFamily: HAAS }}>seeds planted</h2>
        <div className="mt-7 flex items-center gap-3"><span className="h-3 w-3 rounded-full" style={{ background: GOLD }} /><span className="text-xl italic">You just added one.</span></div>
        <p className="mt-10 max-w-[27rem] text-[20px] leading-[1.2]">Every seed represents a person, an idea, an opportunity, or a connection with the potential to create change.</p>
        <div className="mt-auto pt-12"><p className="mb-5 text-sm opacity-65">Changing Futures is ASU’s campaign to shape a future that doesn’t yet exist—but must. It advances learning that unlocks opportunity, supports economic mobility and helps communities thrive. citeturn0view0</p><Button onClick={onStories}>See what your seed is part of</Button></div>
      </div>
    </Shell>
  );
}

const stories = [
  { label: "EDUCATION", title: "Accelerate", body: "Real college courses come into high schools, helping students earn credit, build confidence and believe they belong in higher education." },
  { label: "LIFELONG LEARNING", title: "ASU for Life", body: "Personalized learning pathways help people build skills, networks and confidence as they grow and pivot throughout their careers." },
  { label: "INNOVATION", title: "CareerCatalyst", body: "Fast, flexible learning helps people upskill and reskill for the future of work, with hundreds of courses and credentials." },
  { label: "COMMUNITY", title: "Health Literacy", body: "Accessible, community-informed learning helps people navigate care, understand prevention and make informed decisions for themselves and their families." },
];

function Stories({ onLandscape }: { onLandscape: () => void }) {
  const [active, setActive] = useState(0);
  const story = stories[active];
  return (
    <Shell dark>
      <Header />
      <div className="flex flex-1 flex-col">
        <p className="mt-14 text-[10px] font-bold uppercase tracking-[0.32em]" style={{ fontFamily: HAAS, color: GOLD }}>03 / Stories</p>
        <h2 className="mt-5 text-6xl font-bold leading-[.88]" style={{ fontFamily: BODONI }}>ONE SEED.<br />MANY STORIES.</h2>
        <p className="mt-5 max-w-[27rem] text-lg italic opacity-80">The seed isn't really about a tree. It is about people, ideas and opportunities that can change what comes next.</p>
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {stories.map((item, index) => <button key={item.title} type="button" onClick={() => setActive(index)} className="shrink-0 rounded-full border px-4 py-2 text-[10px] font-bold tracking-[0.18em]" style={{ fontFamily: HAAS, borderColor: index === active ? GOLD : `${CREAM}55`, background: index === active ? GOLD : "transparent", color: index === active ? MAROON : CREAM }}>{item.label}</button>)}
        </div>
        <article className="mt-7 flex flex-1 flex-col rounded-[2rem] p-6" style={{ background: CREAM, color: INK }}>
          <div className="flex items-start justify-between"><span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ fontFamily: HAAS, color: MAROON }}>{story.label}</span><span className="text-[11px] opacity-50" style={{ fontFamily: HAAS }}>0{active + 1} / 04</span></div>
          <h3 className="mt-auto text-6xl font-bold leading-[.85]" style={{ fontFamily: BODONI, color: MAROON }}>{story.title}</h3>
          <p className="mt-5 text-[21px] leading-[1.15]">{story.body}</p>
          <p className="mt-5 text-sm italic opacity-65">One example of how learning can unlock opportunity and help communities thrive. citeturn0view0</p>
        </article>
        <div className="pt-5"><Button dark onClick={onLandscape}>See the landscape</Button></div>
      </div>
    </Shell>
  );
}

function Blossom({ style }: { style?: React.CSSProperties }) {
  return <span className="absolute block h-3 w-3 rounded-full" style={{ background: GOLD, boxShadow: `0 0 0 2px ${CREAM}33`, ...style }} />;
}

function Landscape({ onExplore }: { onExplore: () => void }) {
  const blossoms = Array.from({ length: 38 }, (_, i) => ({ left: `${(i * 37) % 98}%`, bottom: `${10 + ((i * 19) % 48)}%`, delay: `${(i % 8) * 120}ms`, scale: 0.55 + ((i * 13) % 7) / 10 }));
  return (
    <Shell dark>
      <Header />
      <div className="flex flex-1 flex-col justify-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.32em]" style={{ fontFamily: HAAS, color: GOLD }}>04 / The landscape</p>
        <h2 className="mt-5 text-6xl font-bold leading-[.86]" style={{ fontFamily: BODONI }}>TOGETHER,<br />WE'RE<br /><span style={{ color: GOLD }}>CHANGING</span><br />THE LANDSCAPE.</h2>
        <div className="relative mt-8 h-64 overflow-hidden rounded-[2rem]" style={{ background: "linear-gradient(180deg, #8C1D40 0%, #9C4C54 48%, #B59B70 48%, #6F8A55 100%)" }}>
          <div className="absolute bottom-0 left-0 h-20 w-full" style={{ background: "#55704D", clipPath: "polygon(0 70%, 20% 38%, 43% 64%, 62% 30%, 81% 58%, 100% 36%, 100% 100%, 0 100%)" }} />
          {blossoms.map((b, i) => <Blossom key={i} style={{ left: b.left, bottom: b.bottom, transform: `scale(${b.scale})`, animation: `rootedBloom 2.4s ease ${b.delay} infinite alternate` }} />)}
          <span className="absolute bottom-3 left-4 text-[9px] font-bold uppercase tracking-[0.2em] text-white/70" style={{ fontFamily: HAAS }}>One seed → one blossom → a growing community</span>
        </div>
        <p className="mt-7 text-[22px] italic leading-[1.15]">Your contribution is small on its own. Together, individual contributions can create a landscape of opportunity.</p>
        <div className="mt-auto pt-8"><Button dark onClick={onExplore}>Make it part of your future</Button></div>
      </div>
      <style>{`@keyframes rootedBloom { from { opacity:.45; transform:scale(.72); } to { opacity:1; transform:scale(1.12); } }`}</style>
    </Shell>
  );
}

function Takeaway() {
  return (
    <Shell>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between"><AsuMark /><ChangingFuturesMark /></div>
        <div className="mt-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.32em]" style={{ fontFamily: HAAS, color: MAROON }}>05 / Your takeaway</p>
          <h1 className="mt-6 text-[clamp(4rem,18vw,7rem)] font-bold leading-[.8] tracking-[-0.05em]" style={{ fontFamily: BODONI, color: MAROON }}>YOUR SEED<br /><span style={{ color: INK }}>IS PLANTED.</span></h1>
          <h2 className="mt-8 text-4xl font-bold uppercase" style={{ fontFamily: HAAS }}>Now help it grow.</h2>
          <p className="mt-6 text-[21px] leading-[1.18]">Stay connected to Changing Futures and discover the people, ideas and opportunities shaping what’s next.</p>
        </div>
        <div className="mt-auto space-y-4 pt-12">
          <a href="https://learning.asu.edu/our-impact/changing-futures/" target="_blank" rel="noreferrer" className="flex w-full items-center justify-between rounded-full px-5 py-4 text-[12px] font-bold uppercase tracking-[0.17em]" style={{ background: MAROON, color: CREAM, fontFamily: HAAS }}>Explore Changing Futures <span className="text-xl">↗</span></a>
          <div className="flex items-center justify-between border-t pt-5" style={{ borderColor: `${MAROON}33` }}><CadburyMark /><span className="text-[9px] uppercase tracking-[0.2em] opacity-60" style={{ fontFamily: HAAS }}>Rooted / Watch Change Take Root</span></div>
        </div>
      </div>
    </Shell>
  );
}

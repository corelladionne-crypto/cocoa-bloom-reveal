import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import bracelet from "@/assets/pv-bracelet.png";
import mountains from "@/assets/pv-mountains.png";
import roots from "@/assets/pv-roots.png";
import seedArt from "@/assets/pv-seed.png";
import tree from "@/assets/pv-tree.png";
import changingFuturesLogo from "@/assets/ASU_Changing-Futures-Mark_3_RGB_Black-and-Gold_ASU_Vertical-150ppi-1-1.png-2.webp";

const PAPER = "#F1E6D2";
const PAPER_DEEP = "#E4D5B9";
const INK = "#3B3227";
const SAGE = "#6E7F5E";
const MAROON = "#8C1D40";
const GOLD = "#FFC627";

const DISPLAY = '"Bodoni Moda", "Bodoni 72", Didot, Georgia, serif';
const UI = '"Archivo", "Neue Haas Grotesk Display Pro", "Helvetica Neue", Arial, sans-serif';

const SPRING = "cubic-bezier(.22,1,.36,1)";
const CF_URL = "https://learning.asu.edu/our-impact/changing-futures/";

const ROOT_WORDS = ["Access", "Learning", "Opportunity", "Community", "Impact"];

const STORIES = [
  {
    label: "Access",
    title: "College, earlier.",
    body: "Real university courses come into high schools so students earn credit and start believing they belong.",
  },
  {
    label: "Learning",
    title: "Skills for what's next.",
    body: "Flexible courses and credentials help people upskill and reskill for work that doesn't exist yet.",
  },
  {
    label: "Community",
    title: "Knowledge that stays local.",
    body: "Community-informed learning helps families navigate care, prevention and informed decisions.",
  },
];

const SCREEN_COUNT = 7;

export function SeedOfChange({ guestId }: { guestId: string }) {
  const [screen, setScreen] = useState(0);
  const key = useMemo(() => `rooted:seed:${guestId}`, [guestId]);
  const next = useCallback(() => setScreen((s) => Math.min(s + 1, SCREEN_COUNT - 1)), []);

  useEffect(() => {
    try {
      localStorage.setItem(key, new Date().toISOString());
    } catch {
      /* storage unavailable */
    }
  }, [key]);

  return (
    <main className="min-h-screen w-full" style={{ background: PAPER_DEEP }}>
      <div
        className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col overflow-hidden"
        style={{ background: PAPER, color: INK, fontFamily: UI }}
      >
        <Grain />
        <div key={screen} className="relative z-10 flex min-h-screen flex-col" style={{ animation: `fadeUp 700ms ${SPRING} both` }}>
          {screen === 0 && <SeedScreen onNext={next} />}
          {screen === 1 && <RootsScreen onNext={next} />}
          {screen === 2 && <StoriesScreen onNext={next} />}
          {screen === 3 && <PaloVerdeScreen onNext={next} />}
          {screen === 4 && <CollectiveScreen onNext={next} />}
          {screen === 5 && <BraceletScreen onNext={next} />}
          {screen === 6 && <FinalScreen />}
        </div>
        <Progress step={screen} />
        <style>{`
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes sink{from{transform:translate(-50%,-90px) rotate(-8deg);opacity:0}60%{opacity:1}to{transform:translate(-50%,0) rotate(0);opacity:1}}
@keyframes rootsIn{from{opacity:0;clip-path:inset(0 0 100% 0)}to{opacity:.95;clip-path:inset(0 0 0 0)}}
@keyframes growTree{from{opacity:0;transform:translateX(-50%) scaleY(.25);}to{opacity:1;transform:translateX(-50%) scaleY(1);}}
@keyframes speck{from{opacity:0;transform:scale(.2)}to{opacity:1;transform:scale(1)}}
@keyframes drift{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        `}</style>
      </div>
    </main>
  );
}

function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 opacity-[.5]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 15%, rgba(140,29,64,.05), transparent 55%), radial-gradient(circle at 85% 70%, rgba(110,127,94,.08), transparent 60%)",
      }}
    />
  );
}

function Progress({ step }: { step: number }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex gap-1 px-7 pb-3">
      {Array.from({ length: SCREEN_COUNT }, (_, i) => (
        <span
          key={i}
          className="h-[2px] flex-1 rounded-full transition-all duration-500"
          style={{ background: i <= step ? MAROON : `${INK}1f` }}
        />
      ))}
    </div>
  );
}

function Chapter({ index, label }: { index: string; label: string }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[.32em]" style={{ color: MAROON }}>
      {index} · {label}
    </p>
  );
}

function Cta({ children, onClick, tone = "ink" }: { children: ReactNode; onClick: () => void; tone?: "ink" | "gold" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-full px-6 py-4 text-[11px] font-semibold uppercase tracking-[.22em] transition-transform duration-300 active:scale-[.98]"
      style={{
        background: tone === "gold" ? GOLD : MAROON,
        color: tone === "gold" ? INK : PAPER,
        transitionTimingFunction: SPRING,
      }}
    >
      {children}
    </button>
  );
}

function Screen({ children }: { children: ReactNode }) {
  return <section className="flex min-h-screen flex-col px-7 pb-12 pt-10">{children}</section>;
}

function Mountains({ className = "" }: { className?: string }) {
  return (
    <img
      src={mountains}
      alt=""
      aria-hidden
      loading="lazy"
      className={`pointer-events-none w-full select-none object-contain opacity-40 ${className}`}
    />
  );
}

/* 1 — Seed */
function SeedScreen({ onNext }: { onNext: () => void }) {
  return (
    <Screen>
      <Chapter index="01" label="Seed" />
      <div className="relative flex flex-1 flex-col items-center justify-center">
        <img
          src={seedArt}
          alt="Palo Verde seed illustration"
          width={125}
          height={345}
          className="h-[46vh] max-h-[340px] w-auto object-contain"
          style={{ animation: `drift 6s ease-in-out infinite` }}
        />
        <Mountains className="absolute inset-x-0 bottom-0" />
      </div>
      <h1 className="text-[3.5rem] font-medium leading-[.9] tracking-[-.03em]" style={{ fontFamily: DISPLAY }}>
        A seed can<br />change a future.
      </h1>
      <p className="mt-5 max-w-[22rem] text-[19px] italic leading-[1.3]" style={{ fontFamily: DISPLAY, color: `${INK}cc` }}>
        The Palo Verde seed represents possibility — small, patient and ready for the right conditions.
      </p>
      <div className="mt-auto pt-9">
        <Cta onClick={onNext}>Plant the seed of change</Cta>
      </div>
    </Screen>
  );
}

/* 2 — Roots */
function RootsScreen({ onNext }: { onNext: () => void }) {
  return (
    <Screen>
      <Chapter index="02" label="Roots" />
      <div className="relative mt-6 h-[46vh] max-h-[360px] w-full">
        <div
          className="absolute inset-x-0 top-[34%] h-[2px] rounded-full"
          style={{ background: `${INK}33` }}
        />
        <img
          src={seedArt}
          alt="Seed settling into the ground"
          width={125}
          height={345}
          className="absolute left-1/2 top-[6%] h-[30%] w-auto -translate-x-1/2 object-contain"
          style={{ animation: `sink 1400ms ${SPRING} both` }}
        />
        <img
          src={roots}
          alt="Roots spreading beneath the ground"
          width={611}
          height={644}
          loading="lazy"
          className="absolute left-1/2 top-[33%] w-[86%] -translate-x-1/2 object-contain"
          style={{ animation: `rootsIn 2200ms 900ms ${SPRING} both` }}
        />
      </div>
      <h2 className="mt-6 text-[3rem] font-medium leading-[.92] tracking-[-.03em]" style={{ fontFamily: DISPLAY }}>
        Roots become<br />opportunity.
      </h2>
      <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-2">
        {ROOT_WORDS.map((word, i) => (
          <li
            key={word}
            className="rounded-full border px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[.2em]"
            style={{
              borderColor: `${SAGE}77`,
              color: INK,
              animation: `speck 600ms ${1200 + i * 220}ms ${SPRING} both`,
            }}
          >
            {word}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-9">
        <Cta onClick={onNext}>Follow the roots</Cta>
      </div>
    </Screen>
  );
}

/* 3 — Stories */
function StoriesScreen({ onNext }: { onNext: () => void }) {
  const [active, setActive] = useState(0);
  const story = STORIES[active]!;
  const last = active === STORIES.length - 1;

  return (
    <Screen>
      <Chapter index="03" label="Stories" />
      <div className="relative mt-5 flex-1">
        <img
          src={roots}
          alt=""
          aria-hidden
          loading="lazy"
          className="pointer-events-none absolute inset-x-0 top-0 w-full select-none object-contain opacity-25"
        />
        <div className="relative pt-4">
          <h2 className="text-[2.7rem] font-medium leading-[.95] tracking-[-.03em]" style={{ fontFamily: DISPLAY }}>
            What grows<br />along the roots.
          </h2>
          <article key={active} className="mt-8" style={{ animation: `fadeUp 550ms ${SPRING} both` }}>
            <span className="text-[10px] font-semibold uppercase tracking-[.24em]" style={{ color: MAROON }}>
              {story.label}
            </span>
            <h3 className="mt-3 text-[2rem] font-medium leading-[1.02]" style={{ fontFamily: DISPLAY }}>
              {story.title}
            </h3>
            <p className="mt-4 max-w-[21rem] text-[18px] leading-[1.45]" style={{ color: `${INK}cc` }}>
              {story.body}
            </p>
          </article>
          <div className="mt-7 flex gap-2">
            {STORIES.map((s, i) => (
              <button
                key={s.label}
                type="button"
                aria-label={`Story ${i + 1}`}
                onClick={() => setActive(i)}
                className="h-[3px] w-10 rounded-full transition-colors"
                style={{ background: i === active ? MAROON : `${INK}22` }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-auto pt-9">
        <Cta onClick={last ? onNext : () => setActive(active + 1)}>{last ? "See the Palo Verde" : "Next story"}</Cta>
      </div>
    </Screen>
  );
}

/* 4 — Palo Verde */
function PaloVerdeScreen({ onNext }: { onNext: () => void }) {
  return (
    <Screen>
      <Chapter index="04" label="Palo Verde" />
      <div className="relative flex flex-1 items-end justify-center">
        <Mountains className="absolute inset-x-0 bottom-0" />
        <img
          src={tree}
          alt="Full Palo Verde tree illustration"
          width={611}
          height={873}
          loading="lazy"
          className="relative left-1/2 h-[46vh] max-h-[380px] w-auto object-contain"
          style={{ transformOrigin: "bottom center", animation: `growTree 2400ms ${SPRING} both` }}
        />
      </div>
      <h2 className="mt-7 text-[3.2rem] font-medium leading-[.92] tracking-[-.03em]" style={{ fontFamily: DISPLAY }}>
        A future doesn't<br />grow alone.
      </h2>
      <p className="mt-5 max-w-[22rem] text-[19px] italic leading-[1.3]" style={{ fontFamily: DISPLAY, color: `${INK}cc` }}>
        It grows through people, opportunity, learning, and connection.
      </p>
      <div className="mt-auto pt-9">
        <Cta onClick={onNext}>Continue</Cta>
      </div>
    </Screen>
  );
}

/* 5 — Collective impact */
function CollectiveScreen({ onNext }: { onNext: () => void }) {
  const seeds = Array.from({ length: 22 }, (_, i) => ({
    left: 6 + ((i * 29) % 88),
    top: 8 + ((i * 41) % 74),
    size: 14 + ((i * 7) % 16),
    delay: 200 + (i % 11) * 130,
  }));

  return (
    <Screen>
      <Chapter index="05" label="Collective impact" />
      <div className="relative mt-6 h-[44vh] max-h-[350px] w-full">
        <Mountains className="absolute inset-x-0 bottom-0" />
        {seeds.map((s, i) => (
          <img
            key={i}
            src={seedArt}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute select-none object-contain"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              opacity: 0.75,
              animation: `speck 800ms ${s.delay}ms ${SPRING} both`,
            }}
          />
        ))}
      </div>
      <h2 className="mt-7 text-[3.2rem] font-medium leading-[.92] tracking-[-.03em]" style={{ fontFamily: DISPLAY }}>
        Your seed is<br />one of many.
      </h2>
      <p className="mt-5 max-w-[22rem] text-[18px] leading-[1.45]" style={{ color: `${INK}cc` }}>
        Across the desert and beyond it, each seed is a person, an idea or an opportunity taking root.
      </p>
      <div className="mt-auto pt-9">
        <Cta onClick={onNext}>Continue</Cta>
      </div>
    </Screen>
  );
}

/* 6 — Bracelet */
function BraceletScreen({ onNext }: { onNext: () => void }) {
  return (
    <Screen>
      <Chapter index="06" label="The cord" />
      <div className="flex flex-1 items-center justify-center">
        <img
          src={bracelet}
          alt="Gold cord bracelet from the seed package"
          width={447}
          height={441}
          loading="lazy"
          className="h-[34vh] max-h-[260px] w-auto object-contain"
          style={{ animation: `drift 7s ease-in-out infinite` }}
        />
      </div>
      <h2 className="text-[3.2rem] font-medium leading-[.92] tracking-[-.03em]" style={{ fontFamily: DISPLAY }}>
        Take the connection<br />with you.
      </h2>
      <p className="mt-5 max-w-[22rem] text-[18px] leading-[1.45]" style={{ color: `${INK}cc` }}>
        The gold cord wrapped around your seed package is yours to wear — a quiet reminder of tonight and of the
        futures Changing Futures is helping to grow.
      </p>
      <div className="mt-auto pt-9">
        <Cta onClick={onNext} tone="gold">
          One last thing
        </Cta>
      </div>
    </Screen>
  );
}

/* 7 — Final */
function FinalScreen() {
  return (
    <Screen>
      <div className="relative flex flex-1 items-end justify-center">
        <Mountains className="absolute inset-x-0 bottom-0" />
        <img
          src={tree}
          alt="Palo Verde tree against the Sonoran Desert horizon"
          width={611}
          height={873}
          loading="lazy"
          className="relative h-[36vh] max-h-[300px] w-auto object-contain"
          style={{ transformOrigin: "bottom center", animation: `growTree 1800ms ${SPRING} both` }}
        />
      </div>
      <img
        src={changingFuturesLogo}
        alt="ASU Changing Futures"
        loading="lazy"
        className="mt-8 h-16 w-auto max-w-[200px] object-contain object-left"
      />
      <h2 className="mt-6 text-[3.1rem] font-medium leading-[.92] tracking-[-.03em]" style={{ fontFamily: DISPLAY }}>
        The seed is yours.<br />
        <span style={{ color: MAROON }}>The future is ours to change.</span>
      </h2>
      <div className="mt-auto pt-9">
        <a
          href={CF_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="flex w-full items-center justify-between rounded-full px-6 py-4 text-[11px] font-semibold uppercase tracking-[.22em] transition-transform duration-300 active:scale-[.98]"
          style={{ background: GOLD, color: INK, transitionTimingFunction: SPRING }}
        >
          Discover Changing Futures <span aria-hidden>↗</span>
        </a>
      </div>
    </Screen>
  );
}

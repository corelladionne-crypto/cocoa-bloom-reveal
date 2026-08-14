import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import cacaoTree from "@/assets/cacao-tree-gold.svg";
import { ProjectLogos } from "@/components/rooted/logos";

export const Route = createFileRoute("/grove")({
  head: () => ({
    meta: [
      { title: "COCOA / Rooted — Living Grove" },
      { name: "description", content: "A live grove of every rooted cacao tree." },
    ],
  }),
  component: GroveProjector,
});

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

function loadPlantings(): Planting[] {
  try {
    return JSON.parse(window.localStorage.getItem(STORE_KEY) || "[]") as Planting[];
  } catch {
    return [];
  }
}

function GroveProjector() {
  const [plantings, setPlantings] = useState<Planting[]>([]);
  const [ticker, setTicker] = useState(0);
  const [newIds, setNewIds] = useState<string[]>([]);

  useEffect(() => {
    setPlantings(loadPlantings());

    const onStorage = (event: StorageEvent) => {
      if (event.key === STORE_KEY) setPlantings(loadPlantings());
    };
    window.addEventListener("storage", onStorage);

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (event.data?.type !== "planting") return;
        const incoming = event.data.planting as Planting;
        setPlantings((current) => (current.some((item) => item.id === incoming.id) ? current : [...current, incoming]));

        // Let the tree first appear tiny at its planting point, then grow into the grove.
        requestAnimationFrame(() => setNewIds((current) => [...current, incoming.id]));
        window.setTimeout(() => setNewIds((current) => current.filter((id) => id !== incoming.id)), 1800);
      };
    } catch {
      // localStorage covers the same-browser/same-machine projector setup.
    }

    return () => {
      window.removeEventListener("storage", onStorage);
      channel?.close();
    };
  }, []);

  useEffect(() => {
    if (plantings.length < 2) return;
    const id = window.setInterval(() => setTicker((value) => value + 1), 2800);
    return () => window.clearInterval(id);
  }, [plantings.length]);

  const active = plantings.length ? plantings[ticker % plantings.length] : null;

  return (
    <main className="relative min-h-dvh overflow-hidden bg-plum text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(233,194,90,0.1),transparent_34%),linear-gradient(180deg,rgba(36,21,42,0.2),rgba(15,9,18,0.65))]" />

      <header className="relative z-20 flex items-start justify-between px-8 pt-7 md:px-12 md:pt-10">
        <div>
          <p className="font-sans text-[10px] uppercase tracking-[0.45em] text-gold/60">COCOA / ROOTED</p>
          <h1 className="mt-2 font-display text-5xl font-light text-gold-soft md:text-7xl">The living grove.</h1>
        </div>
        <div className="text-right">
          <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-gold/50">Trees planted</p>
          <p className="font-display text-5xl font-light leading-none text-gold md:text-7xl">{plantings.length}</p>
        </div>
      </header>

      <section className="absolute inset-x-0 bottom-24 top-40">
        <div className="absolute inset-x-0 bottom-0 h-[19%] bg-[#8B633F]/20" />
        <div className="absolute inset-x-0 bottom-[18%] h-px bg-gold/10" />
        {plantings.map((plant) => {
          const isNew = newIds.includes(plant.id);
          return (
            <img
              key={plant.id}
              src={cacaoTree}
              alt="Planted cacao tree"
              className="absolute w-[clamp(70px,10vw,170px)] origin-bottom drop-shadow-[0_0_18px_rgba(233,194,90,0.08)] transition-all duration-[1400ms] ease-spring"
              style={{
                left: `${plant.x}%`,
                top: `${plant.y}%`,
                transform: `translate(-50%, -100%) rotate(${plant.rotation}deg) scale(${isNew ? plant.scale * 0.12 : plant.scale})`,
                opacity: isNew ? 0.15 : 1,
                transformOrigin: "50% 100%",
              }}
              draggable={false}
            />
          );
        })}
      </section>

      {plantings.length === 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pb-24 text-center">
          <div>
            <img src={cacaoTree} alt="Cacao tree" className="mx-auto w-40 opacity-20" draggable={false} />
            <p className="mt-5 font-display text-2xl italic text-gold/55">The first tree is waiting to be rooted.</p>
          </div>
        </div>
      )}

      {/* Separate projector footer: logos stay left while the live thank-you ticker and count sit together in the bottom center. */}
      <footer className="absolute inset-x-0 bottom-0 z-30 flex min-h-24 items-center border-t border-gold/10 bg-plum-deep/90 px-6 py-4 backdrop-blur-xl md:px-12">
        <div className="absolute left-6 bottom-4 md:left-12">
          <ProjectLogos />
        </div>

        <div className="mx-auto flex items-center justify-center gap-4 text-center md:gap-8">
          <div className="min-w-0">
            <p className="font-sans text-[9px] uppercase tracking-[0.28em] text-gold/45">Thank you,</p>
            <span key={active?.id || "empty"} className="mt-1 block animate-soft-in truncate font-display text-2xl italic text-gold-soft md:text-3xl">
              {active?.name || "every grower"}
            </span>
          </div>
          <div className="h-10 w-px bg-gold/15" />
          <div className="text-left">
            <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-gold/45">Trees planted</p>
            <p className="mt-1 font-display text-3xl leading-none text-gold md:text-4xl">{plantings.length}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

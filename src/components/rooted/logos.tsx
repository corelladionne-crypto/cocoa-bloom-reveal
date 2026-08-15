import asuAsset from "@/assets/asu-tribal-nations.png.asset.json";
import changingFuturesAsset from "@/assets/changing-futures.webp.asset.json";

export function CadburyMark() {
  return (
    <span className="font-display text-2xl italic tracking-wide text-gold">Cadbury</span>
  );
}

export function AsuMark() {
  return (
    <span className="inline-flex rounded-lg bg-white/95 px-3 py-2 shadow-sm">
      <img
        src={asuAsset.url}
        alt="ASU Tribal Nations Policy Institute, Center for Tribal Digital Sovereignty"
        className="h-9 w-auto object-contain"
        loading="lazy"
      />
    </span>
  );
}

export function ChangingFuturesMark() {
  return (
    <span className="inline-flex rounded-lg bg-white/95 px-3 py-2 shadow-sm">
      <img
        src={changingFuturesAsset.url}
        alt="Changing Futures — From Arizona. For the world."
        className="h-12 w-auto object-contain"
        loading="lazy"
      />
    </span>
  );
}

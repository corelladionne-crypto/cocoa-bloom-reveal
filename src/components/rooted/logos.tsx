import asuAsset from "@/assets/asu-tribal-nations.png.asset.json";
import changingFuturesAsset from "@/assets/changing-futures.webp.asset.json";

export function CadburyMark() {
  return (
    <span className="font-display text-3xl font-bold italic tracking-wide text-gold">
      Cadbury
    </span>
  );
}

export function AsuMark() {
  return (
    <img
      src={asuAsset.url}
      alt="ASU Tribal Nations Policy Institute, Center for Tribal Digital Sovereignty"
      className="h-14 w-auto object-contain"
      loading="lazy"
    />
  );
}

export function ChangingFuturesMark() {
  return (
    <img
      src={changingFuturesAsset.url}
      alt="Changing Futures — From Arizona. For the world."
      className="h-16 w-auto object-contain"
      loading="lazy"
    />
  );
}

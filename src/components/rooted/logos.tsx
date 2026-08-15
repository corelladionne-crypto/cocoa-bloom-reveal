import asuAsset from "@/assets/asu-tribal-nations.png.asset.json";
import changingFuturesAsset from "@/assets/changing-futures.webp.asset.json";

const logoFilter = "brightness(0) saturate(100%) invert(83%) sepia(34%) saturate(633%) hue-rotate(5deg) brightness(101%) contrast(89%)";

export function CadburyMark() {
  return (
    <div className="relative inline-flex items-center" aria-label="Cadbury">
      <span
        className="font-serif text-[2.35rem] font-bold italic leading-none tracking-[-0.06em] text-gold"
        style={{ fontFamily: '"Bodoni 72", "Bodoni MT", Didot, serif' }}
      >
        Cadbury
      </span>
    </div>
  );
}

export function AsuMark() {
  return (
    <img
      src={asuAsset.url}
      alt="ASU Tribal Nations Policy Institute, Center for Tribal Digital Sovereignty"
      className="h-[5.5rem] w-auto max-w-[18rem] object-contain object-left"
      style={{ filter: logoFilter }}
      loading="lazy"
    />
  );
}

export function ChangingFuturesMark() {
  return (
    <img
      src={changingFuturesAsset.url}
      alt="Changing Futures — From Arizona. For the world."
      className="h-[4.75rem] w-auto max-w-[18rem] object-contain object-left"
      loading="lazy"
    />
  );
}

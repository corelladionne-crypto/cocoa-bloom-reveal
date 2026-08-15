import cadburyLogo from "@/assets/Cadbury-Logo-3.png";
import asuLogo from "@/assets/asu logo.png";
import changingFuturesLogo from "@/assets/ASU_Changing-Futures-Mark_3_RGB_Black-and-Gold_ASU_Vertical-150ppi-1-1.png-2.webp";

export function CadburyMark() {
  return (
    <img
      src={cadburyLogo}
      alt="Cadbury"
      className="h-auto w-[10rem] max-w-full object-contain"
    />
  );
}

export function AsuMark() {
  return (
    <img
      src={asuLogo}
      alt="ASU Tribal Nations Policy Institute and Center for Tribal Digital Sovereignty"
      className="h-auto w-[17rem] max-w-full object-contain object-left"
      loading="lazy"
    />
  );
}

export function ChangingFuturesMark() {
  return (
    <img
      src={changingFuturesLogo}
      alt="Changing Futures — From Arizona. For the world."
      className="h-auto w-[16rem] max-w-full object-contain object-left"
      loading="lazy"
    />
  );
}

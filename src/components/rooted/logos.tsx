import cadburyLogo from "@/assets/Cadbury-Logo-3.png";
import asuLogo from "@/assets/asu logo.png";
import changingFuturesLogo from "@/assets/ASU_Changing-Futures-Mark_3_RGB_Black-and-Gold_ASU_Vertical-150ppi-1-1.png-2.webp";

const logoClass = "block h-16 w-40 object-contain object-left";

export function CadburyMark() {
  return (
    <div className="flex w-full justify-start" aria-label="Cadbury">
      <img src={cadburyLogo} alt="Cadbury" className={logoClass} />
    </div>
  );
}

export function AsuMark() {
  return (
    <div className="flex w-full justify-start">
      <img
        src={asuLogo}
        alt="ASU Tribal Nations Policy Institute and Center for Tribal Digital Sovereignty"
        className={logoClass}
        loading="lazy"
      />
    </div>
  );
}

export function ChangingFuturesMark() {
  return (
    <div className="flex w-full justify-start">
      <img
        src={changingFuturesLogo}
        alt="Changing Futures — From Arizona. For the world."
        className={logoClass}
        loading="lazy"
      />
    </div>
  );
}

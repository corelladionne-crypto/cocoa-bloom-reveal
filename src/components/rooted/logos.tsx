import cadburyLogo from "@/assets/Cadbury-Logo-3.png";
import asuLogo from "@/assets/asu logo.png";
import changingFuturesLogo from "@/assets/ASU_Changing-Futures-Mark_3_RGB_Black-and-Gold_ASU_Vertical-150ppi-1-1.png-2.webp";

const logoWrap = "flex w-full justify-start pl-0";
const logoImage = "block h-12 w-32 object-contain object-left";

export function CadburyMark() {
  return (
    <div className={logoWrap} aria-label="Cadbury">
      <img src={cadburyLogo} alt="Cadbury" className={logoImage} />
    </div>
  );
}

export function AsuMark() {
  return (
    <div className={logoWrap}>
      <img
        src={asuLogo}
        alt="ASU Tribal Nations Policy Institute and Center for Tribal Digital Sovereignty"
        className={logoImage}
        loading="lazy"
      />
    </div>
  );
}

export function ChangingFuturesMark() {
  return (
    <div className={logoWrap}>
      <img
        src={changingFuturesLogo}
        alt="Changing Futures — From Arizona. For the world."
        className={logoImage}
        loading="lazy"
      />
    </div>
  );
}

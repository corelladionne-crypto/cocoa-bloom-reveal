const asuLogo = "https://cocoa-bloom-reveal.lovable.app/__l5e/assets-v1/1bb91014-7712-4554-b14d-7b07d2d3fe12/asu-logo.png";
import cadburyLogo from "@/assets/cadbury-logo.svg";
import cfLogo from "@/assets/changing-futures-logo.svg";

function BrandMark({ src, label }: { src: string; label: string }) {
  return (
    <div className="flex h-10 w-32 items-center justify-center">
      <img src={src} alt={label} className="max-h-full max-w-full object-contain" draggable={false} />
    </div>
  );
}

export function CadburyMark({ className = "" }: { className?: string }) {
  return <div className={className}><BrandMark src={cadburyLogo} label="Cadbury" /></div>;
}

export function AsuMark({ className = "" }: { className?: string }) {
  return <div className={className}><BrandMark src={asuLogo} label="Arizona State University" /></div>;
}

export function ChangingFuturesMark({ className = "" }: { className?: string }) {
  return <div className={className}><BrandMark src={cfLogo} label="Changing Futures" /></div>;
}

export function ProjectLogos({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <BrandMark src={cadburyLogo} label="Cadbury" />
      <BrandMark src={asuLogo} label="Arizona State University" />
      <BrandMark src={cfLogo} label="Changing Futures" />
    </div>
  );
}

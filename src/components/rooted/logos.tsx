const asuLogo = "https://cocoa-bloom-reveal.lovable.app/__l5e/assets-v1/1bb91014-7712-4554-b14d-7b07d2d3fe12/asu-logo.png";
import cadburyLogo from "@/assets/cadbury-logo.svg";
import cfLogo from "@/assets/changing-futures-logo.svg";

function BrandMark({ src, label, className }: { src: string; label: string; className: string }) {
  return <img src={src} alt={label} className={`object-contain object-left ${className}`} draggable={false} />;
}

export function CadburyMark({ className = "h-9 w-40" }: { className?: string }) {
  return <BrandMark src={cadburyLogo} label="Cadbury" className={className} />;
}

export function AsuMark({ className = "h-9 w-24" }: { className?: string }) {
  return <BrandMark src={asuLogo} label="Arizona State University" className={className} />;
}

export function ChangingFuturesMark({ className = "h-14 w-32" }: { className?: string }) {
  return <BrandMark src={cfLogo} label="Changing Futures" className={className} />;
}

export function ProjectLogos({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-end gap-4 ${className}`}>
      <CadburyMark className="h-9 w-28" />
      <AsuMark className="h-8 w-20" />
      <ChangingFuturesMark className="h-10 w-24" />
    </div>
  );
}

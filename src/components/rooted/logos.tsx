const asuLogo =
  "https://cocoa-bloom-reveal.lovable.app/__l5e/assets-v1/1bb91014-7712-4554-b14d-7b07d2d3fe12/asu-logo.png";

import cadburyLogo from "@/assets/cadbury-logo.svg";
import cfLogo from "@/assets/changing-futures-logo.svg";

function BrandMark({
  src,
  label,
  className = "",
}: {
  src: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src={src}
        alt={label}
        className="max-h-full max-w-full object-contain"
        draggable={false}
      />
    </div>
  );
}

export function CadburyMark({
  className = "",
}: {
  className?: string;
}) {
  return (
    <BrandMark
      src={cadburyLogo}
      label="Cadbury"
      className={className}
    />
  );
}

export function AsuMark({
  className = "",
}: {
  className?: string;
}) {
  return (
    <BrandMark
      src={asuLogo}
      label="Arizona State University"
      className={className}
    />
  );
}

export function ChangingFuturesMark({
  className = "",
}: {
  className?: string;
}) {
  return (
    <BrandMark
      src={cfLogo}
      label="Changing Futures"
      className={className}
    />
  );
}

export function ProjectLogos({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <BrandMark
        src={cadburyLogo}
        label="Cadbury"
        className="h-10 w-32"
      />

      <BrandMark
        src={asuLogo}
        label="Arizona State University"
        className="h-10 w-28"
      />

      <BrandMark
        src={cfLogo}
        label="Changing Futures"
        className="h-10 w-32"
      />
    </div>
  );
}

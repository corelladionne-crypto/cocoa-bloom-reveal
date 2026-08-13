import asuLogo from "@/assets/asu-logo.png.asset.json";
import cadburyLogo from "@/assets/cadbury-logo.png.asset.json";
import cfLogo from "@/assets/changing-futures-logo.png.asset.json";

/**
 * Brand logos are solid black artwork on transparent PNGs, so they are painted
 * as gold via CSS masking rather than tinted with filters.
 */
function GoldLogo({
  url,
  label,
  className,
}: {
  url: string;
  label: string;
  className: string;
}) {
  return (
    <span
      role="img"
      aria-label={label}
      className={`block bg-gold ${className}`}
      style={{
        WebkitMaskImage: `url(${url})`,
        maskImage: `url(${url})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "left center",
        maskPosition: "left center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}

export function CadburyMark({ className = "h-9 w-40" }: { className?: string }) {
  return <GoldLogo url={cadburyLogo.url} label="Cadbury" className={className} />;
}

export function AsuMark({ className = "h-9 w-24" }: { className?: string }) {
  return <GoldLogo url={asuLogo.url} label="Arizona State University" className={className} />;
}

export function ChangingFuturesMark({ className = "h-14 w-32" }: { className?: string }) {
  return <GoldLogo url={cfLogo.url} label="Changing Futures" className={className} />;
}

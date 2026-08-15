export function CadburyMark() {
  return (
    <span className="font-display text-2xl italic tracking-wide text-gold">Cadbury</span>
  );
}

export function AsuMark() {
  return (
    <span className="flex items-center gap-2">
      <span className="grid size-7 place-items-center rounded-full border border-gold/70 font-sans text-[10px] font-semibold tracking-widest text-gold">
        ASU
      </span>
      <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/80">
        Arizona State
      </span>
    </span>
  );
}

export function ChangingFuturesMark() {
  return (
    <span className="flex items-center gap-2">
      <svg viewBox="0 0 24 24" className="size-5 text-gold" fill="none" aria-hidden>
        <path
          d="M12 21V9m0 0c0-3 2-5 5-5 0 3-2 5-5 5Zm0 3c0-3-2-5-5-5 0 3 2 5 5 5Z"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/80">
        Changing Futures
      </span>
    </span>
  );
}

'use client';

/**
 * Visible coastal horizon — inspired by react-bits Silk/Aurora,
 * pure CSS (no mouse drag, no canvas weight).
 */
export function CoastalHorizon({ className = '' }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-b from-sky-950/40 via-brand-navy/20 to-sky-900/50" />
      <div className="absolute -left-1/4 top-[8%] h-[55%] w-[70%] rounded-full bg-sky-400/12 blur-[90px] animate-coast-glow" />
      <div className="absolute -right-1/4 bottom-[15%] h-[45%] w-[60%] rounded-full bg-cyan-300/10 blur-[80px] animate-coast-glow-delayed" />

      {/* Visible wave bands */}
      <div className="absolute bottom-0 left-0 right-0 h-[38%] opacity-40">
        <div className="coast-wave coast-wave-1" />
        <div className="coast-wave coast-wave-2" />
        <div className="coast-wave coast-wave-3" />
      </div>

      <div className="absolute inset-x-0 bottom-[22%] h-px bg-gradient-to-r from-transparent via-sky-300/35 to-transparent" />
    </div>
  );
}

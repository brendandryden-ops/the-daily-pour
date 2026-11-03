"use client";

import { useReservation } from "@/components/ReserveProvider";

/** 12-lobe scallop: radius alternates between outer and inner points. */
const SCALLOP = (() => {
  const lobes = 12;
  const outer = 50;
  const inner = 44;
  const points: string[] = [];
  for (let i = 0; i < lobes; i++) {
    const a = (i / lobes) * Math.PI * 2;
    const mid = ((i + 0.5) / lobes) * Math.PI * 2;
    const next = ((i + 1) / lobes) * Math.PI * 2;
    const p = (r: number, t: number) => `${(50 + r * Math.cos(t)).toFixed(2)} ${(50 + r * Math.sin(t)).toFixed(2)}`;
    if (i === 0) points.push(`M${p(inner, a)}`);
    points.push(`Q${p(outer + 6, mid)} ${p(inner, next)}`);
  }
  return `${points.join(" ")}Z`;
})();

/**
 * The page's loudest call to action: a wavy roast-red badge that opens the
 * reservation dialog. At most one per page.
 */
export function ReserveSticker({ className = "" }: { className?: string }) {
  const { openReservation } = useReservation();
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={() => openReservation()}
      className={`group relative grid size-32 -rotate-[10deg] place-items-center rounded-full transition-transform duration-[220ms] ease-pour hover:scale-[1.04] hover:-rotate-[4deg] motion-reduce:hover:-rotate-[10deg] motion-reduce:hover:scale-100 md:size-40 ${className}`}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full fill-hot" aria-hidden>
        <path d={SCALLOP} />
      </svg>
      <span className="relative font-display text-heading leading-[0.9] text-foam md:text-section md:leading-[0.9]">
        Reserve
        <br />a table
      </span>
    </button>
  );
}

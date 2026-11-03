import Link from "next/link";
import { ReserveButton } from "@/components/ReserveButton";
import { BeanGlyph } from "@/components/ui/BeanGlyph";
import { HOURS_SUMMARY } from "@/lib/hours";

/** Seeded so server and client render the same scatter. */
const TUMBLING_BEANS = [
  { left: "8%", top: "-14px", size: "size-7", rotate: -24 },
  { left: "21%", top: "6px", size: "size-5", rotate: 40 },
  { left: "37%", top: "-10px", size: "size-9", rotate: 12 },
  { left: "58%", top: "10px", size: "size-6", rotate: -50 },
  { left: "71%", top: "-16px", size: "size-8", rotate: 68 },
  { left: "88%", top: "2px", size: "size-5", rotate: -8 },
];

/** Closing green band: a big invitation to pull up a chair, then the shop details. */
export function SiteFooter() {
  return (
    <footer className="relative mt-auto bg-brand text-ink-on-brand">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0">
        {TUMBLING_BEANS.map((bean, i) => (
          <span
            key={i}
            className="absolute text-highlight"
            style={{ left: bean.left, top: bean.top, rotate: `${bean.rotate}deg` }}
          >
            <BeanGlyph className={bean.size} />
          </span>
        ))}
      </div>

      <div className="mx-auto flex max-w-[78rem] flex-col items-center gap-8 px-5 pt-24 pb-16 text-center md:px-10 md:pt-32 lg:px-16">
        <h2 className="font-display text-feature text-highlight md:text-pour-xl">Pull up a chair</h2>
        <ReserveButton variant="on-brand" size="lg" />
        <p className="text-small">{HOURS_SUMMARY.join(" · ")}</p>
      </div>

      <div className="mx-auto flex max-w-[78rem] flex-col gap-3 border-t border-ink-on-brand/20 px-5 py-8 text-small text-ink-on-brand/80 md:flex-row md:items-center md:justify-between md:px-10 lg:px-16">
        <address className="not-italic">
          The Daily Pour · 112 Marlowe Street, Brooklyn, NY 11216 · (718) 555-0142
        </address>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <Link href="/menu" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-highlight">
              Menu
            </Link>
          </li>
          <li>
            <Link href="/about" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-highlight">
              About us
            </Link>
          </li>
          <li>
            <a href="https://www.pexels.com" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-highlight">
              Photos from Pexels
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

"use client";

import { Fragment, useState } from "react";
import { BeanGlyph } from "@/components/ui/BeanGlyph";

function Track({ items }: { items: string[] }) {
  // Rendered twice so translateX(-50%) loops without a seam.
  return (
    <>
      {[0, 1].map((copy) => (
        <div key={copy} className="flex shrink-0 items-center gap-6 pr-6 md:gap-8 md:pr-8">
          {items.map((item, i) => (
            <Fragment key={item}>
              <span className="whitespace-nowrap font-display text-title md:text-heading">{item}</span>
              {i % 3 === 2 ? (
                <span className="grid size-9 place-items-center rounded-full bg-foam text-highlight">
                  <BeanGlyph className="size-5" />
                </span>
              ) : (
                <span className="font-display text-heading text-highlight">✱</span>
              )}
            </Fragment>
          ))}
        </div>
      ))}
    </>
  );
}

/** The tilted, slowly scrolling green band of drink names. Once per page at most. */
export function PourRibbon({ items }: { items: string[] }) {
  const [paused, setPaused] = useState(false);
  const playState = paused ? "paused" : undefined;

  return (
    <div className="group relative overflow-hidden py-14 md:py-20">
      {/* Second band, behind */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-1/2 -mx-[5%] flex h-16 -translate-y-1/2 rotate-[3deg] items-center overflow-hidden bg-roastery-deep text-ink-on-brand opacity-85 md:h-20"
      >
        <div
          className="flex w-max animate-ribbon-reverse group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused]"
          style={{ animationPlayState: playState }}
        >
          <Track items={[...items].reverse()} />
        </div>
      </div>

      <div className="relative -mx-[5%] -rotate-[4deg] overflow-hidden bg-brand text-ink-on-brand shadow-ribbon">
        <div className="flex h-16 items-center md:h-20">
          <div
            aria-hidden
            className="flex w-max animate-ribbon group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused]"
            style={{ animationPlayState: playState }}
          >
            <Track items={items} />
          </div>
        </div>
        <button
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
          className="absolute top-1/2 right-[6%] grid size-11 -translate-y-1/2 place-items-center rounded-full bg-highlight text-espresso"
        >
          {paused ? <PlayIcon /> : <PauseIcon />}
          <span className="sr-only">{paused ? "Play ribbon" : "Pause ribbon"}</span>
        </button>
      </div>
    </div>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
      <rect x="6.5" y="5" width="4" height="14" rx="1.5" />
      <rect x="13.5" y="5" width="4" height="14" rx="1.5" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
      <path d="M8 5.5v13a1 1 0 0 0 1.5.9l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}

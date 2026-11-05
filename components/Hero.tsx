import Image from "next/image";
import { Container } from "@/components/PageFrame";
import { Button } from "@/components/ui/Button";
import { ReserveSticker } from "@/components/ui/ReserveSticker";
import { photos } from "@/lib/images";

/**
 * Fixed positions so the scatter is identical on server and client.
 * Back beans sit behind the cup; front beans are closer, so they're bigger and blurrier.
 */
const BACK_BEANS = [
  { left: "3%", top: "8%", size: 2.2, blur: 0, rotate: 20 },
  { left: "40%", top: "3%", size: 1.6, blur: 0, rotate: -35 },
  { left: "88%", top: "4%", size: 2.6, blur: 0.5, rotate: -10 },
  { left: "64%", top: "36%", size: 1.4, blur: 0, rotate: 70 },
  { left: "78%", top: "58%", size: 2, blur: 0, rotate: 140 },
  { left: "24%", top: "44%", size: 1.5, blur: 0, rotate: -60 },
  { left: "94%", top: "74%", size: 1.8, blur: 0.5, rotate: 100 },
  { left: "32%", top: "88%", size: 1.3, blur: 0, rotate: 12 },
];

const FRONT_BEANS = [
  { left: "-2%", top: "30%", size: 3.6, blur: 3, rotate: 40 },
  { left: "60%", top: "78%", size: 3.2, blur: 2, rotate: -25 },
  { left: "92%", top: "40%", size: 4.2, blur: 4, rotate: 120 },
  { left: "70%", top: "72%", size: 1.6, blur: 0, rotate: -80 },
  { left: "70%", top: "18%", size: 1.4, blur: 0, rotate: 15 },
];

/** Shared gradients for every bean on the page; ids are document-global. */
function BeanDefs() {
  return (
    <svg aria-hidden className="absolute size-0">
      <defs>
        <radialGradient id="dp-bean-body" cx="0.36" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#9a5730" />
          <stop offset="0.55" stopColor="#5c2b13" />
          <stop offset="1" stopColor="#240d05" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/** A shaded, roasted bean: body, crease and a soft highlight. */
function Bean3D() {
  return (
    <svg viewBox="0 0 40 52" className="size-full" aria-hidden focusable="false">
      <ellipse cx="20" cy="26" rx="16" ry="22" fill="url(#dp-bean-body)" />
      <path d="M21 5c-8 11 7 22-1 42" fill="none" stroke="#1a0803" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M23 6c-7 11 7 22 0 40" fill="none" stroke="#e8b48a" strokeOpacity="0.35" strokeWidth="1" strokeLinecap="round" />
      <ellipse cx="12.5" cy="15" rx="3.5" ry="6.5" fill="#fff" fillOpacity="0.18" transform="rotate(20 12.5 15)" />
    </svg>
  );
}

function BeanScatter({ beans, className = "" }: { beans: typeof BACK_BEANS; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      {beans.map((bean, i) => (
        <span
          key={i}
          className="absolute block drop-shadow-[0_6px_6px_rgb(62_26_13/0.3)]"
          style={{
            left: bean.left,
            top: bean.top,
            width: `${bean.size}rem`,
            height: `${bean.size * 1.3}rem`,
            rotate: `${bean.rotate}deg`,
            filter: bean.blur ? `blur(${bean.blur}px)` : undefined,
          }}
        >
          <Bean3D />
        </span>
      ))}
    </div>
  );
}

/** The long caramel swoosh behind the cup. Stretches with the hero; the stroke doesn't. */
function Swoosh() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 size-full max-md:hidden"
    >
      <defs>
        <linearGradient id="dp-swoosh" x1="0" x2="1">
          <stop offset="0" stopColor="#a88660" stopOpacity="0" />
          <stop offset="0.25" stopColor="#c99a6b" />
          <stop offset="0.7" stopColor="#a8683c" />
          <stop offset="1" stopColor="#a88660" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path
        d="M-20 560C150 620 300 540 390 400S560 120 700 220 900 560 1020 440"
        fill="none"
        stroke="url(#dp-swoosh)"
        strokeWidth="5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function Hero() {
  return (
    <Container as="section" className="relative isolate pt-6 pb-16 md:pt-10 md:pb-20 lg:pb-24">
      <BeanDefs />
      <Swoosh />
      {/* Below lg the copy stacks under the headline, so drop the beans that would land on it. */}
      <BeanScatter
        beans={BACK_BEANS}
        className="-z-10 max-md:[&>span:nth-child(2)]:hidden max-md:[&>span:nth-child(8)]:hidden max-lg:[&>span:nth-child(6)]:hidden"
      />

      <div className="relative grid grid-cols-4 gap-x-6 md:grid-cols-8 lg:grid-cols-12">
        <h1 className="col-span-full row-start-1 font-display text-hero text-ink">
          <span className="block">Your usual,</span> <span className="block">poured</span>{" "}
          <span className="block">properly.</span>
        </h1>

        <div className="relative z-10 col-span-4 -mt-[0.6em] w-[min(84vw,22rem)] justify-self-center text-hero md:col-[4/9] md:-mt-[1.2em] md:w-full md:max-w-[26rem] md:justify-self-end lg:col-[6/11] lg:row-[1/3] lg:mt-[1.1em] lg:w-[130%] lg:max-w-none lg:justify-self-start">
          <div className="relative aspect-[4/3] w-full drop-shadow-cup">
            <Image
              src={photos.hero.src}
              alt={photos.hero.alt}
              fill
              priority
              sizes="(min-width: 1024px) 44vw, (min-width: 768px) 26rem, 84vw"
              className="object-contain"
            />
          </div>
          <ReserveSticker className="absolute bottom-[10%] -left-3 z-20 md:bottom-[14%] md:-left-12 lg:bottom-[14%] lg:left-[14%]" />
        </div>

        <div className="col-span-4 mt-4 flex flex-col items-start gap-4 md:col-[1/4] md:row-start-2 md:mt-0 md:self-center lg:col-[1/5] lg:self-start lg:pt-24">
          <h2 className="text-title font-bold text-ink">Roasted on Tuesdays</h2>
          <p className="max-w-[34ch] text-lede text-ink-muted">
            Specialty coffee, fresh pastries and light lunches on a quiet Brooklyn corner. Open mic on
            Fridays, tastings on Saturday mornings.
          </p>
          <Button href="/menu" variant="secondary" className="mt-2">
            See the full menu
          </Button>
        </div>
      </div>

      <BeanScatter beans={FRONT_BEANS} className="z-20 max-md:[&>span:nth-child(-n+3)]:hidden" />
    </Container>
  );
}

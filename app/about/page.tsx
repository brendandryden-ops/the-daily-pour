import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/PageFrame";
import { ReserveButton } from "@/components/ReserveButton";
import { photos } from "@/lib/images";

export const metadata: Metadata = {
  title: "About us",
  description:
    "How Rosa Delgado and Sam Okafor turned an old Brooklyn hardware store into The Daily Pour.",
};

function Photo({
  photo,
  className = "",
  sizes,
  priority = false,
}: {
  photo: { src: string; alt: string };
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden rounded-panel ${className}`}>
      <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}

export default function AboutPage() {
  return (
    <Container className="flex flex-col gap-16 pt-6 pb-16 md:gap-24 md:pt-10 md:pb-24">
      <header className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-x-6">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <h1 className="font-display text-feature text-ink md:text-pour-xl">
            Two friends,
            <br />
            one corner.
          </h1>
          <p className="max-w-[52ch] text-lede text-ink-muted">
            The Daily Pour started with a borrowed espresso machine, a lease on an old hardware store and a
            promise to know every regular by name.
          </p>
        </div>
        <Photo
          photo={photos.about.room}
          priority
          sizes="(min-width:1024px) 40vw, 90vw"
          className="aspect-[4/5] lg:col-span-5"
        />
      </header>

      <article className="mx-auto flex w-full max-w-[62ch] flex-col gap-6 text-body text-ink">
        <h2 className="text-heading font-bold">How it started</h2>
        <p>
          Rosa Delgado grew up in Sunset Park, above her aunt&rsquo;s bakery, and spent ten years cooking on
          the line in Manhattan restaurants. Sam Okafor learned to roast coffee in Melbourne, then came home to
          Brooklyn with a suitcase of green beans and nowhere to roast them.
        </p>
        <p>
          They met in 2015 in a shared commercial kitchen in Gowanus, where Sam rented the roaster on Tuesdays
          and Rosa baked croissants for a farmers&rsquo; market stall. Sam kept bringing over cups of whatever
          he&rsquo;d roasted that morning. Rosa kept telling him exactly what was wrong with them. It was the
          start of a very good partnership.
        </p>

        <h2 className="pt-4 text-heading font-bold">The hardware store</h2>
        <p>
          In 2017 the old Marlowe Street hardware store came up for rent. Its owner, Mr. Feld, had run it for
          41 years and wanted it to go to &ldquo;someone who&rsquo;ll keep the lights on early.&rdquo; Rosa and
          Sam spent a winter sanding floors, and kept the original wooden drawers and shelving. The drawers
          still have the old labels. Ask for a cinnamon bun and you might get it from the one marked
          &ldquo;hinges.&rdquo;
        </p>
        <p>
          They opened on a Monday in March with six things on the menu. By Friday, the man from the laundromat
          next door had a usual.
        </p>
      </article>

      <div className="grid gap-6 md:grid-cols-2">
        <Photo photo={photos.about.counter} sizes="(min-width:768px) 45vw, 90vw" className="aspect-[4/3]" />
        <Photo photo={photos.about.table} sizes="(min-width:768px) 45vw, 90vw" className="aspect-[4/3]" />
      </div>

      <article className="mx-auto flex w-full max-w-[62ch] flex-col gap-6 text-body text-ink">
        <h2 className="text-heading font-bold">Fridays and Saturdays</h2>
        <p>
          The open mic wasn&rsquo;t our idea. One Friday in 2018, a regular named Dee brought her guitar and
          asked if she could play a couple of songs before close. The next week three people asked. Now
          it&rsquo;s every Friday from 7pm, with a sign-up sheet at the counter and a crowd that cheers for
          everyone.
        </p>
        <p>
          The Saturday tastings grew out of Sam&rsquo;s habit of explaining coffee to anyone who stood still
          long enough. Rosa suggested he do it on purpose, with chairs. Each week he sets out three coffees
          side by side and helps you taste the difference. No jargon, plenty of refills.
        </p>

        <h2 className="pt-4 text-heading font-bold">Still here, still early</h2>
        <p>
          Sam still roasts on Tuesdays. Rosa still bakes from 6am, and the pastry case is still empty by
          lunch. We&rsquo;ve added a few things along the way: soup, sandwiches, a matcha latte Rosa swore
          she&rsquo;d never make. But the idea hasn&rsquo;t changed. Good coffee, made properly, for the people
          who live around the corner.
        </p>
      </article>

      <figure className="mx-auto flex w-full max-w-[52ch] flex-col items-start gap-6 border-l-4 border-brand pl-6 md:pl-10">
        <blockquote className="font-display text-section text-ink">
          &ldquo;We wanted a place where you could sit for an hour and nobody would rush you.&rdquo;
        </blockquote>
        <figcaption className="text-small text-ink-muted">Rosa Delgado, co-founder</figcaption>
        <ReserveButton />
      </figure>
    </Container>
  );
}

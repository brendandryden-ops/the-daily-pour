import Image from "next/image";
import { Price } from "@/components/ui/Price";
import { menuPhotos } from "@/lib/images";
import type { MenuItem } from "@/lib/menu";

/** Plate colours rotate through in order. */
const PLATES = ["bg-crema", "bg-roast/85", "bg-roastery", "bg-latte"];

const ALLERGEN_LABELS: Record<string, string> = { soya: "soy" };

function metaLine(item: MenuItem) {
  const parts: string[] = [];
  if (item.dietary) parts.push(item.dietary[0].toUpperCase() + item.dietary.slice(1));
  if (item.allergens.length) {
    parts.push(`Contains ${item.allergens.map((a) => ALLERGEN_LABELS[a] ?? a).join(", ")}`);
  }
  return parts.join(" · ");
}

/** A menu item on a round plate. Not a link: there are no item pages. */
export function DrinkCard({ item, index }: { item: MenuItem; index: number }) {
  const photo = menuPhotos[item.slug];
  const meta = metaLine(item);

  return (
    <article className="grid grid-cols-[auto_1fr] items-start gap-5">
      <div className={`size-28 shrink-0 rounded-full p-1.5 md:size-32 ${PLATES[index % PLATES.length]}`}>
        <div className="relative size-full overflow-hidden rounded-full">
          {photo ? (
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="128px"
              className={`object-cover ${item.available ? "" : "grayscale opacity-60"}`}
            />
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-1.5 pt-2">
        <h3 className="text-title font-bold text-ink">{item.name}</h3>
        {item.available ? (
          <Price cents={item.priceCents} />
        ) : (
          <p className="text-small text-ink-muted">Back tomorrow</p>
        )}
        <p className="text-small text-ink-muted">{item.description}</p>
        {meta ? <p className="text-fine text-ink-muted">{meta}</p> : null}
      </div>
    </article>
  );
}

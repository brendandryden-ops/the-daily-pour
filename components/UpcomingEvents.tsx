import Image from "next/image";
import { cacheLife } from "next/cache";
import { ReserveButton } from "@/components/ReserveButton";
import { getUpcomingEvents, type ShopEvent } from "@/lib/events";
import { formatDate, formatTime, slotValue } from "@/lib/hours";
import { photos } from "@/lib/images";

const TILTS = [-6, 4, -3, 7];

function EventCard({ event, index }: { event: ShopEvent; index: number }) {
  const photo = photos.events[event.kind];
  return (
    <article className="flex flex-col gap-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-panel">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(min-width:1024px) 22vw, (min-width:640px) 45vw, 90vw"
          className="object-cover"
        />
        <span
          className="absolute top-3 left-3 inline-flex min-h-11 items-center rounded-full border-2 border-line bg-raised px-5 font-display text-body text-ink"
          style={{ rotate: `${TILTS[index % TILTS.length]}deg` }}
        >
          <time dateTime={event.date}>
            {formatDate(event.date, { weekday: "short", month: "short", day: "numeric" })}
          </time>
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-title font-bold text-ink">{event.title}</h3>
        <p className="text-small font-medium text-ink">
          {formatDate(event.date)}, {formatTime(event.start)}–{formatTime(event.end)}
        </p>
        <p className="text-small text-ink-muted">{event.blurb}</p>
        <p className="text-small text-ink-muted">{event.note}</p>
      </div>
      {event.kind === "tasting" ? (
        <ReserveButton
          variant="secondary"
          size="sm"
          className="self-start"
          prefill={{ date: event.date, time: slotValue(event.start) }}
        >
          Reserve a table
        </ReserveButton>
      ) : null}
    </article>
  );
}

/** The next few Fridays and Saturdays. Recomputed every hour or so. */
export async function UpcomingEvents() {
  "use cache";
  cacheLife("hours");

  const events = getUpcomingEvents(4);
  return (
    <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {events.map((event, i) => (
        <EventCard key={event.id} event={event} index={i} />
      ))}
    </div>
  );
}

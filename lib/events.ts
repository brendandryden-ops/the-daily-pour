import { addDays, shopNow, weekday } from "@/lib/hours";

export type EventKind = "open-mic" | "tasting";

export type ShopEvent = {
  id: string;
  kind: EventKind;
  title: string;
  /** YYYY-MM-DD, shop time */
  date: string;
  /** Minutes after midnight */
  start: number;
  end: number;
  blurb: string;
  note: string;
};

const RECURRING: Record<number, Omit<ShopEvent, "id" | "date">> = {
  5: {
    kind: "open-mic",
    title: "Open mic night",
    start: 19 * 60,
    end: 22 * 60,
    blurb:
      "Songs, poems and the occasional stand-up set from the neighbourhood. Ten minutes each, and the crowd is always kind.",
    note: "Sign-up sheet at the counter from 6:30pm",
  },
  6: {
    kind: "tasting",
    title: "Saturday coffee tasting",
    start: 10 * 60,
    end: 11 * 60 + 30,
    blurb:
      "Sam sets out three coffees side by side and walks you through how to taste them. No jargon, plenty of refills.",
    note: "$15 a seat, 12 seats",
  },
};

/** The next `count` events from now, skipping any that have already finished today. */
export function getUpcomingEvents(count = 4, now = shopNow()): ShopEvent[] {
  const events: ShopEvent[] = [];
  for (let offset = 0; events.length < count && offset < 28; offset++) {
    const date = addDays(now.date, offset);
    const event = RECURRING[weekday(date)];
    if (!event) continue;
    if (offset === 0 && now.minutes >= event.end) continue;
    events.push({ ...event, id: `${event.kind}-${date}`, date });
  }
  return events;
}

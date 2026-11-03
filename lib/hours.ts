/**
 * Opening hours and reservation slots. Shared by the reservation form (client)
 * and its server action, so both agree on what's bookable.
 * Times are minutes after midnight, shop time (America/New_York).
 */
export const TIME_ZONE = "America/New_York";
export const MAX_PARTY = 8;
export const BOOKING_WINDOW_DAYS = 60;

/** Opening hours by weekday, 0 = Sunday. Fridays run late for open mic. */
const HOURS: Record<number, { open: number; close: number }> = {
  0: { open: 8 * 60, close: 15 * 60 },
  1: { open: 7 * 60, close: 16 * 60 },
  2: { open: 7 * 60, close: 16 * 60 },
  3: { open: 7 * 60, close: 16 * 60 },
  4: { open: 7 * 60, close: 16 * 60 },
  5: { open: 7 * 60, close: 22 * 60 },
  6: { open: 7 * 60, close: 16 * 60 },
};

/** Last table we book is an hour before closing. */
const LAST_BOOKING_BEFORE_CLOSE = 60;
const SLOT_LENGTH = 30;

/** Today's date (YYYY-MM-DD) and the current time in minutes, in shop time. */
export function shopNow(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((part) => [part.type, part.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function toUtcNoon(isoDate: string) {
  return new Date(`${isoDate}T12:00:00Z`);
}

export function isIsoDate(value: string) {
  return ISO_DATE.test(value) && !Number.isNaN(toUtcNoon(value).getTime());
}

export function addDays(isoDate: string, days: number) {
  const date = toUtcNoon(isoDate);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function weekday(isoDate: string) {
  return toUtcNoon(isoDate).getUTCDay();
}

/** "Saturday, November 7" */
export function formatDate(
  isoDate: string,
  options: Intl.DateTimeFormatOptions = { weekday: "long", month: "long", day: "numeric" },
) {
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(toUtcNoon(isoDate));
}

/** 600 → "10am", 690 → "11:30am" */
export function formatTime(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const suffix = hour < 12 ? "am" : "pm";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return minute === 0 ? `${hour12}${suffix}` : `${hour12}:${String(minute).padStart(2, "0")}${suffix}`;
}

/** "14:30" ↔ 870 */
export function slotValue(minutes: number) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

export function parseSlot(value: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
}

/** Bookable start times for a date, in minutes. Defaults to a regular weekday. */
export function bookingSlots(isoDate?: string) {
  const day = isoDate && isIsoDate(isoDate) ? weekday(isoDate) : 1;
  const { open, close } = HOURS[day];
  const slots: number[] = [];
  for (let t = open; t <= close - LAST_BOOKING_BEFORE_CLOSE; t += SLOT_LENGTH) slots.push(t);
  return slots;
}

export const HOURS_SUMMARY = [
  "Monday to Saturday, 7am–4pm",
  "Fridays until 10pm for open mic",
  "Sunday, 8am–3pm",
];

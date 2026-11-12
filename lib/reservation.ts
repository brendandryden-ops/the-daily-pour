import {
  BOOKING_WINDOW_DAYS,
  MAX_PARTY,
  addDays,
  bookingSlots,
  formatDate,
  formatTime,
  isIsoDate,
  parseSlot,
  shopNow,
} from "@/lib/hours";

export type ReserveField = "name" | "partySize" | "date" | "time";

export type ReserveValues = Record<ReserveField, string>;

export type ReserveState = {
  status: "idle" | "error" | "success";
  values: ReserveValues;
  errors: Partial<Record<ReserveField, string>>;
  message?: string;
};

export type ValidReservation = {
  name: string;
  partySize: number;
  /** YYYY-MM-DD, shop time */
  date: string;
  /** Minutes after midnight, shop time */
  minutes: number;
};

/**
 * Checks a booking request against the shop's hours and limits. Runs on the
 * server in app/api/reservations/route.ts; never trust the browser's copy.
 */
export function validateReservation(
  values: ReserveValues,
): { ok: true; booking: ValidReservation } | { ok: false; errors: ReserveState["errors"] } {
  const errors: ReserveState["errors"] = {};
  const now = shopNow();
  const name = values.name.trim();

  if (!name) errors.name = "Tell us a name for the booking.";
  else if (name.length > 80) errors.name = "Keep the name under 80 characters.";

  const party = Number(values.partySize);
  if (!values.partySize || !Number.isInteger(party) || party < 1) errors.partySize = "Choose how many people are coming.";
  else if (party > MAX_PARTY) errors.partySize = `For more than ${MAX_PARTY}, call the shop.`;

  if (!values.date) errors.date = "Pick a date.";
  else if (!isIsoDate(values.date)) errors.date = "Pick a date from the calendar.";
  else if (values.date < now.date) errors.date = "Pick a date from today onwards.";
  else if (values.date > addDays(now.date, BOOKING_WINDOW_DAYS))
    errors.date = `We take bookings up to ${BOOKING_WINDOW_DAYS} days ahead.`;

  const minutes = parseSlot(values.time);
  if (!values.time || minutes === null) {
    errors.time = "Pick a time.";
  } else if (!errors.date) {
    const slots = bookingSlots(values.date);
    if (!slots.includes(minutes)) {
      errors.time = `Pick a time between ${formatTime(slots[0])} and ${formatTime(slots.at(-1)!)}.`;
    } else if (values.date === now.date && minutes <= now.minutes) {
      errors.time = "That time has passed. Pick a later one.";
    }
  }

  if (Object.keys(errors).length > 0 || minutes === null) return { ok: false, errors };
  return { ok: true, booking: { name, partySize: party, date: values.date, minutes } };
}

export function confirmationMessage(booking: ValidReservation) {
  const firstName = booking.name.split(/\s+/)[0];
  return `Table reserved for ${booking.partySize}, ${formatDate(booking.date)} at ${formatTime(booking.minutes)}. See you then, ${firstName}.`;
}

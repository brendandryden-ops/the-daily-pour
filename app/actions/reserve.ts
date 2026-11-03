"use server";

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

export type ReserveState = {
  status: "idle" | "error" | "success";
  values: Record<ReserveField, string>;
  errors: Partial<Record<ReserveField, string>>;
  message?: string;
};

/**
 * Checks a table reservation. Nothing is stored or sent yet: a valid booking
 * just comes back confirmed. Wire it to email or a database here when ready.
 */
export async function reserveTable(_prev: ReserveState, formData: FormData): Promise<ReserveState> {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    partySize: String(formData.get("partySize") ?? ""),
    date: String(formData.get("date") ?? ""),
    time: String(formData.get("time") ?? ""),
  };
  const errors: ReserveState["errors"] = {};
  const now = shopNow();

  if (!values.name) errors.name = "Tell us a name for the booking.";
  else if (values.name.length > 80) errors.name = "Keep the name under 80 characters.";

  const party = Number(values.partySize);
  if (!values.partySize) errors.partySize = "Choose how many people are coming.";
  else if (!Number.isInteger(party) || party < 1) errors.partySize = "Choose how many people are coming.";
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

  if (Object.keys(errors).length > 0) {
    return { status: "error", values, errors };
  }

  const firstName = values.name.split(/\s+/)[0];
  return {
    status: "success",
    values,
    errors: {},
    message: `Table reserved for ${party}, ${formatDate(values.date)} at ${formatTime(minutes!)}. See you then, ${firstName}.`,
  };
}

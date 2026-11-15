import { TIME_ZONE } from "@/lib/hours";
import type { ValidReservation } from "@/lib/reservation";

const pad = (n: number) => String(n).padStart(2, "0");

/** The shop's UTC offset on a given day, e.g. "-05:00" (EST) or "-04:00" (EDT). */
function shopOffset(isoDate: string) {
  // Noon avoids the 2am DST switch; the shop is never open then anyway.
  const noon = new Date(`${isoDate}T12:00:00Z`);
  const name = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, timeZoneName: "longOffset" })
    .formatToParts(noon)
    .find((part) => part.type === "timeZoneName")?.value;
  const offset = name?.replace("GMT", "") ?? "";
  return offset || "+00:00";
}

/**
 * Posts a validated booking to the n8n reservation webhook. Server-only:
 * reads the URL and secret from the environment. Returns false if n8n
 * didn't accept it.
 */
export async function sendReservation(booking: ValidReservation): Promise<boolean> {
  const url = process.env.N8N_RESERVATION_WEBHOOK_URL;
  if (!url) {
    console.warn("N8N_RESERVATION_WEBHOOK_URL is not set; booking not sent.");
    return false;
  }

  const time = `${pad(Math.floor(booking.minutes / 60))}:${pad(booking.minutes % 60)}`;
  const payload = {
    guest_name: booking.name,
    group_size: booking.partySize,
    // ISO 8601 in shop time with its offset, e.g. 2026-11-14T09:30:00-05:00
    booking_time: `${booking.date}T${time}:00${shopOffset(booking.date)}`,
  };

  const secret = process.env.N8N_WEBHOOK_SECRET;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { "X-Webhook-Secret": secret } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!res.ok) console.error(`n8n reservation webhook responded ${res.status}`);
    return res.ok;
  } catch (err) {
    console.error("n8n reservation webhook failed:", err);
    return false;
  }
}

import { formatDate, formatTime } from "@/lib/hours";

export type Booking = {
  name: string;
  partySize: number;
  /** YYYY-MM-DD, shop time */
  date: string;
  /** Minutes after midnight */
  minutes: number;
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Posts a confirmed booking to the n8n Cloud webhook. Server-only: reads
 * secrets from the environment. Returns false if n8n didn't accept it.
 */
export async function sendReservation(booking: Booking): Promise<boolean> {
  const url = process.env.N8N_RESERVATION_WEBHOOK_URL;
  if (!url) {
    console.warn("N8N_RESERVATION_WEBHOOK_URL is not set; booking not sent.");
    return false;
  }

  const payload = {
    name: booking.name,
    firstName: booking.name.split(/\s+/)[0],
    partySize: booking.partySize,
    date: booking.date,
    time: `${pad(Math.floor(booking.minutes / 60))}:${pad(booking.minutes % 60)}`,
    dateLabel: formatDate(booking.date),
    timeLabel: formatTime(booking.minutes),
    submittedAt: new Date().toISOString(),
    source: "the-daily-pour-website",
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": process.env.N8N_WEBHOOK_SECRET ?? "",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!res.ok) console.error(`n8n webhook responded ${res.status}`);
    return res.ok;
  } catch (err) {
    console.error("n8n webhook failed:", err);
    return false;
  }
}

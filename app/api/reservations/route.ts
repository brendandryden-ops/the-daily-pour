import { sendReservation } from "@/lib/n8n";
import { confirmationMessage, validateReservation, type ReserveState, type ReserveValues } from "@/lib/reservation";

/**
 * Reserve-a-table endpoint for components/ReserveDialog.tsx. Validates the
 * booking, then forwards it to the n8n webhook from the server, so the
 * webhook URL and secret never reach the browser.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const field = (key: string) => {
    const value = (body as Record<string, unknown> | null)?.[key];
    return typeof value === "string" || typeof value === "number" ? String(value) : "";
  };
  const values: ReserveValues = {
    name: field("name"),
    partySize: field("partySize"),
    date: field("date"),
    time: field("time"),
  };

  const result = validateReservation(values);
  if (!result.ok) {
    return Response.json({ status: "error", values, errors: result.errors } satisfies ReserveState, { status: 422 });
  }

  const sent = await sendReservation(result.booking);
  if (!sent) {
    return Response.json(
      {
        status: "error",
        values,
        errors: {},
        message: "We couldn't save your booking just now. Please try again, or call the shop.",
      } satisfies ReserveState,
      { status: 502 },
    );
  }

  return Response.json({
    status: "success",
    values,
    errors: {},
    message: confirmationMessage(result.booking),
  } satisfies ReserveState);
}

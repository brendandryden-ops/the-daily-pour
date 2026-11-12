"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { ReservePrefill } from "@/components/ReserveProvider";
import { BeanGlyph } from "@/components/ui/BeanGlyph";
import { Button } from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/ui/TextField";
import {
  BOOKING_WINDOW_DAYS,
  MAX_PARTY,
  addDays,
  bookingSlots,
  formatTime,
  shopNow,
  slotValue,
} from "@/lib/hours";
import type { ReserveState, ReserveValues } from "@/lib/reservation";

/** Sends the form to app/api/reservations/route.ts, which calls n8n server-side. */
async function reserveTable(_prev: ReserveState, formData: FormData): Promise<ReserveState> {
  const values: ReserveValues = {
    name: String(formData.get("name") ?? ""),
    partySize: String(formData.get("partySize") ?? ""),
    date: String(formData.get("date") ?? ""),
    time: String(formData.get("time") ?? ""),
  };
  try {
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = (await res.json()) as Partial<ReserveState>;
    if (data.status === "success" || data.status === "error") {
      return { status: data.status, values, errors: data.errors ?? {}, message: data.message };
    }
  } catch {
    // Network error or a non-JSON reply; fall through to the generic message.
  }
  return {
    status: "error",
    values,
    errors: {},
    message: "We couldn't save your booking just now. Please try again, or call the shop.",
  };
}

type ReserveDialogProps = {
  prefill: ReservePrefill;
  onClose: () => void;
};

export function ReserveDialog({ prefill, onClose }: ReserveDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [today] = useState(() => shopNow().date);
  const initialState: ReserveState = {
    status: "idle",
    values: { name: "", partySize: "2", date: prefill.date ?? "", time: prefill.time ?? "" },
    errors: {},
  };
  const [state, formAction, pending] = useActionState(reserveTable, initialState);
  const [date, setDate] = useState(initialState.values.date);
  const slots = bookingSlots(date);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const { values, errors } = state;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="reserve-title"
      onClose={onClose}
      onClick={(event) => {
        // A click on the backdrop lands on the dialog element itself.
        if (event.target === dialogRef.current) dialogRef.current.close();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(100%-2rem,34rem)] overflow-y-auto rounded-panel bg-raised p-0 text-ink shadow-lift backdrop:bg-espresso/60"
    >
      <div className="flex flex-col gap-6 p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id="reserve-title" className="text-heading font-bold">
            Reserve a table
          </h2>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="-m-2 grid size-11 shrink-0 place-items-center rounded-full text-ink hover:bg-highlight-soft"
          >
            <CloseIcon />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {state.status === "success" ? (
          <div role="status" className="flex flex-col items-start gap-6">
            <BeanGlyph className="size-12 text-line" />
            <p className="text-lede">{state.message}</p>
            <p className="text-body text-ink-muted">
              We hold tables for 15 minutes. If your plans change, give the shop a call.
            </p>
            <Button onClick={() => dialogRef.current?.close()}>Done</Button>
          </div>
        ) : (
          <form action={formAction} noValidate className="flex flex-col gap-5">
            <p className="text-body text-ink-muted">
              Tell us who&rsquo;s coming and when. We&rsquo;ll have a table ready.
            </p>

            {state.status === "error" ? (
              <p role="alert" className="text-small font-medium text-hot">
                {state.message ?? "A couple of things need fixing before we can book your table."}
              </p>
            ) : null}

            <TextField
              id="reserve-name"
              name="name"
              label="Name"
              autoComplete="name"
              defaultValue={values.name}
              error={errors.name}
              required
            />

            <SelectField
              id="reserve-party"
              name="partySize"
              label="Party size"
              defaultValue={values.partySize}
              error={errors.partySize}
              helper={`For more than ${MAX_PARTY}, call the shop.`}
            >
              {Array.from({ length: MAX_PARTY }, (_, i) => i + 1).map((size) => (
                <option key={size} value={size}>
                  {size === 1 ? "1 person" : `${size} people`}
                </option>
              ))}
            </SelectField>

            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                id="reserve-date"
                name="date"
                type="date"
                label="Date"
                min={today}
                max={addDays(today, BOOKING_WINDOW_DAYS)}
                value={date}
                onChange={(event) => setDate(event.target.value)}
                error={errors.date}
                required
              />
              <SelectField
                // Remount when the day's slots change so the default re-applies.
                key={slots.join()}
                id="reserve-time"
                name="time"
                label="Time"
                defaultValue={slots.map(slotValue).includes(values.time) ? values.time : ""}
                error={errors.time}
                required
              >
                <option value="" disabled>
                  Choose a time
                </option>
                {slots.map((minutes) => (
                  <option key={minutes} value={slotValue(minutes)}>
                    {formatTime(minutes)}
                  </option>
                ))}
              </SelectField>
            </div>

            <Button
              type="submit"
              size="lg"
              aria-disabled={pending || undefined}
              aria-busy={pending || undefined}
              onClick={(event) => {
                if (pending) event.preventDefault();
              }}
              className="self-start"
            >
              {pending ? "Reserving…" : "Reserve a table"}
            </Button>
          </form>
        )}
      </div>
    </dialog>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

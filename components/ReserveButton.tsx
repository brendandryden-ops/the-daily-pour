"use client";

import type { ReactNode } from "react";
import { useReservation, type ReservePrefill } from "@/components/ReserveProvider";
import { Button, type ButtonProps } from "@/components/ui/Button";

type ReserveButtonProps = Omit<ButtonProps, "href" | "onClick" | "children"> & {
  prefill?: ReservePrefill;
  children?: ReactNode;
};

/** A Button that opens the reservation dialog. */
export function ReserveButton({ prefill, children = "Reserve a table", ...props }: ReserveButtonProps) {
  const { openReservation } = useReservation();
  return (
    <Button {...props} aria-haspopup="dialog" onClick={() => openReservation(prefill)}>
      {children}
    </Button>
  );
}

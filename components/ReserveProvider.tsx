"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ReserveDialog } from "@/components/ReserveDialog";

export type ReservePrefill = { date?: string; time?: string };

type ReserveContextValue = {
  openReservation: (prefill?: ReservePrefill) => void;
};

const ReserveContext = createContext<ReserveContextValue | null>(null);

export function useReservation() {
  const context = useContext(ReserveContext);
  if (!context) throw new Error("useReservation must be used inside <ReserveProvider>");
  return context;
}

/** Holds the one reservation dialog for the whole site. Any ReserveButton opens it. */
export function ReserveProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<{ id: number; prefill: ReservePrefill } | null>(null);

  const openReservation = useCallback((prefill: ReservePrefill = {}) => {
    setRequest((current) => ({ id: (current?.id ?? 0) + 1, prefill }));
  }, []);

  const value = useMemo(() => ({ openReservation }), [openReservation]);

  return (
    <ReserveContext.Provider value={value}>
      {children}
      {request ? (
        // A fresh key per opening resets the form and its action state.
        <ReserveDialog key={request.id} prefill={request.prefill} onClose={() => setRequest(null)} />
      ) : null}
    </ReserveContext.Provider>
  );
}

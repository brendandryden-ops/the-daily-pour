"use client";

import { useRef } from "react";
import { NavLinks } from "@/components/NavLinks";
import { ReserveButton } from "@/components/ReserveButton";

/** "Menu" text button that opens a full-height drawer on small screens. */
export function MobileNav() {
  const drawerRef = useRef<HTMLDialogElement>(null);
  const close = () => drawerRef.current?.close();

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => drawerRef.current?.showModal()}
        className="inline-flex min-h-11 items-center px-2 text-body font-bold text-ink md:hidden"
      >
        Menu
      </button>
      <dialog
        ref={drawerRef}
        aria-label="Site navigation"
        onClick={(event) => {
          if (event.target === drawerRef.current) close();
        }}
        className="my-0 mr-0 ml-auto h-dvh max-h-none w-[min(85vw,22rem)] translate-x-0 rounded-l-panel bg-raised p-0 text-ink transition-[translate,display,overlay] transition-discrete duration-[320ms] ease-swirl backdrop:bg-espresso/50 starting:open:translate-x-full md:hidden"
      >
        <div className="flex h-full flex-col gap-8 p-6">
          <button
            type="button"
            onClick={close}
            className="inline-flex min-h-11 items-center self-end px-2 text-body font-bold"
          >
            Close
          </button>
          <nav aria-label="Main">
            <NavLinks className="flex flex-col gap-2 text-heading" onNavigate={close} />
          </nav>
          <div className="mt-auto" onClick={close}>
            <ReserveButton size="lg" className="w-full" />
          </div>
        </div>
      </dialog>
    </>
  );
}

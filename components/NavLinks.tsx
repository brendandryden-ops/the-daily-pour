"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const NAV_ITEMS = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About us" },
  { href: "/#events", label: "Events" },
];

const currentClasses = "underline decoration-highlight decoration-[3px] underline-offset-8";

export function NavLinks({
  className = "",
  linkClassName = "",
  onNavigate,
}: {
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <ul className={className}>
      {NAV_ITEMS.map(({ href, label }) => {
        const current = href === pathname;
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={current ? "page" : undefined}
              className={`inline-flex min-h-11 items-center font-medium text-ink hover:underline hover:decoration-line hover:decoration-[3px] hover:underline-offset-8 ${current ? currentClasses : ""} ${linkClassName}`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

import Link from "next/link";
import { Container } from "@/components/PageFrame";
import { MobileNav } from "@/components/MobileNav";
import { NavLinks } from "@/components/NavLinks";
import { ReserveButton } from "@/components/ReserveButton";

export function SiteHeader() {
  return (
    <Container as="header" className="flex h-20 items-center justify-between gap-6">
      <Link href="/" className="inline-flex min-h-11 items-center font-display text-heading text-ink">
        The Daily Pour
      </Link>
      <nav aria-label="Main" className="hidden md:block">
        <NavLinks className="flex items-center gap-8 text-body" />
      </nav>
      <div className="hidden md:block">
        <ReserveButton size="sm" />
      </div>
      <MobileNav />
    </Container>
  );
}

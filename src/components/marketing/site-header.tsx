import Link from "next/link";
import { LinkButton } from "@/components/ui/button";

const navLinks = [
  { href: "#planos", label: "Planos" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#parceiros", label: "Parceiros" },
];

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 py-8">
      <Link href="/" className="text-heading font-medium text-off-black-ink">
        Stokys
      </Link>

      <nav className="hidden items-center gap-8 md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-body font-medium text-off-black-ink/80 transition-colors hover:text-off-black-ink"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <LinkButton href="/onboarding">Montar minha loja</LinkButton>
    </header>
  );
}

import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/ui/button";

const navLinks = [
  { href: "#planos", label: "Planos" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#parceiros", label: "Parceiros" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 bg-off-white-canvas/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center">
          <Image src="/logo-stokys.png" alt="Stokys" width={108} height={30} priority />
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

        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="hidden text-body font-medium text-off-black-ink md:block"
          >
            Entrar
          </Link>
          <LinkButton href="/onboarding">Montar minha loja</LinkButton>
        </div>
      </div>
    </header>
  );
}

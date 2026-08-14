"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LinkButton } from "@/components/ui/button";

// Header: no topo da página é uma barra cheia; ao rolar, encolhe pra uma pill
// flutuante arredondada — mesmo comportamento da perk.com. Lado direito segue
// exatamente docs de referência do usuário: globo, CTA lima, CTA contorno,
// ícone de conta, hambúrguer (abre o menu com os links).

const navLinks = [
  { href: "#planos", label: "Planos" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#parceiros", label: "Parceiros" },
  { href: "/blog", label: "Blog e dicas" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function irParaTopo(e: React.MouseEvent) {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  }

  return (
    <header className="sticky top-0 z-20 bg-hero-canvas px-6 sm:px-10 lg:px-16">
      <div
        className={`mx-auto flex w-full items-center justify-between bg-hero-canvas transition-all duration-300 ${
          scrolled ? "mt-3 max-w-[900px] rounded-full px-5 py-2" : "max-w-[1800px] px-0 py-3"
        }`}
      >
        <Link href="/" onClick={irParaTopo} className="flex items-center">
          <Image
            src="/logo-stokys.png"
            alt="Stokys"
            width={100}
            height={28}
            className="h-7 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-body-sm font-medium text-off-black-ink/80 transition-colors hover:text-off-black-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 sm:flex">
            <LinkButton href="/onboarding">Criar loja</LinkButton>
            <LinkButton href="/login" variant="outline">
              Entrar
            </LinkButton>
          </div>
          <Link
            href="/dashboard"
            aria-label="Minha conta"
            className="flex h-10 w-10 items-center justify-center rounded-full text-off-black-ink"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
              <path
                d="M4 20c1.5-3.5 4.8-5.5 8-5.5s6.5 2 8 5.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </Link>
          <button
            type="button"
            onClick={() => setMenuAberto((v) => !v)}
            aria-label="Abrir menu"
            aria-expanded={menuAberto}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1"
          >
            <span className="h-0.5 w-5 bg-off-black-ink" />
            <span className="h-0.5 w-5 bg-off-black-ink" />
          </button>
        </div>
      </div>

      {menuAberto && (
        <div className="absolute inset-x-0 top-full bg-hero-canvas px-6 pb-6 sm:px-10 lg:px-16">
          <nav className="mx-auto flex w-full max-w-[1800px] flex-col gap-1 rounded-3xl bg-pure-white p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuAberto(false)}
                className="rounded-2xl px-4 py-3 text-body font-medium text-off-black-ink hover:bg-hero-canvas"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMenuAberto(false)}
              className="rounded-2xl px-4 py-3 text-body font-medium text-off-black-ink hover:bg-hero-canvas sm:hidden"
            >
              Entrar
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/ui/button";

// Header: no topo da página é uma barra cheia; ao rolar, encolhe pra uma pill
// flutuante arredondada — mesmo comportamento da perk.com. Nav fica só no
// hambúrguer, que abre como overlay (position: absolute) sem empurrar a página.

const navLinks = [
  { href: "#planos", label: "Planos" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#parceiros", label: "Parceiros" },
  { href: "/login", label: "Entrar" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-cloud px-6 sm:px-10 lg:px-16">
      <div
        className={`mx-auto flex w-full items-center justify-between bg-cloud transition-all duration-300 ${
          scrolled ? "mt-4 max-w-[640px] rounded-full px-6 py-3" : "max-w-[1800px] px-0 py-6"
        }`}
      >
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-stokys.png"
            alt="Stokys"
            width={100}
            height={28}
            className="h-7 w-auto"
            priority
          />
        </Link>

        <div className="flex items-center gap-4">
          <LinkButton href="/onboarding">Montar minha loja</LinkButton>
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
        <div className="absolute inset-x-0 top-full bg-cloud px-6 pb-6 sm:px-10 lg:px-16">
          <nav className="mx-auto flex w-full max-w-[1800px] flex-col gap-1 rounded-3xl bg-pure-white p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuAberto(false)}
                className="rounded-2xl px-4 py-3 text-body font-medium text-off-black-ink hover:bg-off-white-canvas"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

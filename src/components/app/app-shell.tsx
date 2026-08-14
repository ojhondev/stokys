"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { clienteNavItems } from "./nav-items";

// Casca do app do cliente — mobile first: barra de abas fixa embaixo no celular
// (estilo app nativo), vira sidebar (com/sem rótulo, colapsável) a partir de md,
// no mesmo padrão do app da perk.com (logo + toggle no topo, Ajuda/Perfil fixos
// embaixo). Ver docs/PRD.md 4.4.

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [colapsado, setColapsado] = useState(false);

  return (
    <div className="flex min-h-screen bg-off-white-canvas">
      <aside
        className={`hidden flex-col border-r border-ash bg-pure-white py-6 transition-all duration-300 md:flex ${
          colapsado ? "w-20 px-3" : "w-64 px-4"
        }`}
      >
        <div className="flex items-center justify-between">
          {colapsado ? (
            <Link href="/" className="flex h-9 w-9 items-center justify-center">
              <Image src="/logo-stokys.png" alt="Stokys" width={28} height={28} className="h-7 w-auto" />
            </Link>
          ) : (
            <Link href="/" className="flex items-center">
              <Image src="/logo-stokys.png" alt="Stokys" width={100} height={28} className="h-6 w-auto" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setColapsado((v) => !v)}
            aria-label={colapsado ? "Expandir menu" : "Recolher menu"}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-body-sm text-graphite hover:bg-off-white-canvas"
          >
            ▥
          </button>
        </div>

        <nav className="mt-10 flex flex-1 flex-col gap-1">
          {clienteNavItems.map((item) => {
            const ativo = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={colapsado ? item.label : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-body-sm transition-colors hover:bg-off-white-canvas ${
                  ativo ? "font-bold text-off-black-ink" : "font-medium text-graphite"
                }`}
              >
                <span className="w-5 text-center text-body">{item.glifo}</span>
                {!colapsado && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-1 border-t border-ash pt-4">
          <Link
            href="/parceiros"
            title={colapsado ? "Ajuda" : undefined}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-body-sm font-medium text-graphite hover:bg-off-white-canvas"
          >
            <span className="w-5 text-center text-body">?</span>
            {!colapsado && <span>Ajuda</span>}
          </Link>
          <Link
            href="/dashboard/perfil"
            title={colapsado ? "Perfil" : undefined}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-body-sm font-medium text-off-black-ink hover:bg-off-white-canvas"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-electric-lime text-caption font-bold">
              S
            </span>
            {!colapsado && <span>Perfil</span>}
          </Link>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-ash bg-pure-white px-6 py-4 md:hidden">
          <Link href="/" className="text-body font-heading font-bold text-off-black-ink">
            Stokys
          </Link>
          <Link
            href="/dashboard/perfil"
            aria-label="Perfil"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-off-white-canvas text-body-sm text-off-black-ink"
          >
            ○
          </Link>
        </header>

        <main className="flex-1 px-6 pb-24 pt-6 sm:px-10 md:px-10 md:py-10 md:pb-10">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-ash bg-pure-white py-2 md:hidden">
        {clienteNavItems.map((item) => {
          const ativo = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-2 py-1"
            >
              <span className={`text-subheading ${ativo ? "text-off-black-ink" : "text-graphite"}`}>
                {item.glifo}
              </span>
              <span
                className={`text-eyebrow ${ativo ? "font-bold text-off-black-ink" : "text-graphite"}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

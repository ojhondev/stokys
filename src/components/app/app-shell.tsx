"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { clienteNavItems } from "./nav-items";

// Casca do app do cliente — mobile first: barra de abas fixa embaixo no celular
// (estilo app nativo), vira rail lateral fixo a partir de md. Ver docs/PRD.md 4.4.

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-off-white-canvas">
      <aside className="hidden w-20 flex-col items-center gap-2 border-r border-ash bg-pure-white py-8 md:flex">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-electric-lime text-body font-heading font-medium text-off-black-ink"
        >
          S
        </Link>

        <nav className="mt-8 flex flex-1 flex-col items-center gap-2">
          {clienteNavItems.map((item) => {
            const ativo = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-heading transition-colors ${
                  ativo ? "bg-electric-lime text-off-black-ink" : "text-graphite hover:bg-off-white-canvas"
                }`}
              >
                {item.glifo}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-ash bg-pure-white px-6 py-4 md:hidden">
          <Link href="/" className="text-body font-heading font-medium text-off-black-ink">
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
              className="flex flex-col items-center gap-1 px-3 py-1"
            >
              <span className={`text-subheading ${ativo ? "text-off-black-ink" : "text-graphite"}`}>
                {item.glifo}
              </span>
              <span
                className={`text-eyebrow ${ativo ? "font-medium text-off-black-ink" : "text-graphite"}`}
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

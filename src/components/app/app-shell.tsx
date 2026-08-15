"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { clienteNavItems } from "./nav-items";
import { IconMensagens, IconPagamentos, IconConfiguracoes, IconAjuda, IconSair } from "./icons";
import { logout } from "@/lib/actions/auth";

const icones = {
  mensagens: IconMensagens,
  pagamentos: IconPagamentos,
  configuracoes: IconConfiguracoes,
} as const;

// Casca do app do cliente — mobile first: barra de abas fixa embaixo no celular
// (estilo app nativo), vira sidebar (com/sem rótulo, colapsável) a partir de md,
// no mesmo padrão do app da perk.com (logo + toggle no topo, Ajuda/Sair fixos
// embaixo). Escopo do cliente é só Pagamentos/Mensagens/Configurações — ver
// docs/PRD.md 4.4 e nav-items.ts.

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
            <Link href="/dashboard" className="flex h-9 w-9 items-center justify-center">
              <Image
                src="/logo-stokys-icon.png"
                alt="Stokys"
                width={28}
                height={35}
                className="h-8 w-auto"
              />
            </Link>
          ) : (
            <Link href="/dashboard" className="flex items-center">
              <Image src="/logo-stokys.png" alt="Stokys" width={100} height={28} className="h-6 w-auto" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setColapsado((v) => !v)}
            aria-label={colapsado ? "Expandir menu" : "Recolher menu"}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-graphite hover:bg-off-white-canvas"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M9.5 4.5v15" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </button>
        </div>

        <nav className="mt-10 flex flex-1 flex-col gap-1">
          {clienteNavItems.map((item) => {
            const ativo = pathname === item.href;
            const Icone = icones[item.icone];
            return (
              <Link
                key={item.href}
                href={item.href}
                title={colapsado ? item.label : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-body-sm transition-colors hover:bg-off-white-canvas ${
                  ativo ? "font-bold text-off-black-ink" : "font-medium text-graphite"
                }`}
              >
                <Icone className="h-5 w-5 shrink-0" />
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
            <IconAjuda className="h-5 w-5 shrink-0" />
            {!colapsado && <span>Ajuda</span>}
          </Link>
          <form action={logout}>
            <button
              type="submit"
              title={colapsado ? "Sair" : undefined}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-body-sm font-medium text-graphite hover:bg-off-white-canvas"
            >
              <IconSair className="h-5 w-5 shrink-0" />
              {!colapsado && <span>Sair</span>}
            </button>
          </form>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-ash bg-pure-white px-6 py-4 md:hidden">
          <Link href="/dashboard" className="text-body font-heading font-bold text-off-black-ink">
            Stokys
          </Link>
          <form action={logout}>
            <button
              type="submit"
              aria-label="Sair"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-off-white-canvas text-off-black-ink"
            >
              <IconSair className="h-5 w-5" />
            </button>
          </form>
        </header>

        <main className="flex-1 px-6 pb-24 pt-6 sm:px-10 md:px-10 md:py-10 md:pb-10">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-ash bg-pure-white py-2 md:hidden">
        {clienteNavItems.map((item) => {
          const ativo = pathname === item.href;
          const Icone = icones[item.icone];
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-2 py-1"
            >
              <Icone className={`h-5 w-5 ${ativo ? "text-off-black-ink" : "text-graphite"}`} />
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

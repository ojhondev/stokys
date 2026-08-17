"use client";

import { useState } from "react";
import Image from "next/image";
import { LinkButton } from "@/components/ui/button";

// Convite fixo pro canal do YouTube — substitui o convite pro Discord da
// Comunidade Sem Estoque por enquanto (o canal ainda não existe, ver
// dashboard/comunidade/page.tsx). Fica sticky dentro da coluna de conteúdo
// do AppShell (não cobre a sidebar) — só desktop, pra não brigar com a
// barra de abas fixa do mobile (mesmo motivo do PromoBar não entrar no
// dashboard, ver app-shell.tsx). Cartão flutuante com degradê branco→lima
// (esquerda→direita), batendo com a referência de UI do painel.

export function FaixaYoutube() {
  const [visivel, setVisivel] = useState(true);
  if (!visivel) return null;

  return (
    <div className="sticky inset-x-0 bottom-0 z-20 hidden md:block">
      <div className="mx-6 mb-4 flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-pure-white via-electric-lime/70 to-electric-lime px-4 py-3 shadow-sm sm:mx-10">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-electric-lime">
            <Image src="/logo-stokys-icon.png" alt="" width={20} height={22} className="h-5 w-auto" />
          </div>
          <p className="truncate text-body-sm text-off-black-ink">
            Inscreva-se no canal da <span className="font-bold">Comunidade Sem Estoque</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <LinkButton
            href="https://www.youtube.com/@comunidadesemestoque"
            target="_blank"
            rel="noopener noreferrer"
            variant="white"
            className="whitespace-nowrap"
          >
            Ir para o Canal
          </LinkButton>
          <button
            type="button"
            onClick={() => setVisivel(false)}
            aria-label="Fechar"
            className="text-body-sm text-off-black-ink/60"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

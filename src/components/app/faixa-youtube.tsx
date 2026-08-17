"use client";

import { useState } from "react";
import Image from "next/image";
import { LinkButton } from "@/components/ui/button";

// Convite fixo pro canal do YouTube — substitui o convite pro Discord da
// Comunidade Sem Estoque por enquanto (o canal ainda não existe, ver
// dashboard/comunidade/page.tsx). Fica sticky dentro da coluna de conteúdo
// do AppShell (não cobre a sidebar) — só desktop, pra não brigar com a
// barra de abas fixa do mobile (mesmo motivo do PromoBar não entrar no
// dashboard, ver app-shell.tsx).

export function FaixaYoutube() {
  const [visivel, setVisivel] = useState(true);
  if (!visivel) return null;

  return (
    <div className="sticky inset-x-0 bottom-0 z-20 hidden border-t border-ash bg-electric-lime px-6 py-3 md:flex sm:px-10">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src="/icon.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 rounded-full"
          />
          <p className="truncate text-body-sm font-medium text-off-black-ink">
            Inscreva-se no canal da <span className="font-bold">Comunidade Sem Estoque</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <LinkButton
            href="https://www.youtube.com/@comunidadesemestoque"
            target="_blank"
            rel="noopener noreferrer"
            variant="dark"
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

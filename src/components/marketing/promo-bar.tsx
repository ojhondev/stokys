"use client";

import { useState } from "react";
import { LinkButton } from "@/components/ui/button";

// Faixa fixa embaixo (desktop e mobile) com a promoção do Customizado — só nas
// páginas públicas (LP, parceiros), não entra no dashboard pra não brigar com a
// barra de abas fixa que já existe lá.

export function PromoBar() {
  const [visivel, setVisivel] = useState(true);
  if (!visivel) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 bg-off-black-ink px-6 py-3 sm:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between gap-4">
        <p className="text-body-sm font-medium text-off-white-canvas">
          Crie um plano Customizado com{" "}
          <span className="font-bold text-electric-lime">15% de desconto</span> à vista no PIX.
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <LinkButton href="/onboarding?plano=customizado" className="whitespace-nowrap">
            Criar minha loja
          </LinkButton>
          <button
            type="button"
            onClick={() => setVisivel(false)}
            aria-label="Fechar"
            className="text-body-sm text-off-white-canvas/60"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { LinkButton } from "@/components/ui/button";
import { linkWhatsapp } from "@/lib/whatsapp";

// Faixa fixa embaixo (desktop e mobile) com um convite pra tirar dúvidas
// direto com o time — só nas páginas públicas (LP, parceiros), não entra no
// dashboard pra não brigar com a barra de abas fixa que já existe lá.

const MENSAGEM_DUVIDAS = "Olá! Vim do site da Stokys e gostaria de tirar dúvidas sobre as lojas.";

export function PromoBar() {
  const [visivel, setVisivel] = useState(true);
  if (!visivel) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 bg-pure-white px-6 py-3 sm:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between gap-4">
        <p className="text-body-sm font-medium text-off-black-ink">
          Tire suas dúvidas com o time da Stokys antes de comprar sua loja.
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <LinkButton
            href={linkWhatsapp(MENSAGEM_DUVIDAS)}
            target="_blank"
            rel="noopener noreferrer"
            variant="dark"
            className="whitespace-nowrap"
          >
            Falar no WhatsApp
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

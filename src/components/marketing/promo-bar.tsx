"use client";

import { useState } from "react";
import { Button, LinkButton } from "@/components/ui/button";
import { linkWhatsapp } from "@/lib/whatsapp";

// Faixa fixa embaixo — só nas páginas públicas (LP, parceiros), não entra no
// dashboard pra não brigar com a barra de abas fixa que já existe lá.
// No mobile a barra não cabe os dois convites (WhatsApp + vídeo), então vira
// o convite pro vídeo (que abre o pop-up, ver video-popup.tsx); no desktop
// continua o convite direto pro WhatsApp, já que lá o vídeo também aparece
// como mini player flutuante à parte.

const MENSAGEM_DUVIDAS = "Olá! Vim do site da Stokys e gostaria de tirar dúvidas sobre as lojas.";

function abrirVideoPopup() {
  window.dispatchEvent(new Event("stokys:abrir-video"));
}

export function PromoBar() {
  const [visivel, setVisivel] = useState(true);
  if (!visivel) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 bg-pure-white px-6 py-3 sm:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between gap-4">
        <p className="hidden text-body-sm font-medium text-off-black-ink md:block">
          Tire suas dúvidas com o time da Stokys antes de comprar sua loja.
        </p>
        <p className="text-body-sm font-medium text-off-black-ink md:hidden">
          Entenda o que é a Stokys
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <LinkButton
            href={linkWhatsapp(MENSAGEM_DUVIDAS)}
            target="_blank"
            rel="noopener noreferrer"
            variant="dark"
            className="hidden whitespace-nowrap md:inline-flex"
          >
            Falar no WhatsApp
          </LinkButton>
          <Button
            type="button"
            onClick={abrirVideoPopup}
            variant="dark"
            className="whitespace-nowrap md:hidden"
          >
            Assista ao vídeo
          </Button>
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

"use client";

import { LinkButton } from "@/components/ui/button";
import { linkWhatsapp, MENSAGEM_WHATSAPP_GENERICA } from "@/lib/whatsapp";

// Modal "em breve" — intercepta os pontos de entrada da LP pro login/dashboard
// (ainda não liberados pro público) e redireciona o interesse pro WhatsApp.
// Mesmo padrão de overlay do menu mobile do header (fundo semi-transparente,
// card branco arredondado), fechável clicando fora ou no ✕.

export function EmBreveModal({
  aberto,
  onFechar,
}: {
  aberto: boolean;
  onFechar: () => void;
}) {
  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-off-black-ink/50 px-6"
      onClick={onFechar}
    >
      <div
        className="relative w-full max-w-[420px] rounded-3xl bg-pure-white p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onFechar}
          aria-label="Fechar"
          className="absolute right-6 top-6 text-body-sm text-off-black-ink/60"
        >
          ✕
        </button>

        <h2 className="mt-4 text-subheading font-heading font-bold text-off-black-ink">
          Em breve
        </h2>
        <p className="mt-3 text-body-sm text-graphite">
          A plataforma está sendo desenvolvida, em breve você poderá aproveitar 100% das
          funcionalidades da Stokys.
        </p>

        <LinkButton
          href={linkWhatsapp(MENSAGEM_WHATSAPP_GENERICA)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6"
        >
          Falar no WhatsApp
        </LinkButton>
      </div>
    </div>
  );
}

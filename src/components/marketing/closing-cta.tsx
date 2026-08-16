import { LinkButton } from "@/components/ui/button";
import { linkWhatsapp, MENSAGEM_WHATSAPP_GENERICA } from "@/lib/whatsapp";

// Faixa de fechamento — mesma posição/fundo branco do banner final da perk.com
// (lá é o patrocínio F1; aqui não existe claim equivalente, então fica só o CTA).

export function ClosingCta() {
  return (
    <section className="bg-pure-white px-6 sm:px-10 lg:px-16 py-14 md:py-16">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col items-center text-center">
        <h2 className="max-w-[640px] text-heading-lg font-heading font-bold text-off-black-ink md:text-display">
          A loja pronta. Você só vende.
        </h2>
        <div className="mt-10">
          <LinkButton
            href={linkWhatsapp(MENSAGEM_WHATSAPP_GENERICA)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Criar loja
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

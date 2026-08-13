import { LinkButton } from "@/components/ui/button";

// Faixa de fechamento — mesma posição/fundo branco do banner final da perk.com
// (lá é o patrocínio F1; aqui não existe claim equivalente, então fica só o CTA).

export function ClosingCta() {
  return (
    <section className="bg-pure-white px-6 py-20 md:py-24">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center text-center">
        <h2 className="max-w-[640px] text-heading-lg font-medium text-off-black-ink">
          A loja pronta. Você só vende.
        </h2>
        <div className="mt-10">
          <LinkButton href="/onboarding">Montar minha loja</LinkButton>
        </div>
      </div>
    </section>
  );
}

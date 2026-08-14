import { LinkButton } from "@/components/ui/button";
import { planosConteudo } from "@/lib/planos-conteudo";

// Cards de preço — mesmo padrão do "Pick your plan" da perk.com: nome, label da
// taxa, preço grande, descrição, CTA. Preço ainda não definido (PRD seção 11),
// fica como placeholder visível em vez de número inventado.

export function PricingCards() {
  return (
    <section id="planos" className="bg-pure-white px-6 py-14 sm:px-10 md:py-16 lg:px-16">
      <div className="mx-auto w-full max-w-[1800px]">
        <h2 className="text-center text-heading-lg font-heading font-bold text-off-black-ink">
          Escolha seu plano
        </h2>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {planosConteudo.map((plano) => (
            <div
              key={plano.slug}
              className={`flex flex-col rounded-3xl p-8 ${
                plano.destaque ? "bg-off-white-canvas" : "border border-ash bg-pure-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <h3 className="text-subheading font-heading font-bold text-off-black-ink">
                  {plano.nome}
                </h3>
                {plano.destaque && (
                  <span className="rounded-full bg-electric-lime px-3 py-1 text-caption font-medium text-off-black-ink">
                    Mais popular
                  </span>
                )}
              </div>

              <p className="mt-4 text-caption font-medium uppercase text-graphite">
                Valor do projeto
              </p>
              <p className="mt-1 text-heading-lg font-heading font-bold text-off-black-ink">—</p>
              <p className="text-caption text-graphite">[valor a definir]</p>

              <p className="mt-4 text-body-sm text-graphite">{plano.descricao}</p>

              <LinkButton
                href={`/onboarding?plano=${plano.slug}`}
                variant={plano.destaque ? "primary" : "outline"}
                className="mt-8 w-fit"
              >
                {plano.slug === "zen" ? "Começar" : `Escolher ${plano.nome}`}
              </LinkButton>
            </div>
          ))}
        </div>

        <p className="mt-6 text-caption text-graphite">
          *Cada seleção no onboarding (plano, tema, produtos) compõe o orçamento final.
        </p>
      </div>
    </section>
  );
}

import { LinkButton } from "@/components/ui/button";
import { planosConteudo, formatarPreco } from "@/lib/planos-conteudo";

// Cards de preço — desktop segue o "Pick your plan" da perk.com (cards lado a
// lado). Mobile usa o padrão "With X, you get:" (lista com divisórias) que o
// usuário pediu — mais claro que cards espremidos numa coluna só.

export function PricingCards() {
  return (
    <section id="planos" className="bg-pure-white px-6 py-14 sm:px-10 md:py-16 lg:px-16">
      <div className="mx-auto w-full max-w-[1800px]">
        <h2 className="text-center text-heading-lg font-heading font-bold text-off-black-ink">
          Planos que cabem no bolso
        </h2>

        {/* Desktop */}
        <div className="mt-14 hidden gap-6 md:grid md:grid-cols-3">
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
              <p className="mt-1 text-heading-lg font-heading font-bold text-off-black-ink">
                {formatarPreco(plano.precoCentavos)}
              </p>

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

        {/* Mobile: lista com divisórias por plano */}
        <div className="mt-10 flex flex-col gap-6 md:hidden">
          {planosConteudo.map((plano) => (
            <div key={plano.slug} className="rounded-3xl bg-off-white-canvas p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-heading font-heading font-bold text-off-black-ink">
                  Com o {plano.nome}, você ganha:
                </h3>
                {plano.destaque && (
                  <span className="shrink-0 rounded-full bg-electric-lime px-3 py-1 text-caption font-medium text-off-black-ink">
                    Popular
                  </span>
                )}
              </div>
              <p className="mt-1 text-subheading font-heading font-bold text-off-black-ink">
                {formatarPreco(plano.precoCentavos)}
              </p>
              <p className="mt-1 text-body-sm font-medium text-graphite">{plano.descricao}</p>

              <ul className="mt-5 flex flex-col">
                {plano.itens.map((item) => (
                  <li
                    key={item}
                    className="border-t border-ash py-3 text-body-sm text-off-black-ink first:border-t-0"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <LinkButton
                href={`/onboarding?plano=${plano.slug}`}
                variant={plano.destaque ? "primary" : "outline"}
                className="mt-6 w-full justify-center"
              >
                {plano.slug === "zen" ? "Começar" : `Escolher ${plano.nome}`}
              </LinkButton>
            </div>
          ))}
        </div>

        <p className="mt-6 text-caption text-graphite">
          *Pagamento único por projeto — não é mensalidade.
        </p>
      </div>
    </section>
  );
}

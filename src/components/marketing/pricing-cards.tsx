import { LinkButton } from "@/components/ui/button";
import { planosConteudo, formatarPreco } from "@/lib/planos-conteudo";
import { linkWhatsapp } from "@/lib/whatsapp";

function mensagemPlano(nome: string, precoCentavos: number): string {
  return `Olá! Quero criar minha loja com o plano ${nome} (${formatarPreco(precoCentavos)}).`;
}

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

        {/* Desktop — ao passar o mouse, o card revela uma "vitrine" com tudo
            que está incluso no plano (efeito pedido pelo usuário). */}
        <div className="mt-14 hidden gap-6 md:grid md:grid-cols-3">
          {planosConteudo.map((plano) => (
            <div
              key={plano.slug}
              className={`group relative flex h-[420px] flex-col overflow-hidden rounded-3xl p-8 transition-transform duration-200 hover:scale-[1.02] ${
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
                href={linkWhatsapp(mensagemPlano(plano.nome, plano.precoCentavos))}
                target="_blank"
                rel="noopener noreferrer"
                variant={plano.destaque ? "primary" : "outline"}
                className="mt-8 w-fit"
              >
                {plano.slug === "zen" ? "Começar" : `Escolher ${plano.nome}`}
              </LinkButton>

              {/* Vitrine — some no hover, mostrando tudo que está incluso */}
              <div className="pointer-events-none absolute inset-0 flex flex-col rounded-3xl bg-off-black-ink p-8 opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
                <h3 className="text-subheading font-heading font-bold text-electric-lime">
                  {plano.nome}
                </h3>
                <p className="mt-1 text-caption font-medium uppercase text-ash">
                  Tudo incluso no plano
                </p>
                <ul className="mt-4 flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
                  {plano.itens.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-body-sm text-off-white-canvas"
                    >
                      <span className="mt-0.5 shrink-0 text-electric-lime" aria-hidden>
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <LinkButton
                  href={linkWhatsapp(mensagemPlano(plano.nome, plano.precoCentavos))}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  className="mt-4 w-fit"
                >
                  {plano.slug === "zen" ? "Começar" : `Escolher ${plano.nome}`}
                </LinkButton>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: card com nome, preço em destaque e CTA compacto, sem lista —
            a comparação completa já está na seção "Entenda os planos" */}
        <div className="mt-10 flex flex-col gap-6 md:hidden">
          {planosConteudo.map((plano) => (
            <div
              key={plano.slug}
              className={`rounded-3xl p-6 ${
                plano.destaque ? "bg-off-white-canvas" : "border border-ash bg-pure-white"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-heading font-heading font-bold text-off-black-ink">
                  {plano.nome}
                </h3>
                {plano.destaque && (
                  <span className="shrink-0 rounded-full bg-electric-lime px-3 py-1 text-caption font-medium text-off-black-ink">
                    Mais popular
                  </span>
                )}
              </div>

              <p className="mt-4 text-caption text-graphite">Com o {plano.nome} você tem...</p>
              <p className="mt-1 text-heading-lg font-heading font-bold text-off-black-ink">
                {formatarPreco(plano.precoCentavos)}
              </p>

              <p className="mt-3 text-body-sm text-graphite">{plano.descricao}</p>

              <LinkButton
                href={linkWhatsapp(mensagemPlano(plano.nome, plano.precoCentavos))}
                target="_blank"
                rel="noopener noreferrer"
                variant={plano.destaque ? "primary" : "outline"}
                className="mt-6 gap-2"
              >
                {plano.slug === "zen" ? "Começar" : `Escolher ${plano.nome}`}
                <span aria-hidden>→</span>
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

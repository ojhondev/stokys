import { LinkButton } from "@/components/ui/button";
import { planosConteudo, formatarPreco, type PlanoConteudo } from "@/lib/planos-conteudo";

// Cards de preço — desktop segue o "Pick your plan" da perk.com (cards lado a
// lado), mobile empilha. "Detalhes do plano" é um dropdown nativo
// (<details>/<summary>), mesmo padrão do FAQ — clique explícito em vez de
// hover, que não estava intuitivo o suficiente (feedback do usuário).

function DetalhesDropdown({
  plano,
  resumoClassName,
}: {
  plano: PlanoConteudo;
  resumoClassName: string;
}) {
  return (
    <details className="group mt-6">
      <summary
        className={`flex cursor-pointer list-none items-center gap-2 text-body font-bold text-off-black-ink transition-opacity hover:opacity-70 ${resumoClassName}`}
      >
        Detalhes do plano
        <span className="shrink-0 text-heading transition-transform duration-200 group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="mt-4 flex flex-col gap-4 rounded-3xl bg-off-black-ink p-6">
        <p className="text-caption font-medium uppercase text-ash">Tudo incluso no plano</p>
        <ul className="flex flex-col gap-2">
          {plano.itens.map((item) => (
            <li key={item} className="flex items-start gap-2 text-body-sm text-off-white-canvas">
              <span className="mt-0.5 shrink-0 text-electric-lime" aria-hidden>
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <LinkButton
          href={`/cadastro?tipo=cliente&plano=${plano.slug}`}
          variant="primary"
          className="w-fit"
        >
          {plano.slug === "zen" ? "Começar" : `Escolher ${plano.nome}`}
        </LinkButton>
      </div>
    </details>
  );
}

function CardDesktop({ plano }: { plano: PlanoConteudo }) {
  return (
    <div
      className={`flex flex-col rounded-3xl p-8 transition-transform duration-200 hover:scale-[1.02] ${
        plano.destaque ? "bg-off-white-canvas" : "border border-ash bg-pure-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <h3 className="text-subheading font-heading font-bold text-off-black-ink">{plano.nome}</h3>
        {plano.destaque && (
          <span className="rounded-full bg-electric-lime px-3 py-1 text-caption font-medium text-off-black-ink">
            Mais popular
          </span>
        )}
      </div>

      <p className="mt-4 text-caption font-medium uppercase text-graphite">Valor do projeto</p>
      <p className="mt-1 text-heading-lg font-heading font-bold text-off-black-ink">
        {formatarPreco(plano.precoCentavos)}
      </p>

      <p className="mt-4 text-body-sm text-graphite">{plano.descricao}</p>

      <DetalhesDropdown
        plano={plano}
        resumoClassName={`w-fit rounded-3xl pt-4 pb-4 pl-4 pr-3 ${
          plano.destaque ? "bg-pure-white" : "bg-off-white-canvas"
        }`}
      />
    </div>
  );
}

function CardMobile({ plano }: { plano: PlanoConteudo }) {
  return (
    <div
      className={`rounded-3xl p-6 ${
        plano.destaque ? "bg-off-white-canvas" : "border border-ash bg-pure-white"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-heading font-heading font-bold text-off-black-ink">{plano.nome}</h3>
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

      <DetalhesDropdown
        plano={plano}
        resumoClassName="w-full justify-center rounded-3xl bg-pure-white pt-4 pb-4 pl-4 pr-3"
      />
    </div>
  );
}

export function PricingCards() {
  return (
    <section id="planos" className="bg-pure-white px-6 py-14 sm:px-10 md:py-16 lg:px-16">
      <div className="mx-auto w-full max-w-[1800px]">
        <h2 className="text-center text-heading-lg font-heading font-bold text-off-black-ink md:text-display">
          Planos que cabem no bolso
        </h2>

        {/* Desktop */}
        <div className="mt-14 hidden items-start gap-6 md:grid md:grid-cols-3">
          {planosConteudo.map((plano) => (
            <CardDesktop key={plano.slug} plano={plano} />
          ))}
        </div>

        {/* Mobile */}
        <div className="mt-10 flex flex-col gap-6 md:hidden">
          {planosConteudo.map((plano) => (
            <CardMobile key={plano.slug} plano={plano} />
          ))}
        </div>

        <p className="mt-6 text-caption text-graphite">
          *Pagamento único por projeto — não é mensalidade.
        </p>
      </div>
    </section>
  );
}

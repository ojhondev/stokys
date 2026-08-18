import Image from "next/image";
import { Button, LinkButton } from "@/components/ui/button";
import { formatarPreco, type PlanoConteudo } from "@/lib/planos-conteudo";

// Card de plano compartilhado entre a LP (`pricing-cards.tsx`) e o onboarding
// (`plano-step.tsx`) — mesmo visual e mesmo dropdown "Ver o que está incluso"
// (<details>/<summary>, substituiu o hover pouco intuitivo) nos dois lugares,
// pra não manter dois HTMLs de card divergindo com o tempo.

type Acao = { tipo: "link"; href: string } | { tipo: "selecionar"; onSelecionar: () => void };

export function PlanoCard({
  plano,
  selecionado = false,
  acao,
}: {
  plano: PlanoConteudo;
  selecionado?: boolean;
  acao: Acao;
}) {
  return (
    <div
      className={`flex flex-col rounded-3xl p-6 transition-all duration-200 hover:scale-[1.02] sm:p-8 ${
        selecionado
          ? "bg-electric-lime"
          : plano.destaque
            ? "bg-off-white-canvas"
            : "border border-ash bg-pure-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <h3 className="text-subheading font-heading font-bold text-off-black-ink">{plano.nome}</h3>
        {selecionado ? (
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-off-black-ink text-caption font-bold text-electric-lime"
            aria-hidden
          >
            ✓
          </span>
        ) : (
          plano.destaque && (
            <span className="rounded-full bg-off-black-ink px-3 py-1 text-caption font-medium text-electric-lime">
              Mais popular
            </span>
          )
        )}
      </div>

      <p className="mt-4 text-caption font-medium uppercase text-graphite">Valor do projeto</p>
      <p className="mt-1 text-heading-lg font-heading font-bold text-off-black-ink">
        {formatarPreco(plano.precoCentavos)}
      </p>
      <p className="mt-1 text-caption font-medium text-graphite">
        Entrega em {plano.prazoDiasUteis} dias úteis
      </p>
      <p className="mt-4 text-body-sm text-graphite">{plano.descricao}</p>

      <details className="group mt-6">
        <summary
          className={`flex w-full cursor-pointer list-none items-center justify-center gap-2 rounded-3xl pt-4 pb-4 pl-4 pr-3 text-body font-bold text-off-black-ink transition-opacity hover:opacity-70 sm:w-fit sm:justify-start ${
            selecionado ? "bg-pure-white" : "bg-off-white-canvas"
          }`}
        >
          Ver o que está incluso
          <span className="shrink-0 text-heading transition-transform duration-200 group-open:rotate-45">
            +
          </span>
        </summary>
        <ul className="mt-4 flex flex-col gap-2 rounded-3xl bg-off-black-ink p-6">
          {plano.itens.map((item) => (
            <li key={item} className="flex items-start gap-2 text-body-sm text-off-white-canvas">
              <span className="mt-0.5 shrink-0 text-electric-lime" aria-hidden>
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </details>

      <div className="mt-6">
        {acao.tipo === "link" ? (
          <LinkButton href={acao.href} variant="primary" className="w-full justify-center sm:w-fit">
            {plano.slug === "zen" ? "Começar" : `Escolher ${plano.nome}`}
          </LinkButton>
        ) : (
          <Button
            type="button"
            onClick={acao.onSelecionar}
            variant={selecionado ? "dark" : "primary"}
            className="w-full justify-center sm:w-fit"
          >
            {selecionado ? "Selecionado" : "Selecionar"}
          </Button>
        )}
      </div>
    </div>
  );
}

export function LogoStokys({ className = "h-7 w-auto" }: { className?: string }) {
  return <Image src="/logo-stokys.png" alt="Stokys" width={125} height={28} className={className} />;
}

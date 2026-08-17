import { Button } from "@/components/ui/button";
import { planosConteudo } from "@/lib/planos-conteudo";
import { LogoStokys, PlanoCard } from "@/components/planos/plano-card";
import type { StepProps } from "../types";

export function PlanoStep({ dados, setDados, onContinuar }: StepProps) {
  const plano = planosConteudo.find((p) => p.slug === dados.plano);

  return (
    <div>
      <LogoStokys className="h-8 w-auto" />
      <h1 className="mt-6 text-heading font-heading font-bold text-off-black-ink">
        Qual plano combina com a sua loja?
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-1 md:grid-cols-3">
        {planosConteudo.map((p) => (
          <PlanoCard
            key={p.slug}
            plano={p}
            selecionado={p.slug === dados.plano}
            acao={{
              tipo: "selecionar",
              onSelecionar: () => setDados((d) => ({ ...d, plano: p.slug })),
            }}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-col items-stretch gap-4 rounded-3xl bg-off-white-canvas p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-caption font-medium uppercase text-graphite">Plano selecionado</p>
          <p className="mt-1 text-subheading font-medium text-off-black-ink">
            {plano ? plano.nome : "Escolha um plano acima"}
          </p>
        </div>
        <Button disabled={!plano} onClick={onContinuar} className="w-full justify-center sm:w-auto">
          Continuar
        </Button>
      </div>
    </div>
  );
}

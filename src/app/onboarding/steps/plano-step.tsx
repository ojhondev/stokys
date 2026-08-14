import { Button } from "@/components/ui/button";
import { planosConteudo } from "@/lib/planos-conteudo";
import type { StepProps } from "../types";

export function PlanoStep({ dados, setDados, onContinuar }: StepProps) {
  const plano = planosConteudo.find((p) => p.slug === dados.plano);

  return (
    <div>
      <h1 className="text-heading font-heading font-bold text-off-black-ink">
        Qual plano combina com a sua loja?
      </h1>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {planosConteudo.map((p) => {
          const ativo = p.slug === dados.plano;
          return (
            <button
              key={p.slug}
              type="button"
              onClick={() => setDados((d) => ({ ...d, plano: p.slug }))}
              className={`flex flex-col rounded-3xl p-6 text-left transition-colors sm:p-8 ${
                ativo ? "bg-electric-lime" : "bg-off-white-canvas"
              }`}
            >
              <h3 className="text-subheading font-heading font-bold text-off-black-ink">
                {p.nome}
              </h3>
              <p className="mt-2 text-body-sm text-off-black-ink/70">{p.descricao}</p>
              <ul className="mt-6 flex flex-col gap-2">
                {p.itens.map((item) => (
                  <li key={item} className="text-body-sm text-off-black-ink">
                    {item}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col items-stretch gap-4 rounded-3xl bg-off-white-canvas p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-caption font-medium uppercase text-graphite">Plano selecionado</p>
          <p className="mt-1 text-subheading font-medium text-off-black-ink">
            {plano ? plano.nome : "Escolha um plano acima"}
          </p>
        </div>
        <Button disabled={!plano} onClick={onContinuar} className="w-full sm:w-auto">
          Continuar
        </Button>
      </div>
    </div>
  );
}

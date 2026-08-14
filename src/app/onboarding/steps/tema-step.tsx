import { Button } from "@/components/ui/button";
import type { Tema, StepProps } from "../types";

const temas: { valor: Tema; label: string; descricao: string }[] = [
  { valor: "spark", label: "Spark", descricao: "Indicado para moda e vestuário." },
  { valor: "quart", label: "Quart", descricao: "Indicado para decoração e casa." },
];

export function TemaStep({ dados, setDados, onContinuar, onVoltar }: StepProps) {
  const podeContinuar = Boolean(dados.tema);

  return (
    <div>
      <h1 className="text-heading font-heading font-bold text-off-black-ink">
        Qual tema combina com o seu produto?
      </h1>
      <p className="mt-2 text-body-sm text-graphite">Incluso no seu plano, sem custo extra.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {temas.map((t) => {
          const ativo = dados.tema === t.valor;
          return (
            <button
              key={t.valor}
              type="button"
              onClick={() => setDados((d) => ({ ...d, tema: t.valor }))}
              className={`rounded-3xl p-6 text-left transition-colors ${
                ativo ? "bg-electric-lime" : "bg-off-white-canvas"
              }`}
            >
              <p className="text-subheading font-heading font-bold text-off-black-ink">
                {t.label}
              </p>
              <p className="mt-1 text-body-sm text-off-black-ink/70">{t.descricao}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" onClick={onVoltar} variant="ghost">
          Voltar
        </Button>
        <Button disabled={!podeContinuar} onClick={onContinuar} className="w-full sm:w-auto">
          Continuar
        </Button>
      </div>
    </div>
  );
}

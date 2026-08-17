import { Button } from "@/components/ui/button";
import type { Tema, StepProps } from "../types";

const temas: { valor: Tema; label: string; descricao: string }[] = [
  { valor: "spark", label: "Spark", descricao: "Indicado para moda, acessórios e uso geral." },
  { valor: "quart", label: "Quart", descricao: "Indicado para decoração e casa." },
];

// Preview em grade — mesmo placeholder de .../temas (TemaMockup) até as fotos
// reais de referência chegarem (Moda/Acessórios/Geral e Casa/Decoração).
function PreviewMockup() {
  return (
    <div className="grid aspect-video w-full grid-cols-4 gap-2 rounded-2xl bg-pure-white p-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className={`rounded-lg ${[1, 5].includes(i) ? "bg-electric-lime/60" : "bg-off-white-canvas"} ${
            i === 0 ? "col-span-2 row-span-2" : ""
          }`}
        />
      ))}
    </div>
  );
}

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
              className={`flex flex-col rounded-3xl p-6 text-left transition-colors ${
                ativo ? "bg-electric-lime" : "bg-off-white-canvas"
              }`}
            >
              <PreviewMockup />
              <span className="mt-2 text-caption text-graphite">
                Capturas de tela reais em breve
              </span>
              <p className="mt-4 text-subheading font-heading font-bold text-off-black-ink">
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

import { Button } from "@/components/ui/button";
import { TOTAL_REFERENCIAS, type StepProps } from "../types";

export function ReferenciasStep({ dados, setDados, onContinuar, onVoltar }: StepProps) {
  const podeContinuar = dados.referencias.every((r) => r.trim().length > 0);

  function atualizarReferencia(index: number, valor: string) {
    setDados((d) => {
      const referencias = [...d.referencias];
      referencias[index] = valor;
      return { ...d, referencias };
    });
  }

  return (
    <div>
      <h1 className="text-heading font-heading font-bold text-off-black-ink">
        Liste {TOTAL_REFERENCIAS} lojas que você admira
      </h1>
      <p className="mt-2 max-w-[480px] text-body-sm text-graphite">
        Podem ser concorrentes ou lojas de qualquer nicho — usamos como referência visual e de
        organização de produtos.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {dados.referencias.map((referencia, i) => (
          <label key={i} className="flex flex-col gap-2">
            <span className="text-caption font-medium uppercase text-graphite">
              Referência {i + 1}
            </span>
            <input
              type="text"
              value={referencia}
              onChange={(e) => atualizarReferencia(i, e.target.value)}
              placeholder="Nome da loja ou link"
              className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
            />
          </label>
        ))}
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

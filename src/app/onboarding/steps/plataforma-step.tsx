import { Button } from "@/components/ui/button";
import type { Plataforma, StepProps } from "../types";

const plataformas: { valor: Plataforma; label: string }[] = [
  { valor: "shopify", label: "Shopify" },
  { valor: "nuvemshop", label: "Nuvemshop" },
];

export function PlataformaStep({ dados, setDados, onContinuar, onVoltar }: StepProps) {
  const podeContinuar = Boolean(dados.plataforma);

  return (
    <div>
      <h1 className="text-heading font-heading font-bold text-off-black-ink">
        Onde sua loja vai rodar?
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {plataformas.map((p) => {
          const ativo = dados.plataforma === p.valor;
          return (
            <button
              key={p.valor}
              type="button"
              onClick={() => setDados((d) => ({ ...d, plataforma: p.valor }))}
              className={`rounded-3xl p-6 text-left text-subheading font-heading font-bold text-off-black-ink transition-colors ${
                ativo ? "bg-electric-lime" : "bg-off-white-canvas"
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-caption text-graphite">
        Mesmo preço nas duas — a escolha só muda o processo técnico de implementação. Os acessos
        da sua conta são pedidos depois, no painel, em Configurações.
      </p>

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

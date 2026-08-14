import { Button } from "@/components/ui/button";
import type { StepProps } from "../types";

export function NichoStep({ dados, setDados, onContinuar, onVoltar }: StepProps) {
  const podeContinuar = dados.nicho.trim().length > 0;

  return (
    <div>
      <h1 className="text-heading font-heading font-bold text-off-black-ink">
        Qual o nicho da sua loja?
      </h1>
      <p className="mt-2 max-w-[480px] text-body-sm text-graphite">
        Ajuda a produção a escolher categorias, produtos e banners com a cara do seu público.
      </p>

      <label className="mt-8 flex flex-col gap-2">
        <span className="text-body-sm font-medium text-off-black-ink">
          Ex.: moda feminina, decoração, pet, beleza, eletrônicos…
        </span>
        <input
          type="text"
          value={dados.nicho}
          onChange={(e) => setDados((d) => ({ ...d, nicho: e.target.value }))}
          placeholder="Digite o nicho da sua loja"
          className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
        />
      </label>

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

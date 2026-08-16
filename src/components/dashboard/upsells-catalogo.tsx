"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { adicionarUpsellAoProjeto, removerItemAberto } from "@/lib/actions/upsells";
import { formatarPreco } from "@/lib/planos-conteudo";

export type ItemAberto = {
  id: string;
  tipo: "plano_base" | "upsell";
  descricao: string;
  valorCentavos: number;
};

export type UpsellDisponivel = {
  id: string;
  nome: string;
  descricao: string | null;
  valorCentavos: number;
};

export function UpsellsCatalogo({
  itensAbertos,
  disponiveis,
  bloqueado,
}: {
  itensAbertos: ItemAberto[];
  disponiveis: UpsellDisponivel[];
  bloqueado: boolean;
}) {
  const router = useRouter();
  const [pendente, iniciarTransicao] = useTransition();

  function adicionar(catalogoUpsellId: string) {
    iniciarTransicao(async () => {
      await adicionarUpsellAoProjeto(catalogoUpsellId);
      router.refresh();
    });
  }

  function remover(itemId: string) {
    iniciarTransicao(async () => {
      await removerItemAberto(itemId);
      router.refresh();
    });
  }

  const total = itensAbertos.reduce((soma, item) => soma + item.valorCentavos, 0);

  return (
    <div className="mt-6 flex flex-col gap-2 rounded-3xl bg-pure-white p-6">
      {itensAbertos.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border-b border-ash py-2 text-body-sm text-off-black-ink last:border-b-0"
        >
          <span>{item.descricao}</span>
          <div className="flex items-center gap-3">
            <span className="font-bold">{formatarPreco(item.valorCentavos)}</span>
            {item.tipo === "upsell" && !bloqueado && (
              <button
                type="button"
                onClick={() => remover(item.id)}
                disabled={pendente}
                className="text-caption font-medium text-graphite underline disabled:opacity-50"
              >
                Remover
              </button>
            )}
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between pt-2 text-body font-bold text-off-black-ink">
        <span>Total</span>
        <span>{formatarPreco(total)}</span>
      </div>

      {!bloqueado && disponiveis.length > 0 && (
        <div className="mt-4 border-t border-ash pt-4">
          <p className="text-caption font-medium uppercase text-graphite">Adicionar upsell</p>
          <div className="mt-3 flex flex-col gap-3">
            {disponiveis.map((upsell) => (
              <div key={upsell.id} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-body-sm font-medium text-off-black-ink">{upsell.nome}</p>
                  {upsell.descricao && (
                    <p className="text-caption text-graphite">{upsell.descricao}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-body-sm font-bold text-off-black-ink">
                    {formatarPreco(upsell.valorCentavos)}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={pendente}
                    onClick={() => adicionar(upsell.id)}
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

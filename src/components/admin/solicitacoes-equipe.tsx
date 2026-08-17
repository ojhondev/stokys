"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { atualizarStatusSolicitacao } from "@/lib/actions/solicitacoes";

type Solicitacao = {
  id: string;
  tipo: "alteracao" | "informacao" | "conteudo";
  texto: string;
  status: "aberta" | "em_andamento" | "concluida";
  criadoEm: Date;
};

const labelTipo = { alteracao: "Alteração", informacao: "Informação", conteudo: "Conteúdo" } as const;

const statusOptions = [
  { valor: "aberta", label: "Aberta" },
  { valor: "em_andamento", label: "Em andamento" },
  { valor: "concluida", label: "Concluída" },
] as const;

export function SolicitacoesEquipe({ solicitacoes }: { solicitacoes: Solicitacao[] }) {
  const router = useRouter();
  const [pendente, iniciarTransicao] = useTransition();

  function mudarStatus(id: string, status: (typeof statusOptions)[number]["valor"]) {
    iniciarTransicao(async () => {
      await atualizarStatusSolicitacao(id, status);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-pure-white p-6">
      <p className="text-caption font-medium uppercase text-graphite">Solicitações</p>
      {solicitacoes.length === 0 && (
        <p className="text-body-sm text-graphite">Nenhuma solicitação ainda.</p>
      )}
      {solicitacoes.map((s) => (
        <div key={s.id} className="flex flex-col gap-2 border-b border-ash pb-4 last:border-b-0">
          <div className="flex items-center justify-between gap-4">
            <span className="text-caption font-medium uppercase text-graphite">{labelTipo[s.tipo]}</span>
            <span className="text-caption text-graphite">{s.criadoEm.toLocaleDateString("pt-BR")}</span>
          </div>
          <p className="text-body-sm text-off-black-ink">{s.texto}</p>
          <select
            value={s.status}
            disabled={pendente}
            onChange={(e) => mudarStatus(s.id, e.target.value as (typeof statusOptions)[number]["valor"])}
            className="w-fit rounded-lg border border-ash bg-off-white-canvas px-3 py-2 text-body-sm text-off-black-ink"
          >
            {statusOptions.map((opt) => (
              <option key={opt.valor} value={opt.valor}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { atualizarStatusProjeto, atribuirResponsavel } from "@/lib/actions/admin";

const statusOptions = [
  { valor: "onboarding", label: "Onboarding" },
  { valor: "aguardando_pagamento", label: "Aguardando pagamento" },
  { valor: "em_producao", label: "Em produção" },
  { valor: "preview_disponivel", label: "Preview disponível" },
  { valor: "entregue", label: "Entregue" },
] as const;

type StatusProjeto = (typeof statusOptions)[number]["valor"];

export function ProjetoControls({
  projetoId,
  statusAtual,
  producaoDisponivel,
  responsavelAtualId,
  podeAtribuir,
}: {
  projetoId: string;
  statusAtual: StatusProjeto;
  producaoDisponivel: { id: string; nome: string }[];
  responsavelAtualId: string | null;
  podeAtribuir: boolean;
}) {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();

  function mudarStatus(status: StatusProjeto) {
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await atualizarStatusProjeto(projetoId, status);
      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }
      router.refresh();
    });
  }

  function mudarResponsavel(responsavelId: string) {
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await atribuirResponsavel(projetoId, responsavelId || null);
      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-pure-white p-6">
      <label className="flex flex-col gap-2">
        <span className="text-caption font-medium uppercase text-graphite">Status</span>
        <select
          value={statusAtual}
          disabled={pendente}
          onChange={(e) => mudarStatus(e.target.value as StatusProjeto)}
          className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
        >
          {statusOptions.map((s) => (
            <option key={s.valor} value={s.valor}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      {podeAtribuir && (
        <label className="flex flex-col gap-2">
          <span className="text-caption font-medium uppercase text-graphite">Responsável (produção)</span>
          <select
            value={responsavelAtualId ?? ""}
            disabled={pendente}
            onChange={(e) => mudarResponsavel(e.target.value)}
            className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
          >
            <option value="">Sem responsável</option>
            {producaoDisponivel.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </label>
      )}

      {erro && <p className="text-body-sm font-medium text-off-black-ink">{erro}</p>}
    </div>
  );
}

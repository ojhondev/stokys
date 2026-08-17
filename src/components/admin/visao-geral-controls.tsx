"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { atualizarVisaoGeral } from "@/lib/actions/briefing";

export function VisaoGeralControls({
  projetoId,
  prazoEstimadoDias,
  proximaAcao,
}: {
  projetoId: string;
  prazoEstimadoDias: number | null;
  proximaAcao: string | null;
}) {
  const router = useRouter();
  const [prazo, setPrazo] = useState(prazoEstimadoDias?.toString() ?? "");
  const [acao, setAcao] = useState(proximaAcao ?? "");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();

  function salvar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await atualizarVisaoGeral(projetoId, {
        prazoEstimadoDias: prazo.trim() ? Number(prazo) : null,
        proximaAcao: acao,
      });
      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }
      router.refresh();
    });
  }

  return (
    <form onSubmit={salvar} className="flex flex-col gap-4 rounded-3xl bg-pure-white p-6">
      <p className="text-caption font-medium uppercase text-graphite">
        Visão geral (visível pro cliente)
      </p>
      <label className="flex flex-col gap-2">
        <span className="text-body-sm font-medium text-off-black-ink">Prazo estimado (dias)</span>
        <input
          type="number"
          min={0}
          value={prazo}
          onChange={(e) => setPrazo(e.target.value)}
          className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-body-sm font-medium text-off-black-ink">Próxima ação necessária</span>
        <input
          type="text"
          value={acao}
          onChange={(e) => setAcao(e.target.value)}
          placeholder="Ex.: Aguardando aprovação da revisão v2"
          className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
        />
      </label>

      {erro && <p className="text-body-sm font-medium text-off-black-ink">{erro}</p>}

      <button
        type="submit"
        disabled={pendente}
        className="w-fit rounded-3xl bg-electric-lime pt-4 pb-4 pl-4 pr-3 text-body font-bold text-off-black-ink disabled:opacity-60"
      >
        {pendente ? "Salvando…" : "Salvar"}
      </button>
    </form>
  );
}

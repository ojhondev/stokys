"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { arquivarProjeto } from "@/lib/actions/admin";

export function ProjetoArquivarToggle({
  projetoId,
  arquivado,
}: {
  projetoId: string;
  arquivado: boolean;
}) {
  const router = useRouter();
  const [pendente, iniciarTransicao] = useTransition();

  function alternar() {
    const mensagem = arquivado
      ? "Restaurar esse projeto pra lista principal?"
      : "Arquivar esse projeto? Ele some da lista principal, mas continua salvo — dá pra restaurar depois.";
    if (!confirm(mensagem)) return;
    iniciarTransicao(async () => {
      await arquivarProjeto(projetoId, !arquivado);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={alternar}
      disabled={pendente}
      className="font-medium text-off-black-ink/60 hover:text-off-black-ink disabled:opacity-50"
    >
      {pendente ? "Aguarde…" : arquivado ? "Restaurar" : "Arquivar"}
    </button>
  );
}

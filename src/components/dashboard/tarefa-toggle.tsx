"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { concluirTarefa } from "@/lib/actions/tarefas";

export function TarefaToggle({
  tarefaId,
  concluida,
  interativa,
}: {
  tarefaId: string;
  concluida: boolean;
  interativa: boolean;
}) {
  const router = useRouter();
  const [pendente, iniciarTransicao] = useTransition();

  function alternar() {
    if (!interativa || pendente) return;
    iniciarTransicao(async () => {
      await concluirTarefa(tarefaId, !concluida);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={alternar}
      disabled={!interativa || pendente}
      aria-label={concluida ? "Marcar como pendente" : "Marcar como concluída"}
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-caption font-bold ${
        concluida
          ? "border-electric-lime bg-electric-lime text-off-black-ink"
          : "border-ash bg-pure-white text-transparent"
      } ${interativa ? "cursor-pointer" : "cursor-default opacity-70"}`}
    >
      ✓
    </button>
  );
}

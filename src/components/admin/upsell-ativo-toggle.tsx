"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { alternarUpsellAtivo } from "@/lib/actions/upsells";

export function UpsellAtivoToggle({ id, ativo }: { id: string; ativo: boolean }) {
  const router = useRouter();
  const [pendente, iniciarTransicao] = useTransition();

  function alternar() {
    iniciarTransicao(async () => {
      await alternarUpsellAtivo(id, !ativo);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={alternar}
      disabled={pendente}
      className={`rounded-full px-3 py-1 text-caption font-bold disabled:opacity-50 ${
        ativo ? "bg-electric-lime text-off-black-ink" : "bg-off-white-canvas text-graphite"
      }`}
    >
      {ativo ? "Ativo" : "Inativo"}
    </button>
  );
}

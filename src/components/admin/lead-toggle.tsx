"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { marcarLeadContatado } from "@/lib/actions/leads";

export function LeadToggle({ leadId, contatado }: { leadId: string; contatado: boolean }) {
  const router = useRouter();
  const [pendente, iniciarTransicao] = useTransition();

  function alternar() {
    if (pendente) return;
    iniciarTransicao(async () => {
      await marcarLeadContatado(leadId, !contatado);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={alternar}
      disabled={pendente}
      className={`rounded-full px-3 py-1 text-caption font-medium ${
        contatado
          ? "bg-electric-lime text-off-black-ink"
          : "bg-off-white-canvas text-graphite"
      } disabled:opacity-60`}
    >
      {contatado ? "Contatado" : "Marcar como contatado"}
    </button>
  );
}

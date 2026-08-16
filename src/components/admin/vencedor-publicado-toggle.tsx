"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { alternarVencedorPublicado } from "@/lib/actions/vencedor-da-semana";

export function VencedorPublicadoToggle({ id, publicado }: { id: string; publicado: boolean }) {
  const router = useRouter();
  const [pendente, iniciarTransicao] = useTransition();

  function alternar() {
    iniciarTransicao(async () => {
      await alternarVencedorPublicado(id, !publicado);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={alternar}
      disabled={pendente}
      className={`rounded-full px-3 py-1 text-caption font-bold disabled:opacity-50 ${
        publicado ? "bg-electric-lime text-off-black-ink" : "bg-off-white-canvas text-graphite"
      }`}
    >
      {publicado ? "Publicado" : "Rascunho"}
    </button>
  );
}

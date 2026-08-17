"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { atualizarStatusRevisao, criarComentarioRevisao } from "@/lib/actions/revisoes";

const labelStatus = {
  pendente: "Aguardando sua aprovação",
  aprovado: "Aprovado",
  mudancas_solicitadas: "Mudanças solicitadas",
} as const;

type Comentario = { id: string; texto: string; autorNome: string; criadoEm: Date };

export function RevisaoCard({
  revisaoId,
  titulo,
  linkOuArquivoUrl,
  status,
  criadoEm,
  comentarios,
  podeAprovar,
}: {
  revisaoId: string;
  titulo: string;
  linkOuArquivoUrl: string;
  status: "pendente" | "aprovado" | "mudancas_solicitadas";
  criadoEm: Date;
  comentarios: Comentario[];
  podeAprovar: boolean;
}) {
  const router = useRouter();
  const [comentario, setComentario] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();

  function decidir(novoStatus: "aprovado" | "mudancas_solicitadas") {
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await atualizarStatusRevisao(revisaoId, novoStatus);
      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }
      router.refresh();
    });
  }

  function enviarComentario(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await criarComentarioRevisao(revisaoId, comentario);
      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }
      setComentario("");
      router.refresh();
    });
  }

  return (
    <div className="rounded-3xl bg-pure-white p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-body-sm font-bold text-off-black-ink">{titulo}</p>
        <span
          className={`whitespace-nowrap rounded-full px-3 py-1 text-caption font-medium ${
            status === "aprovado"
              ? "bg-electric-lime text-off-black-ink"
              : "bg-off-white-canvas text-graphite"
          }`}
        >
          {labelStatus[status]}
        </span>
      </div>
      <p className="mt-1 text-caption text-graphite">{criadoEm.toLocaleDateString("pt-BR")}</p>

      <a
        href={linkOuArquivoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-body-sm font-medium text-off-black-ink underline"
      >
        Ver versão
      </a>

      {podeAprovar && status === "pendente" && (
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => decidir("aprovado")}
            disabled={pendente}
            className="rounded-3xl bg-electric-lime px-4 py-2.5 text-body-sm font-bold text-off-black-ink disabled:opacity-60"
          >
            Aprovar
          </button>
          <button
            type="button"
            onClick={() => decidir("mudancas_solicitadas")}
            disabled={pendente}
            className="rounded-3xl bg-off-white-canvas px-4 py-2.5 text-body-sm font-bold text-off-black-ink disabled:opacity-60"
          >
            Pedir mudanças
          </button>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2 border-t border-ash pt-4">
        {comentarios.map((c) => (
          <div key={c.id} className="text-body-sm">
            <span className="font-medium text-off-black-ink">{c.autorNome}: </span>
            <span className="text-graphite">{c.texto}</span>
          </div>
        ))}
        <form onSubmit={enviarComentario} className="mt-2 flex items-center gap-2">
          <input
            type="text"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Comentar essa versão…"
            className="flex-1 rounded-full border border-ash bg-off-white-canvas px-4 py-2 text-body-sm text-off-black-ink"
          />
          <button
            type="submit"
            disabled={pendente}
            className="rounded-full bg-off-white-canvas px-4 py-2 text-body-sm font-medium text-off-black-ink disabled:opacity-60"
          >
            Enviar
          </button>
        </form>
        {erro && <p className="text-body-sm font-medium text-off-black-ink">{erro}</p>}
      </div>
    </div>
  );
}

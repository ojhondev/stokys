"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { criarSolicitacao } from "@/lib/actions/solicitacoes";

export function SolicitacaoForm() {
  const router = useRouter();
  const [tipo, setTipo] = useState<"alteracao" | "informacao" | "conteudo">("alteracao");
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();

  function enviar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await criarSolicitacao(tipo, texto);
      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }
      setTexto("");
      router.refresh();
    });
  }

  return (
    <form onSubmit={enviar} className="mt-4 flex flex-col gap-4 rounded-3xl bg-pure-white p-6">
      <p className="text-caption font-medium uppercase text-graphite">Nova solicitação</p>
      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value as typeof tipo)}
        className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
      >
        <option value="alteracao">Pedir uma alteração</option>
        <option value="informacao">Enviar uma informação</option>
        <option value="conteudo">Solicitar novo conteúdo</option>
      </select>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={3}
        placeholder="Descreva o que você precisa..."
        className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
      />
      {erro && <p className="text-body-sm font-medium text-off-black-ink">{erro}</p>}
      <button
        type="submit"
        disabled={pendente}
        className="w-fit rounded-3xl bg-electric-lime pt-4 pb-4 pl-4 pr-3 text-body font-bold text-off-black-ink disabled:opacity-60"
      >
        {pendente ? "Enviando…" : "Enviar solicitação"}
      </button>
    </form>
  );
}

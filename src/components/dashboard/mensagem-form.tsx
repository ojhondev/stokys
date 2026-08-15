"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { enviarMensagem } from "@/lib/actions/mensagens";

export function MensagemForm({ projetoIdParaEquipe }: { projetoIdParaEquipe?: string }) {
  const router = useRouter();
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();

  function enviar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await enviarMensagem(texto, projetoIdParaEquipe);
      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }
      setTexto("");
      router.refresh();
    });
  }

  return (
    <div>
      <form onSubmit={enviar} className="mt-6 flex items-center gap-3 rounded-full bg-pure-white p-2">
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escreva uma mensagem…"
          className="flex-1 bg-transparent px-4 py-2 text-body text-off-black-ink outline-none"
        />
        <button
          type="submit"
          disabled={pendente}
          className="rounded-full bg-electric-lime px-5 py-2.5 text-body-sm font-medium text-off-black-ink disabled:opacity-60"
        >
          {pendente ? "Enviando…" : "Enviar"}
        </button>
      </form>
      {erro && <p className="mt-2 text-body-sm font-medium text-off-black-ink">{erro}</p>}
    </div>
  );
}

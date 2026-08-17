"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { atualizarDominio } from "@/lib/actions/loja";

export function DominioForm({ dominioAtual }: { dominioAtual: string }) {
  const router = useRouter();
  const [dominio, setDominio] = useState(dominioAtual);
  const [erro, setErro] = useState<string | null>(null);
  const [salvo, setSalvo] = useState(false);
  const [pendente, iniciarTransicao] = useTransition();

  function salvar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setSalvo(false);
    iniciarTransicao(async () => {
      const resultado = await atualizarDominio(dominio);
      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }
      setSalvo(true);
      router.refresh();
    });
  }

  return (
    <form onSubmit={salvar} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <label className="flex flex-1 flex-col gap-2">
        <span className="text-body-sm font-medium text-off-black-ink">Domínio da loja</span>
        <input
          type="text"
          value={dominio}
          onChange={(e) => setDominio(e.target.value)}
          placeholder="www.sualoja.com.br"
          className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
        />
      </label>
      <button
        type="submit"
        disabled={pendente}
        className="h-fit rounded-3xl bg-electric-lime pt-4 pb-4 pl-4 pr-3 text-body font-bold text-off-black-ink disabled:opacity-60"
      >
        {pendente ? "Salvando…" : "Salvar"}
      </button>
      {erro && <p className="text-body-sm font-medium text-off-black-ink">{erro}</p>}
      {salvo && <p className="text-body-sm font-medium text-off-black-ink">Salvo.</p>}
    </form>
  );
}

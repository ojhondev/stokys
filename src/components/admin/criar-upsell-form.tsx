"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { criarUpsell } from "@/lib/actions/upsells";

export function CriarUpsellForm() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();

  function criar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    iniciarTransicao(async () => {
      const valorCentavos = Math.round(Number(valor.replace(",", ".")) * 100);
      const resultado = await criarUpsell({ nome, descricao, valorCentavos });
      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }
      setNome("");
      setDescricao("");
      setValor("");
      router.refresh();
    });
  }

  return (
    <form onSubmit={criar} className="mt-6 flex flex-col gap-4 rounded-3xl bg-pure-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-body-sm font-medium text-off-black-ink">Nome</span>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-body-sm font-medium text-off-black-ink">Valor (R$)</span>
          <input
            type="text"
            inputMode="decimal"
            placeholder="197,00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
          />
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <span className="text-body-sm font-medium text-off-black-ink">Descrição</span>
        <input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
        />
      </label>

      {erro && <p className="text-body-sm font-medium text-off-black-ink">{erro}</p>}

      <Button type="submit" disabled={pendente} className="w-fit">
        {pendente ? "Criando…" : "Criar upsell"}
      </Button>
    </form>
  );
}

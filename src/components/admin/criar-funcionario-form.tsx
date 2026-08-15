"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { criarFuncionario } from "@/lib/actions/equipe";

export function CriarFuncionarioForm() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [papel, setPapel] = useState<"admin" | "producao">("producao");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();

  function criar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await criarFuncionario({ nome, email, senha, papel });
      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }
      setNome("");
      setEmail("");
      setSenha("");
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
          <span className="text-body-sm font-medium text-off-black-ink">E-mail</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-body-sm font-medium text-off-black-ink">Senha inicial</span>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-body-sm font-medium text-off-black-ink">Papel</span>
          <select
            value={papel}
            onChange={(e) => setPapel(e.target.value as "admin" | "producao")}
            className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
          >
            <option value="producao">Produção</option>
            <option value="admin">Admin</option>
          </select>
        </label>
      </div>

      {erro && <p className="text-body-sm font-medium text-off-black-ink">{erro}</p>}

      <Button type="submit" disabled={pendente} className="w-fit">
        {pendente ? "Criando…" : "Criar conta"}
      </Button>
    </form>
  );
}

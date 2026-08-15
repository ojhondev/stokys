"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { salvarAcessos } from "@/lib/actions/credenciais";

export function AcessosForm() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [salvo, setSalvo] = useState(false);
  const [pendente, iniciarTransicao] = useTransition();

  function salvar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setSalvo(false);
    iniciarTransicao(async () => {
      const resultado = await salvarAcessos(usuario, senha);
      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }
      setUsuario("");
      setSenha("");
      setSalvo(true);
      router.refresh();
    });
  }

  return (
    <form onSubmit={salvar} className="mt-8 flex flex-col gap-4 rounded-3xl bg-pure-white p-6">
      <label className="flex flex-col gap-2">
        <span className="text-body-sm font-medium text-off-black-ink">Usuário / e-mail de acesso</span>
        <input
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-body-sm font-medium text-off-black-ink">Senha</span>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
        />
      </label>

      <p className="text-caption text-graphite">
        Recomendamos desativar a autenticação de dois fatores durante a implementação, pra não
        travar a produção — pode reativar assim que a loja for entregue.
      </p>

      {erro && <p className="text-body-sm font-medium text-off-black-ink">{erro}</p>}

      <button
        type="submit"
        disabled={pendente}
        className="mt-2 w-fit rounded-3xl bg-electric-lime pt-4 pb-4 pl-4 pr-3 text-body font-bold text-off-black-ink disabled:opacity-60"
      >
        {pendente ? "Salvando…" : "Salvar acessos"}
      </button>

      {salvo && (
        <p className="text-body-sm font-medium text-off-black-ink">
          Acessos salvos — a produção foi avisada.
        </p>
      )}
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/components/auth/google-button";
import { criarConta, type CadastroState } from "@/lib/actions/cadastro";

const estadoInicial: CadastroState = {};

export function CadastroForm({
  tipo,
  next,
}: {
  tipo: "cliente" | "parceiro";
  next?: string;
}) {
  const [estado, formAction, pendente] = useActionState(criarConta, estadoInicial);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-4">
      <input type="hidden" name="tipo" value={tipo} />
      {next && <input type="hidden" name="next" value={next} />}

      <label className="flex flex-col gap-2">
        <span className="text-caption font-medium uppercase text-graphite">Nome</span>
        <input
          type="text"
          name="nome"
          required
          className="rounded-lg border border-ash bg-pure-white px-4 py-3 text-body text-off-black-ink"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-caption font-medium uppercase text-graphite">E-mail</span>
        <input
          type="email"
          name="email"
          required
          className="rounded-lg border border-ash bg-pure-white px-4 py-3 text-body text-off-black-ink"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-caption font-medium uppercase text-graphite">Senha</span>
        <input
          type="password"
          name="senha"
          required
          minLength={8}
          className="rounded-lg border border-ash bg-pure-white px-4 py-3 text-body text-off-black-ink"
        />
      </label>

      {estado.erro && <p className="text-body-sm font-medium text-off-black-ink">{estado.erro}</p>}

      <Button type="submit" disabled={pendente} className="mt-4">
        {pendente ? "Criando conta…" : "Criar conta"}
      </Button>

      <div className="mt-2 flex items-center gap-3 text-caption uppercase text-graphite">
        <span className="h-px flex-1 bg-ash" />
        ou
        <span className="h-px flex-1 bg-ash" />
      </div>

      <GoogleButton tipo={tipo} next={next} />
    </form>
  );
}

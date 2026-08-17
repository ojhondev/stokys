"use client";

import { useActionState, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/components/auth/google-button";
import { CampoSenha } from "@/components/auth/campo-senha";
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
  const [erroLocal, setErroLocal] = useState<string | null>(null);
  const confirmarSenhaRef = useRef<HTMLInputElement>(null);
  const senhaRef = useRef<HTMLInputElement>(null);

  function validarAntesDeEnviar(e: FormEvent<HTMLFormElement>) {
    const senha = senhaRef.current?.value ?? "";
    const confirmar = confirmarSenhaRef.current?.value ?? "";
    if (senha !== confirmar) {
      e.preventDefault();
      setErroLocal("As senhas não coincidem.");
      return;
    }
    setErroLocal(null);
  }

  return (
    <form action={formAction} onSubmit={validarAntesDeEnviar} className="mt-8 flex flex-col gap-5">
      <input type="hidden" name="tipo" value={tipo} />
      {next && <input type="hidden" name="next" value={next} />}

      <label className="flex flex-col gap-2">
        <span className="text-caption font-medium uppercase text-graphite">Nome completo</span>
        <input
          type="text"
          name="nome"
          required
          autoComplete="name"
          className="rounded-lg border border-ash bg-pure-white px-4 py-3 text-body text-off-black-ink"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-caption font-medium uppercase text-graphite">E-mail</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="rounded-lg border border-ash bg-pure-white px-4 py-3 text-body text-off-black-ink"
        />
      </label>

      <CampoSenha
        label="Crie uma senha"
        name="senha"
        minLength={8}
        autoComplete="new-password"
        inputRef={senhaRef}
      />
      <p className="-mt-3 text-caption text-graphite">Mínimo de 8 caracteres.</p>

      <CampoSenha
        label="Confirmar senha"
        name="confirmarSenha"
        minLength={8}
        autoComplete="new-password"
        inputRef={confirmarSenhaRef}
      />

      {tipo === "cliente" && (
        <>
          <div className="border-t border-ash pt-5" />
          <label className="flex flex-col gap-2">
            <span className="text-caption font-medium uppercase text-graphite">Nome da loja</span>
            <input
              type="text"
              name="nomeDaLoja"
              required
              placeholder="Minha loja"
              className="rounded-lg border border-ash bg-pure-white px-4 py-3 text-body text-off-black-ink"
            />
          </label>
        </>
      )}

      {(erroLocal || estado.erro) && (
        <p className="text-body-sm font-medium text-off-black-ink">{erroLocal ?? estado.erro}</p>
      )}

      <Button type="submit" disabled={pendente} className="mt-2 w-full justify-center">
        {pendente ? "Criando conta…" : "Cadastrar"}
      </Button>

      <div className="flex items-center gap-3 text-caption uppercase text-graphite">
        <span className="h-px flex-1 bg-ash" />
        ou
        <span className="h-px flex-1 bg-ash" />
      </div>

      <GoogleButton tipo={tipo} next={next} />
    </form>
  );
}

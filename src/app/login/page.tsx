"use client";

import { Suspense, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/components/auth/google-button";
import { login, type LoginState } from "@/lib/actions/auth";

const estadoInicial: LoginState = {};

const labelErroGoogle: Record<string, string> = {
  google: "Não foi possível entrar com o Google. Tente de novo.",
  google_expirado: "Essa tentativa de login expirou. Tente de novo.",
  google_email_nao_verificado:
    "Já existe conta com esse e-mail. Entre com sua senha e confirme o e-mail antes de usar o Google.",
};

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";
  const erroGoogle = searchParams.get("erro");
  const [estado, formAction, pendente] = useActionState(login, estadoInicial);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />

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
          className="rounded-lg border border-ash bg-pure-white px-4 py-3 text-body text-off-black-ink"
        />
      </label>

      {estado.erro && <p className="text-body-sm font-medium text-off-black-ink">{estado.erro}</p>}
      {!estado.erro && erroGoogle && (
        <p className="text-body-sm font-medium text-off-black-ink">
          {labelErroGoogle[erroGoogle] ?? "Não foi possível entrar com o Google."}
        </p>
      )}

      <Button type="submit" disabled={pendente} className="mt-4">
        {pendente ? "Entrando…" : "Entrar"}
      </Button>

      <div className="mt-2 flex items-center gap-3 text-caption uppercase text-graphite">
        <span className="h-px flex-1 bg-ash" />
        ou
        <span className="h-px flex-1 bg-ash" />
      </div>

      <GoogleButton next={next} />

      <p className="mt-2 text-center text-body-sm text-graphite">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-medium text-off-black-ink underline">
          Criar conta
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-off-white-canvas px-6 py-14 sm:px-10 lg:px-16">
      <div className="w-full max-w-[400px] rounded-3xl bg-pure-white p-10">
        <Link href="/" className="text-body font-medium text-off-black-ink">
          Stokys
        </Link>
        <h1 className="mt-8 text-heading font-heading font-bold text-off-black-ink">
          Acessar minha conta
        </h1>
        <p className="mt-2 text-body-sm text-graphite">
          Cliente, produção, admin ou parceiro — mesmo login, acesso por papel.
        </p>

        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}

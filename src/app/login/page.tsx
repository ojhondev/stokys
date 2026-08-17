"use client";

import { Suspense, useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/components/auth/google-button";
import { CampoSenha } from "@/components/auth/campo-senha";
import { login, type LoginState } from "@/lib/actions/auth";

const estadoInicial: LoginState = {};

const labelErroGoogle: Record<string, string> = {
  google: "Não foi possível entrar com o Google. Tente de novo.",
  google_expirado: "Essa tentativa de login expirou. Tente de novo.",
  google_email_nao_verificado:
    "Já existe conta com esse e-mail. Entre com sua senha e confirme o e-mail antes de usar o Google.",
  google_nao_configurado: "Login com Google ainda não está disponível — entre com e-mail e senha.",
};

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";
  const erroGoogle = searchParams.get("erro");
  const [estado, formAction, pendente] = useActionState(login, estadoInicial);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />

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

      <CampoSenha label="Senha" name="senha" autoComplete="current-password" />

      {estado.erro && <p className="text-body-sm font-medium text-off-black-ink">{estado.erro}</p>}
      {!estado.erro && erroGoogle && (
        <p className="text-body-sm font-medium text-off-black-ink">
          {labelErroGoogle[erroGoogle] ?? "Não foi possível entrar com o Google."}
        </p>
      )}

      <Button type="submit" disabled={pendente} className="mt-2 w-full justify-center">
        {pendente ? "Entrando…" : "Entrar"}
      </Button>

      <div className="flex items-center gap-3 text-caption uppercase text-graphite">
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
      <div className="w-full max-w-[440px] rounded-3xl bg-pure-white p-10">
        <div className="flex flex-col items-center text-center">
          <Link href="/">
            <Image src="/logo-stokys.png" alt="Stokys" width={125} height={28} className="h-7 w-auto" />
          </Link>
          <h1 className="mt-8 text-heading-lg font-heading font-bold text-off-black-ink">
            Acessar minha conta
          </h1>
          <p className="mt-2 text-body-sm text-graphite">
            Cliente, produção, admin ou parceiro — mesmo login, acesso por papel.
          </p>
        </div>

        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}

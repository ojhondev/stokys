import { Suspense } from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { usuarios } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ReenviarVerificacaoButton } from "@/components/auth/reenviar-verificacao-button";

const labelErro = {
  invalido: "Link inválido.",
  expirado: "Esse link expirou — peça um novo abaixo.",
  usado: "Esse link já foi usado.",
} as const;

export default async function VerificarEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  const sessao = await getSession();

  let email: string | null = null;
  if (sessao) {
    const [usuario] = await getDb()
      .select({ email: usuarios.email })
      .from(usuarios)
      .where(eq(usuarios.id, sessao.userId))
      .limit(1);
    email = usuario?.email ?? null;
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-off-white-canvas px-6 py-14 sm:px-10 lg:px-16">
      <div className="w-full max-w-[400px] rounded-3xl bg-pure-white p-10 text-center">
        <Link href="/" className="text-body font-medium text-off-black-ink">
          Stokys
        </Link>
        <h1 className="mt-8 text-heading font-heading font-bold text-off-black-ink">
          Confirme seu e-mail
        </h1>
        <p className="mt-2 text-body-sm text-graphite">
          {email
            ? `Mandamos um link de confirmação pra ${email}.`
            : "Mandamos um link de confirmação pro seu e-mail."}
        </p>

        {erro && (
          <p className="mt-4 text-body-sm font-medium text-off-black-ink">
            {labelErro[erro as keyof typeof labelErro] ?? "Não foi possível confirmar."}
          </p>
        )}

        {sessao ? (
          <Suspense>
            <ReenviarVerificacaoButton />
          </Suspense>
        ) : (
          <Link
            href="/login"
            className="mt-6 inline-block text-body-sm font-medium text-off-black-ink underline"
          >
            Entrar
          </Link>
        )}
      </div>
    </main>
  );
}

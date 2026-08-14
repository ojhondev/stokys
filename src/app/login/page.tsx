import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-off-white-canvas px-6 py-14 sm:px-10 lg:px-16">
      <div className="w-full max-w-[400px] rounded-3xl bg-pure-white p-10">
        <Link href="/" className="text-body font-medium text-off-black-ink">
          Stokys
        </Link>
        <h1 className="mt-8 text-heading font-heading font-bold text-off-black-ink">Acessar minha conta</h1>
        <p className="mt-2 text-body-sm text-graphite">
          Cliente, produção, admin ou parceiro — mesmo login, acesso por papel.
        </p>

        {/* TODO (Fase 0): ligar a um Server Action que usa src/lib/auth.ts
            (verifyPassword + createSession) assim que o Neon estiver provisionado. */}
        <form className="mt-8 flex flex-col gap-4">
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

          <Button type="submit" className="mt-4">
            Entrar
          </Button>
        </form>
      </div>
    </main>
  );
}

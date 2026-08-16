import { eq } from "drizzle-orm";
import { AppShell } from "@/components/app/app-shell";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { usuarios } from "@/lib/db/schema";
import { ReenviarVerificacaoButton } from "@/components/auth/reenviar-verificacao-button";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const sessao = await getSession();

  // emailVerificado nunca vai pro cookie de sessão (ver src/lib/auth.ts) —
  // lido do banco aqui pra decidir se mostra o aviso.
  let emailVerificado = true;
  if (sessao) {
    const [usuario] = await getDb()
      .select({ emailVerificado: usuarios.emailVerificado })
      .from(usuarios)
      .where(eq(usuarios.id, sessao.userId))
      .limit(1);
    emailVerificado = usuario?.emailVerificado ?? true;
  }

  return (
    <AppShell>
      {!emailVerificado && (
        <div className="mb-6 flex flex-col items-start gap-3 rounded-2xl bg-off-white-canvas p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body-sm font-medium text-off-black-ink">
            Confirme seu e-mail pra liberar o pagamento — mandamos um link pra sua caixa de entrada.
          </p>
          <ReenviarVerificacaoButton className="flex shrink-0 items-center gap-3" />
        </div>
      )}
      {children}
    </AppShell>
  );
}

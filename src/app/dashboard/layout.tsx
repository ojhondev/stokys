import { eq } from "drizzle-orm";
import { AppShell } from "@/components/app/app-shell";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { usuarios } from "@/lib/db/schema";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const sessao = await getSession();

  // emailVerificado nunca vai pro cookie de sessão (ver src/lib/auth.ts) —
  // lido do banco aqui pra decidir se mostra o aviso (faixa fixa no topo,
  // ver components/app/app-shell.tsx).
  let emailVerificado = true;
  let nomeDaLoja: string | null = null;
  if (sessao) {
    const [usuario] = await getDb()
      .select({ emailVerificado: usuarios.emailVerificado, nomeDaLoja: usuarios.nomeDaLoja })
      .from(usuarios)
      .where(eq(usuarios.id, sessao.userId))
      .limit(1);
    emailVerificado = usuario?.emailVerificado ?? true;
    nomeDaLoja = usuario?.nomeDaLoja ?? null;
  }

  return (
    <AppShell nomeDaLoja={nomeDaLoja} emailVerificado={emailVerificado}>
      {children}
    </AppShell>
  );
}

import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { logout } from "@/lib/actions/auth";

// Painel interno (admin/produção) — ver docs/PRD.md 4.5. Guarda de sessão aqui
// é defesa em profundidade além do middleware (src/middleware.ts).
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const sessao = await getSession();
  if (!sessao || !["master", "admin", "producao"].includes(sessao.papel)) {
    redirect("/login?next=/admin");
  }

  return (
    <div className="flex min-h-screen flex-col bg-off-white-canvas">
      <header className="flex items-center justify-between border-b border-ash bg-pure-white px-6 py-4 sm:px-10">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-body font-heading font-bold text-off-black-ink">
            Stokys — Operação
          </Link>
          <nav className="hidden items-center gap-4 sm:flex">
            <Link
              href="/admin"
              className="text-body-sm font-medium text-graphite hover:text-off-black-ink"
            >
              Projetos
            </Link>
            {["master", "admin"].includes(sessao.papel) && (
              <Link
                href="/admin/upsells"
                className="text-body-sm font-medium text-graphite hover:text-off-black-ink"
              >
                Upsells
              </Link>
            )}
            {["master", "admin"].includes(sessao.papel) && (
              <Link
                href="/admin/vencedor-da-semana"
                className="text-body-sm font-medium text-graphite hover:text-off-black-ink"
              >
                Vencedor da Semana
              </Link>
            )}
            {sessao.papel === "master" && (
              <Link
                href="/admin/equipe"
                className="text-body-sm font-medium text-graphite hover:text-off-black-ink"
              >
                Equipe
              </Link>
            )}
          </nav>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="text-body-sm font-medium text-graphite hover:text-off-black-ink"
          >
            Sair
          </button>
        </form>
      </header>

      <main className="flex-1 px-6 py-10 sm:px-10">{children}</main>
    </div>
  );
}

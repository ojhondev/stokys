import Link from "next/link";
import { IconSair } from "@/components/app/icons";
import { logout } from "@/lib/actions/auth";

// Área do parceiro é uma página só por enquanto (status + perfil da
// vitrine) — não precisa da sidebar multi-item do AppShell do cliente.
export default function ParceiroLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-off-white-canvas">
      <header className="flex items-center justify-between border-b border-ash bg-pure-white px-6 py-4 sm:px-10">
        <Link href="/parceiro" className="text-body font-heading font-bold text-off-black-ink">
          Stokys <span className="font-medium text-graphite">· Parceiro</span>
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-body-sm font-medium text-graphite hover:bg-off-white-canvas"
          >
            <IconSair className="h-5 w-5" />
            Sair
          </button>
        </form>
      </header>

      <main className="flex-1 px-6 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-[640px]">{children}</div>
      </main>
    </div>
  );
}

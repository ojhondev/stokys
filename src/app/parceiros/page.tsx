import Link from "next/link";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

// Vitrine de parceiros (agências de tráfego pago) — ver docs/PRD.md, seção 4.6.
// Cadastro real entra na Fase 3 do roadmap (seção 9); por ora, estado vazio.

export default function ParceirosPage() {
  return (
    <>
      <SiteHeader />

      <main className="flex flex-1 flex-col bg-off-white-canvas px-6 py-20">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-start rounded-3xl bg-pure-white p-12">
          <span className="text-caption font-medium uppercase text-graphite">Parceiros</span>
          <h1 className="mt-3 max-w-[520px] text-heading font-heading font-medium text-off-black-ink">
            A vitrine de parceiros ainda está sendo montada.
          </h1>
          <p className="mt-4 max-w-[480px] text-body-sm text-graphite">
            Em breve, agências de performance e tráfego pago cadastradas aqui, com contato direto
            pelo WhatsApp. Se você já é cliente Stokys, fale com a produção do seu projeto.
          </p>
          <Link href="/" className="mt-8 text-body-sm font-medium text-off-black-ink underline">
            Voltar para a página inicial
          </Link>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

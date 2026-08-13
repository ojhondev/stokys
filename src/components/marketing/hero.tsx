import { LinkButton } from "@/components/ui/button";

// Mockup abstrato da loja em produção — não é screenshot real do produto (ainda não
// existe). Substituir por preview real assim que a área de preview (PRD 4.4) existir.
function StoreMockup() {
  return (
    <div className="w-full max-w-[420px] rounded-3xl bg-pure-white p-4">
      <div className="flex items-center gap-1.5 px-2 pb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-ash" />
        <span className="h-2.5 w-2.5 rounded-full bg-ash" />
        <span className="h-2.5 w-2.5 rounded-full bg-ash" />
      </div>
      <div className="rounded-2xl bg-electric-lime p-6">
        <div className="h-2 w-20 rounded-full bg-off-black-ink/20" />
        <div className="mt-3 h-3 w-36 rounded-full bg-off-black-ink/30" />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <div className="aspect-square rounded-2xl bg-off-white-canvas" />
        <div className="aspect-square rounded-2xl bg-off-white-canvas" />
        <div className="aspect-square rounded-2xl bg-off-white-canvas" />
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="bg-off-white-canvas px-6 pb-20 pt-16 md:pb-24">
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-12 md:grid-cols-2">
        <div className="flex flex-col items-start">
          <span className="rounded-full bg-pure-white px-3 py-1 text-caption font-medium uppercase text-off-black-ink">
            Agência de dropshipping
          </span>
          <h1 className="mt-6 max-w-[520px] text-heading-lg font-medium text-off-black-ink">
            Sua loja pronta, sem virar mais um projeto parado no WhatsApp.
          </h1>
          <p className="mt-6 max-w-[480px] text-body text-graphite">
            Escolha um plano, pague dentro da plataforma e acompanhe cada etapa da
            produção da sua loja de dropshipping — do onboarding até a entrega.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <LinkButton href="/onboarding">Montar minha loja</LinkButton>
            <LinkButton href="#como-funciona" variant="ghost">
              Ver como funciona
            </LinkButton>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <StoreMockup />
        </div>
      </div>
    </section>
  );
}

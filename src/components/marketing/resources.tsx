import { LinkButton } from "@/components/ui/button";

// Mesmo padrão da seção "Let's get to work" da perk.com (3 cards de conteúdo de apoio).

const recursos = [
  {
    heading: "Como funciona o onboarding",
    descricao: "Passo a passo de como escolher o plano, informar acessos e pagar.",
    ctaLabel: "Ver onboarding",
    ctaHref: "/onboarding",
  },
  {
    heading: "Dúvidas sobre os planos",
    descricao: "O que muda entre Zen, Pro e Customizado, item por item.",
    ctaLabel: "Comparar planos",
    ctaHref: "#planos",
  },
  {
    heading: "Fale com um parceiro",
    descricao: "Agências de tráfego pago pra vender depois que a loja tá no ar.",
    ctaLabel: "Ver parceiros",
    ctaHref: "/parceiros",
  },
];

export function Resources() {
  return (
    <section className="bg-pure-white px-6 sm:px-10 lg:px-16 py-14 md:py-16">
      <div className="mx-auto w-full max-w-[1800px]">
        <h2 className="text-heading font-heading font-medium text-off-black-ink">Vamos pra prática.</h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {recursos.map((recurso) => (
            <div key={recurso.heading} className="rounded-3xl bg-off-white-canvas p-8">
              <h3 className="text-subheading font-heading font-medium text-off-black-ink">
                {recurso.heading}
              </h3>
              <p className="mt-3 text-body-sm text-graphite">{recurso.descricao}</p>
              <LinkButton href={recurso.ctaHref} variant="ghost" className="mt-6 -ml-4">
                {recurso.ctaLabel}
              </LinkButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

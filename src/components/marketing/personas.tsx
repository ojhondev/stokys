import { LinkButton } from "@/components/ui/button";

// Mesmo padrão da seção de personas da perk.com (Finance teams / Travel managers /
// Operations / Travelers) — aqui adaptado pros diferentes momentos de quem procura
// a Stokys, em vez de papéis internos de uma empresa.

const personas = [
  {
    eyebrow: "Quem tá começando",
    heading: "Sua primeira loja, sem aprender a mexer em nada técnico",
    descricao: "O plano Zen entrega o essencial: tema, produtos e banners prontos.",
    ctaLabel: "Conhecer o plano Zen",
    ctaHref: "/onboarding?plano=zen",
  },
  {
    eyebrow: "Quem já vende",
    heading: "Quer profissionalizar sem recomeçar do zero",
    descricao: "O plano Pro adiciona página de política, rastreio e mais categorias.",
    ctaLabel: "Conhecer o plano Pro",
    ctaHref: "/onboarding?plano=pro",
  },
  {
    eyebrow: "Quem quer sob medida",
    heading: "Marca própria, mercado definido, loja customizada",
    descricao: "Logotipo, paleta de cores e template para Brasil, Global ou Latam.",
    ctaLabel: "Conhecer o Customizado",
    ctaHref: "/onboarding?plano=customizado",
  },
  {
    eyebrow: "Quem quer tráfego",
    heading: "Loja pronta é só metade do caminho",
    descricao: "Depois da entrega, acesse a vitrine de parceiros de tráfego pago.",
    ctaLabel: "Ver parceiros",
    ctaHref: "/parceiros",
  },
];

export function Personas() {
  return (
    <section id="como-funciona" className="bg-pure-white px-6 py-20 md:py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        <h2 className="max-w-[600px] text-heading font-heading font-medium text-off-black-ink">
          Simples pra você. Direto pra quem produz.
        </h2>
        <p className="mt-4 max-w-[520px] text-body text-graphite">
          Seja qual for o seu momento, a Stokys tem um caminho pronto.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {personas.map((persona) => (
            <div key={persona.eyebrow} className="rounded-3xl bg-off-white-canvas p-10">
              <span className="text-caption font-medium uppercase text-graphite">
                {persona.eyebrow}
              </span>
              <h3 className="mt-3 text-subheading font-heading font-medium text-off-black-ink">
                {persona.heading}
              </h3>
              <p className="mt-3 text-body-sm text-graphite">{persona.descricao}</p>
              <LinkButton href={persona.ctaHref} variant="ghost" className="mt-6 -ml-4">
                {persona.ctaLabel}
              </LinkButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

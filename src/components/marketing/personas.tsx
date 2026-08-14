import Image from "next/image";
import { LinkButton } from "@/components/ui/button";

// Mesmo padrão da seção de personas da perk.com: título centralizado maior, cards
// com categoria + título + subtexto + CTA à esquerda e imagem à direita, efeito de
// scroll onde cada card fixa e o próximo sobe por cima (stacking via position: sticky).

const personas = [
  {
    categoria: "Padrão profissional",
    titulo: "Nada de lojas amadoras",
    subtexto:
      "Sua loja sai com cara de marca que já vende de verdade — nada de tema genérico mal ajustado.",
    ctaLabel: "Ver planos",
    ctaHref: "#planos",
    imagem: "/persona-1.webp",
  },
  {
    categoria: "Identidade",
    titulo: "Material desenvolvido do zero, para sua marca",
    subtexto:
      "Banners, categorias e paleta pensados pro seu nicho — não é um template reaproveitado de outro cliente.",
    ctaLabel: "Conhecer o Customizado",
    ctaHref: "/onboarding?plano=customizado",
    imagem: "/persona-2.webp",
  },
  {
    categoria: "Acompanhamento",
    titulo: "Equipe e suporte do começo ao fim",
    subtexto:
      "Da produção ao pós-entrega, você fala direto com quem tá montando sua loja — sem fila de suporte genérico.",
    ctaLabel: "Ver mensageria",
    ctaHref: "/dashboard/mensagens",
    imagem: "/persona-3.webp",
  },
  {
    categoria: "Painel",
    titulo: "Controle total pelo app. Do começo ao fim do projeto",
    subtexto: "Status, pagamentos, preview e mensagens — tudo no seu dashboard, direto do celular.",
    ctaLabel: "Ver dashboard",
    ctaHref: "/dashboard",
    imagem: "/persona-4.png",
  },
];

export function Personas() {
  return (
    <section className="bg-pure-white px-6 py-14 sm:px-10 md:py-24 lg:px-16">
      <div className="mx-auto w-full max-w-[1800px]">
        <h2 className="mx-auto max-w-[720px] text-center text-heading-lg font-heading font-bold text-off-black-ink">
          O dropshipping evoluiu, e você também precisa evoluir.
        </h2>

        <div className="relative mt-16">
          {personas.map((persona, i) => (
            <div
              key={persona.titulo}
              className="sticky top-20 flex min-h-[46vh] items-center"
              style={{ zIndex: i + 1 }}
            >
              <div className="grid w-full items-center gap-8 rounded-3xl bg-off-white-canvas p-8 transition-transform duration-200 hover:scale-[1.015] md:grid-cols-2 md:p-10">
                <div>
                  <span className="text-caption font-bold uppercase text-graphite">
                    {persona.categoria}
                  </span>
                  <h3 className="mt-2 text-subheading font-heading font-bold text-off-black-ink">
                    {persona.titulo}
                  </h3>
                  <p className="mt-3 max-w-[380px] text-body-sm text-graphite">
                    {persona.subtexto}
                  </p>
                  <LinkButton href={persona.ctaHref} variant="outline" className="mt-6">
                    {persona.ctaLabel}
                  </LinkButton>
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={persona.imagem}
                    alt={persona.titulo}
                    fill
                    sizes="(min-width: 768px) 40vw, 90vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

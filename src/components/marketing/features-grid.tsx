"use client";

import { useRef, useState } from "react";

// Carrossel de features — mesmo padrão da seção "100,000 tasks handled everyday"
// da perk.com (card com badge, mockup, heading, descrição e link "Read more",
// navegação por pontos + setas). Mockup genérico por enquanto, a pedido do usuário.

const features = [
  { eyebrow: "Acessos protegidos", heading: "Credenciais tratadas como segredo", descricao: "Criptografadas em repouso e revogadas assim que a loja é entregue." },
  { eyebrow: "Preview em tempo real", heading: "Acompanhe a loja sendo montada", descricao: "Cada snapshot da produção aparece direto no seu dashboard." },
  { eyebrow: "Mensageria direta", heading: "Fale com quem tá produzindo", descricao: "Sem sair da plataforma, sem esperar resposta no WhatsApp." },
  { eyebrow: "Cobrança na plataforma", heading: "PIX, cartão ou boleto", descricao: "Sem link externo, sem intermediário — tudo dentro da Stokys." },
  { eyebrow: "Escopo fechado", heading: "Você sabe o que está pagando", descricao: "Zen, Pro ou Customizado — sem surpresa depois que o pedido fecha." },
  { eyebrow: "Parceiros de tráfego", heading: "Loja pronta é só o começo", descricao: "Vitrine de agências parceiras pra vender depois da entrega." },
  { eyebrow: "Suporte pós-entrega", heading: "Acompanhamento contínuo", descricao: "A loja publicada não é ponto final — a gente continua por perto." },
];

function FeatureMockup() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className={`aspect-square rounded-lg ${
            [5, 6, 9, 10, 13, 14].includes(i) ? "bg-electric-lime/60" : "bg-pure-white"
          }`}
        />
      ))}
    </div>
  );
}

export function FeaturesGrid() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);

  function irPara(index: number) {
    const alvo = Math.max(0, Math.min(index, features.length - 1));
    const el = scrollerRef.current;
    const card = el?.children[alvo] as HTMLElement | undefined;
    if (el && card) {
      el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
    }
    setAtivo(alvo);
  }

  return (
    <section className="bg-off-white-canvas py-14 md:py-16">
      <div className="mx-auto w-full max-w-[1800px] px-6 sm:px-10 lg:px-16">
        <span className="text-caption font-medium uppercase text-graphite">
          Por dentro da plataforma
        </span>
        <h2 className="mt-3 max-w-[560px] text-heading font-heading font-bold text-off-black-ink">
          Cada detalhe do processo, resolvido em um lugar só.
        </h2>
      </div>

      <div
        ref={scrollerRef}
        className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-6 pb-4 sm:px-10 lg:px-16 [&::-webkit-scrollbar]:hidden"
      >
        {features.map((feature, i) => (
          <div
            key={feature.heading}
            className={`flex w-[85vw] shrink-0 snap-center flex-col justify-between rounded-3xl bg-pure-white p-8 sm:w-[420px] ${
              i === ativo ? "outline outline-2 outline-electric-lime" : ""
            }`}
          >
            <span className="w-fit rounded-full border border-ash px-3 py-1 text-caption font-medium uppercase text-graphite">
              + {feature.eyebrow}
            </span>

            <div className="my-8">
              <FeatureMockup />
            </div>

            <div>
              <h3 className="text-subheading font-heading font-bold text-off-black-ink">
                {feature.heading}
              </h3>
              <p className="mt-2 text-body-sm text-graphite">{feature.descricao}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-6 flex w-full max-w-[1800px] items-center justify-between px-6 sm:px-10 lg:px-16">
        <div className="flex items-center gap-2">
          {features.map((feature, i) => (
            <button
              key={feature.heading}
              type="button"
              aria-label={`Ir para ${feature.eyebrow}`}
              onClick={() => irPara(i)}
              className={`h-2 rounded-full transition-all ${
                i === ativo ? "w-6 bg-off-black-ink" : "w-2 bg-ash"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => irPara(ativo - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ash text-body text-off-black-ink"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Próximo"
            onClick={() => irPara(ativo + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ash text-body text-off-black-ink"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

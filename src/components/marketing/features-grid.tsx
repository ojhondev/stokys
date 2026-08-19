"use client";

import { useRef, useState } from "react";

// Carrossel de features — mesmo padrão da seção "100,000 tasks handled everyday"
// da perk.com (card com badge, mockup, heading, descrição e link "Read more",
// navegação por pontos + setas). Mockup genérico por enquanto, a pedido do usuário.

// Cada card tem uma mini-animação temática representando o recurso — não é
// mais o mesmo mockup genérico repetido (pedido do usuário).

function MockupTransparencia() {
  return (
    <div className="relative flex aspect-square w-32 items-center justify-center rounded-2xl bg-off-white-canvas sm:w-40">
      <svg viewBox="0 0 48 48" fill="none" className="h-16 w-16 sm:h-20 sm:w-20" aria-hidden>
        <path
          d="M13 6h22v34l-4-3-4 3-4-3-4 3-4-3-4 3-2-1.5V6Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          className="text-off-black-ink"
        />
        <path
          d="M18 15h12M18 21h12M18 27h7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-off-black-ink"
        />
      </svg>
      <span className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-electric-lime text-caption font-bold text-off-black-ink sm:bottom-4 sm:right-4">
        ✓
      </span>
    </div>
  );
}

function MockupAcompanhamento() {
  return (
    <div className="relative flex aspect-square w-32 items-center justify-center rounded-2xl bg-off-white-canvas sm:w-40">
      <svg viewBox="0 0 48 48" fill="none" className="h-16 w-16 sm:h-20 sm:w-20" aria-hidden>
        <path
          d="M24 8a13 13 0 0 0-13 13c0 5.2-1.2 8.4-2.6 10.4-.5.7 0 1.6.8 1.6h29.6c.8 0 1.3-.9.8-1.6-1.4-2-2.6-5.2-2.6-10.4A13 13 0 0 0 24 8Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          className="text-off-black-ink"
        />
        <path
          d="M19 38a5 5 0 0 0 10 0"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-off-black-ink"
        />
      </svg>
      <span className="absolute right-3 top-3 flex h-5 w-5 animate-ping items-center justify-center rounded-full bg-electric-lime sm:right-4 sm:top-4" />
      <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-electric-lime sm:right-4 sm:top-4" />
    </div>
  );
}

function MockupResultado() {
  return (
    <div className="relative flex aspect-square w-32 items-center justify-center rounded-2xl bg-off-white-canvas sm:w-40">
      <svg viewBox="0 0 48 48" fill="none" className="h-16 w-16 sm:h-20 sm:w-20" aria-hidden>
        <path
          d="M12 16h24l-2 22H14l-2-22Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          className="text-off-black-ink"
        />
        <path
          d="M17 16v-3a7 7 0 0 1 14 0v3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-off-black-ink"
        />
      </svg>
      <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-electric-lime sm:bottom-4 sm:right-4">
        <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden>
          <path d="m3 8.5 3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-off-black-ink" />
        </svg>
      </span>
    </div>
  );
}

function MockupPainel() {
  return (
    <div className="relative flex aspect-square w-32 items-center justify-center rounded-2xl bg-off-white-canvas sm:w-40">
      <svg viewBox="0 0 48 48" fill="none" className="h-16 w-16 sm:h-20 sm:w-20" aria-hidden>
        <rect x="7" y="9" width="34" height="24" rx="3" stroke="currentColor" strokeWidth="2" className="text-off-black-ink" />
        <path d="M14 39h20M24 33v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-off-black-ink" />
        <path d="M13 25l6-6 5 5 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-off-black-ink" />
      </svg>
      <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-electric-lime sm:right-4 sm:top-4" />
    </div>
  );
}

const features = [
  {
    eyebrow: "Loja",
    heading: "Lojas prontas ou personalizadas",
    descricao: "Escolha um dos nossos temas prontos pra vender ou peça uma loja com identidade visual própria, no plano Elite.",
    Mockup: MockupResultado,
  },
  {
    eyebrow: "Orçamento",
    heading: "Orçamento simples e objetivo",
    descricao: "O valor do seu plano já é o valor final — sem taxa escondida nem surpresa depois que o pagamento cai.",
    Mockup: MockupTransparencia,
  },
  {
    eyebrow: "Suporte",
    heading: "Suporte em todas as etapas",
    descricao: "Da produção até a entrega, você fala direto com o nosso time — nada de chatbot ou fila de ticket.",
    Mockup: MockupAcompanhamento,
  },
  {
    eyebrow: "Painel",
    heading: "Área do Cliente",
    descricao: "Acompanhe cada etapa da produção da sua loja em tempo real, direto pelo seu painel exclusivo.",
    Mockup: MockupPainel,
  },
];

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
    <section id="como-funciona" className="bg-off-white-canvas py-14 md:py-16">
      <div className="mx-auto w-full max-w-[1800px] px-6 sm:px-10 lg:px-16">
        <span className="text-caption font-medium uppercase text-graphite">
          Como a Stokys funciona
        </span>
        <h2 className="mt-3 max-w-[560px] text-heading font-heading font-bold text-off-black-ink">
          A Stokys não é apenas mais uma agência de dropshipping.
        </h2>
      </div>

      <div
        ref={scrollerRef}
        className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-6 pb-4 sm:px-10 lg:px-16 [&::-webkit-scrollbar]:hidden"
      >
        {features.map((feature, i) => (
          <div
            key={feature.heading}
            className={`flex aspect-[2/1] w-[90vw] shrink-0 snap-center flex-col justify-between rounded-3xl bg-pure-white p-8 transition-transform duration-200 hover:scale-[1.02] sm:w-[640px] ${
              i === ativo ? "outline outline-2 outline-electric-lime" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-6">
              <span className="w-fit rounded-full border border-ash px-3 py-1 text-caption font-medium uppercase text-graphite">
                + {feature.eyebrow}
              </span>
              <feature.Mockup />
            </div>

            <div className="max-w-[380px]">
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

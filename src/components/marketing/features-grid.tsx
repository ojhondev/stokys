"use client";

import { useRef, useState, type CSSProperties } from "react";

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

function MockupSimplicidade() {
  const ferramentas = [
    {
      className: "left-3 top-3",
      dx: "16px",
      dy: "16px",
      path: "M9 4v4M9 16v4M4 9h4M16 9h4M6.5 6.5l2.8 2.8M14.5 14.5l2.8 2.8M6.5 17.5l2.8-2.8M14.5 9.5l2.8-2.8",
    },
    {
      className: "right-3 top-3",
      dx: "-16px",
      dy: "16px",
      path: "M4 18v-3a5 5 0 0 1 10 0v3M4 18h10M6 9a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z",
    },
    {
      className: "bottom-3 left-1/2 -translate-x-1/2",
      dx: "0px",
      dy: "-18px",
      path: "M3 6h14l-1.5 8h-11L3 6Zm0 0-1-3M8 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm7 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
    },
  ];
  return (
    <div className="relative aspect-square w-32 overflow-hidden rounded-2xl bg-off-white-canvas sm:w-40">
      <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl bg-electric-lime sm:h-11 sm:w-11">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden>
          <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" className="text-off-black-ink" />
        </svg>
      </span>
      {ferramentas.map((ferramenta, i) => (
        <span
          key={i}
          className={`absolute flex h-8 w-8 animate-converge items-center justify-center rounded-lg bg-pure-white sm:h-9 sm:w-9 ${ferramenta.className}`}
          style={{ "--dx": ferramenta.dx, "--dy": ferramenta.dy } as CSSProperties}
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden>
            <path d={ferramenta.path} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-off-black-ink" />
          </svg>
        </span>
      ))}
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

const features = [
  {
    eyebrow: "Transparência",
    heading: "Orçamento fechado antes de pagar",
    descricao: "O plano já define o que está incluso — sem surpresa de escopo depois que o pagamento cai.",
    Mockup: MockupTransparencia,
  },
  {
    eyebrow: "Acompanhamento",
    heading: "Suporte real, nada de chatbot",
    descricao: "Cada etapa da produção aparece no seu dashboard assim que muda de status.",
    Mockup: MockupAcompanhamento,
  },
  {
    eyebrow: "Simplicidade",
    heading: "Tudo dentro da mesma plataforma",
    descricao: "Onboarding, pagamento, mensagens e preview — sem alternar entre 5 ferramentas.",
    Mockup: MockupSimplicidade,
  },
  {
    eyebrow: "Resultado",
    heading: "Loja pronta pra vender",
    descricao: "Produtos cadastrados, tema aplicado e checkout funcionando na entrega.",
    Mockup: MockupResultado,
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

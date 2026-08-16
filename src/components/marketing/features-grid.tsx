"use client";

import { useRef, useState, type CSSProperties } from "react";

// Carrossel de features — mesmo padrão da seção "100,000 tasks handled everyday"
// da perk.com (card com badge, mockup, heading, descrição e link "Read more",
// navegação por pontos + setas). Mockup genérico por enquanto, a pedido do usuário.

// Cada card tem uma mini-animação temática representando o recurso — não é
// mais o mesmo mockup genérico repetido (pedido do usuário).

function MockupTransparencia() {
  return (
    <div className="flex aspect-square w-32 flex-col justify-center gap-1.5 rounded-2xl bg-off-white-canvas p-4 sm:w-40">
      <div className="h-2 w-full rounded-full bg-pure-white" />
      <div className="h-2 w-4/5 rounded-full bg-pure-white" />
      <div className="h-2 w-3/5 rounded-full bg-pure-white" />
      <div className="mt-1.5 h-2.5 w-full animate-pulse rounded-full bg-electric-lime" />
    </div>
  );
}

function MockupAcompanhamento() {
  return (
    <div className="flex aspect-square w-32 flex-col items-center justify-center gap-3 rounded-2xl bg-off-white-canvas p-4 sm:w-40">
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-3 w-3 animate-bounce rounded-full bg-electric-lime"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <div className="h-2 w-20 rounded-full bg-pure-white" />
    </div>
  );
}

function MockupSimplicidade() {
  const blocos = [
    { className: "left-4 top-4", dx: "16px", dy: "16px" },
    { className: "right-4 top-4", dx: "-16px", dy: "16px" },
    { className: "bottom-4 left-4", dx: "16px", dy: "-16px" },
    { className: "bottom-4 right-4", dx: "-16px", dy: "-16px" },
  ];
  return (
    <div className="relative aspect-square w-32 overflow-hidden rounded-2xl bg-off-white-canvas sm:w-40">
      {blocos.map((bloco, i) => (
        <span
          key={i}
          className={`absolute h-6 w-6 animate-converge rounded-md bg-electric-lime sm:h-7 sm:w-7 ${bloco.className}`}
          style={{ "--dx": bloco.dx, "--dy": bloco.dy } as CSSProperties}
        />
      ))}
    </div>
  );
}

function MockupResultado() {
  return (
    <div className="flex aspect-square w-32 items-center justify-center rounded-2xl bg-off-white-canvas sm:w-40">
      <span className="relative flex h-12 w-12">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-lime opacity-60" />
        <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-electric-lime text-heading font-bold text-off-black-ink">
          ✓
        </span>
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

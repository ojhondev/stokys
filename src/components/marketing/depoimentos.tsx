"use client";

import { useState } from "react";
import Image from "next/image";
import { LinkButton } from "@/components/ui/button";
import { linkWhatsapp } from "@/lib/whatsapp";

// Faixa de depoimentos — desktop usa tiras que expandem ao clicar (mesmo
// padrão do "12,000+ real businesses" da perk.com). No mobile isso causava
// overflow horizontal (flex-basis pequeno + conteúdo com largura mínima
// forçava a página a arrastar de lado) — trocado por um carrossel de slides
// com scroll-snap nativo (mesma técnica já usada em features-grid.tsx), sem
// o wrapper <button> (o gesto aqui é arrastar/tocar, não clicar).

const depoimentos = [
  {
    id: 1,
    marca: "Loja física + online",
    imagem: "/depoimento-1.png",
    frase:
      "“Eu já tinha a loja física rodando bem, mas não sabia por onde começar a montar uma loja online decente. Com a Stokys, em poucos dias eu tinha um site profissional, com a cara da minha marca, vendendo de verdade.”",
  },
  {
    id: 2,
    marca: "Hauzzio",
    imagem: "/depoimento-2.png",
    frase:
      "“A Stokys entregou exatamente o que a gente pediu: uma loja bonita, rápida e fácil de navegar. Não precisei entender nada de tecnologia pra ter uma loja pronta pra vender.”",
  },
  {
    id: 3,
    marca: "Doiseff",
    imagem: "/depoimento-3.png",
    frase:
      "“Já tinha tentado com outra agência antes e não deu certo. Com a Stokys foi diferente: acompanhei cada etapa pelo painel e a loja ficou pronta exatamente como eu queria.”",
  },
  {
    id: 4,
    marca: "ClubGrer",
    imagem: "/depoimento-4.png",
    frase:
      "“Eu queria uma loja com identidade forte pro público masculino, sem cara de template genérico. A Stokys entendeu o briefing e entregou uma loja com a cara da ClubGrer.”",
  },
];

const ctaLabel = "Quero ser o próximo →";
const ctaHref = linkWhatsapp("Olá! Quero saber mais sobre os cases da Stokys.");

export function Depoimentos() {
  const [ativo, setAtivo] = useState(0);

  return (
    <section className="bg-pure-white py-14 md:py-16">
      <div className="mx-auto w-full max-w-[1800px] px-6 sm:px-10 lg:px-16">
        <h2 className="text-center text-heading-lg font-heading font-bold text-off-black-ink">
          Histórias reais de quem já vende com a Stokys
        </h2>
      </div>

      {/* Desktop: tiras que expandem ao clicar */}
      <div className="mx-auto mt-12 hidden w-full max-w-[1800px] gap-3 px-6 sm:px-10 md:flex md:h-[440px] lg:px-16">
        {depoimentos.map((dep, i) => {
          const expandido = i === ativo;
          return (
            <button
              key={dep.id}
              type="button"
              onClick={() => setAtivo(i)}
              aria-expanded={expandido}
              aria-label={`Ver depoimento de ${dep.marca}`}
              style={{ flexBasis: expandido ? "58%" : "14%" }}
              className="group relative shrink-0 grow overflow-hidden rounded-3xl text-left transition-[flex-basis] duration-500 ease-out"
            >
              <Image
                src={dep.imagem}
                alt={dep.marca}
                fill
                sizes="(min-width: 768px) 60vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-off-black-ink/85 via-off-black-ink/10 to-transparent" />

              <span className="absolute left-4 top-4 rounded-full bg-off-black-ink/60 px-3 py-1 text-caption font-bold uppercase text-pure-white sm:left-6 sm:top-6">
                {dep.marca}
              </span>

              {expandido && (
                <div className="absolute inset-x-4 bottom-4 flex flex-col items-start gap-4 sm:inset-x-6 sm:bottom-6">
                  <p className="max-w-[420px] text-body-sm font-medium text-pure-white sm:text-body">
                    {dep.frase}
                  </p>
                  <LinkButton
                    href={ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline-light"
                  >
                    {ctaLabel}
                  </LinkButton>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile: slides com scroll-snap — arrasta pro lado, toca pra abrir */}
      <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 scroll-smooth sm:px-10 md:hidden [&::-webkit-scrollbar]:hidden">
        {depoimentos.map((dep) => (
          <DepoimentoSlideMobile key={dep.id} dep={dep} />
        ))}
      </div>
    </section>
  );
}

function DepoimentoSlideMobile({ dep }: { dep: (typeof depoimentos)[number] }) {
  const [aberto, setAberto] = useState(false);

  return (
    <div
      onClick={() => setAberto((v) => !v)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setAberto((v) => !v);
      }}
      aria-expanded={aberto}
      className="relative h-[420px] w-[85vw] shrink-0 snap-center overflow-hidden rounded-3xl"
    >
      <Image src={dep.imagem} alt={dep.marca} fill sizes="85vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-off-black-ink/85 via-off-black-ink/10 to-transparent" />

      <span className="absolute left-4 top-4 rounded-full bg-off-black-ink/60 px-3 py-1 text-caption font-bold uppercase text-pure-white">
        {dep.marca}
      </span>

      {aberto ? (
        <div className="absolute inset-x-4 bottom-4 flex flex-col items-start gap-4">
          <p className="text-body-sm font-medium text-pure-white">{dep.frase}</p>
          <LinkButton href={ctaHref} target="_blank" rel="noopener noreferrer" variant="outline-light">
            {ctaLabel}
          </LinkButton>
        </div>
      ) : (
        <span className="absolute bottom-4 left-4 text-caption font-medium uppercase text-pure-white/70">
          Toque pra ler
        </span>
      )}
    </div>
  );
}

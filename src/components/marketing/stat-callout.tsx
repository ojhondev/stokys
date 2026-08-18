"use client";

import { useEffect, useRef, useState } from "react";
import { LinkButton } from "@/components/ui/button";

// Bloco de estatística gigante, centralizado — mesmo padrão da perk.com ("One
// platform. 225,000 hours saved."): heading em 2 linhas (a segunda carrega o
// número), parágrafo curto, um único CTA. Quando `contadorAte` é passado, a
// segunda linha conta de 0 até o número assim que o bloco entra na tela.

export function StatCallout({
  linha1,
  linha2,
  contadorAte,
  contadorPrefixo,
  contadorSufixo,
  descricao,
  ctaLabel,
  ctaHref,
  fundo = "off-white-canvas",
}: {
  linha1: string;
  linha2?: string;
  contadorAte?: number;
  contadorPrefixo?: string;
  contadorSufixo?: string;
  descricao: string;
  ctaLabel: string;
  ctaHref: string;
  fundo?: "off-white-canvas" | "pure-white";
}) {
  const fundoClasses = {
    "off-white-canvas": "bg-off-white-canvas",
    "pure-white": "bg-pure-white",
  } as const;

  const headingRef = useRef<HTMLHeadingElement>(null);
  const jaAnimou = useRef(false);
  const [numero, setNumero] = useState(0);

  useEffect(() => {
    if (!contadorAte || !headingRef.current) return;
    const el = headingRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || jaAnimou.current) return;
        jaAnimou.current = true;

        const duracaoMs = 900;
        const passoMs = 20;
        const inicio = Date.now();

        const intervalo = setInterval(() => {
          const progresso = Math.min((Date.now() - inicio) / duracaoMs, 1);
          setNumero(Math.round(progresso * contadorAte!));
          if (progresso >= 1) clearInterval(intervalo);
        }, passoMs);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [contadorAte]);

  return (
    <section className={`${fundoClasses[fundo]} px-6 py-14 sm:px-10 lg:px-16`}>
      <div className="mx-auto flex w-full max-w-[720px] flex-col items-center text-center">
        <h2
          ref={headingRef}
          className="text-heading-lg font-heading font-bold text-off-black-ink md:text-display"
        >
          {linha1}
          <br />
          {contadorAte ? `${contadorPrefixo ?? ""}${numero} ${contadorSufixo ?? ""}` : linha2}
        </h2>
        <p className="mt-6 max-w-[480px] text-body text-graphite">{descricao}</p>
        <LinkButton
          href={ctaHref}
          className="mt-8"
          {...(ctaHref.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {ctaLabel}
        </LinkButton>
      </div>
    </section>
  );
}

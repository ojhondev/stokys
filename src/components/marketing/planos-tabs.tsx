"use client";

import { useState } from "react";
import { LinkButton } from "@/components/ui/button";
import { planosConteudo, type PlanoConteudo } from "@/lib/planos-conteudo";
import { planosCases } from "@/lib/planos-cases";

// Mesmo padrão das abas Travel/Spend/Events da perk.com — indicador lima atrás da
// aba ativa, descrição + itens em cima, e uma barra "pill" com case/estatísticas
// embaixo (mesma composição do card de case da perk.com: marca, 2 números, citação,
// link). Copy de rascunho — ver src/lib/planos-cases.ts.

export function PlanosTabs() {
  const [ativo, setAtivo] = useState<PlanoConteudo["slug"]>("pro");
  const plano = planosConteudo.find((p) => p.slug === ativo)!;
  const caso = planosCases[ativo];

  return (
    <section id="planos" className="bg-pure-white px-6 py-20 md:py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        <span className="text-caption font-medium uppercase text-graphite">Planos</span>
        <h2 className="mt-3 max-w-[560px] text-heading font-medium text-off-black-ink">
          Três formas de montar sua loja.
        </h2>

        <div className="mt-10 inline-flex rounded-full bg-off-white-canvas p-1">
          {planosConteudo.map((p) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => setAtivo(p.slug)}
              className={`rounded-full px-5 py-2.5 text-body-sm font-medium transition-colors ${
                ativo === p.slug ? "bg-electric-lime text-off-black-ink" : "text-graphite"
              }`}
            >
              {p.nome}
            </button>
          ))}
        </div>

        <div className="mt-10 rounded-3xl bg-off-white-canvas p-10 md:p-16">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="text-subheading font-medium text-off-black-ink">{plano.nome}</h3>
              <p className="mt-2 text-body text-graphite">{plano.descricao}</p>
            </div>
            <ul className="flex flex-col gap-2 self-center">
              {plano.itens.map((item) => (
                <li key={item} className="text-body-sm text-off-black-ink">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <LinkButton href={`/onboarding?plano=${plano.slug}`} className="mt-8">
            Escolher {plano.nome}
          </LinkButton>

          <div className="mt-10 flex flex-col gap-6 rounded-3xl bg-pure-white px-8 py-6 lg:flex-row lg:items-center lg:gap-10 lg:rounded-full">
            <span className="text-subheading font-medium text-off-black-ink">{caso.marca}</span>

            <div className="flex gap-8 lg:border-l lg:border-ash lg:pl-10">
              <div>
                <p className="text-heading font-medium text-off-black-ink">{caso.stat1.valor}</p>
                <p className="mt-1 text-caption text-graphite">{caso.stat1.label}</p>
              </div>
              <div>
                <p className="text-heading font-medium text-off-black-ink">{caso.stat2.valor}</p>
                <p className="mt-1 text-caption text-graphite">{caso.stat2.label}</p>
              </div>
            </div>

            <div className="lg:flex-1 lg:border-l lg:border-ash lg:pl-10">
              <p className="text-body-sm text-off-black-ink">“{caso.citacao}”</p>
              <p className="mt-2 text-caption text-graphite">{caso.autor}</p>
            </div>

            <a
              href="#"
              className="whitespace-nowrap text-body-sm font-medium text-off-black-ink underline underline-offset-4"
            >
              Ver case completo →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

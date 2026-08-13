"use client";

import { useState } from "react";
import { LinkButton } from "@/components/ui/button";
import { planosConteudo, type PlanoConteudo } from "@/lib/planos-conteudo";

// Mesmo padrão das abas Travel/Spend/Events da perk.com — indicador lima atrás da
// aba ativa, conteúdo com descrição + estatísticas + depoimento por aba. As duas
// estatísticas e o depoimento são placeholders (Stokys ainda não tem esses dados).

export function PlanosTabs() {
  const [ativo, setAtivo] = useState<PlanoConteudo["slug"]>("pro");
  const plano = planosConteudo.find((p) => p.slug === ativo)!;

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

        <div className="mt-10 grid gap-10 rounded-3xl bg-off-white-canvas p-10 md:grid-cols-2 md:p-16">
          <div>
            <h3 className="text-subheading font-medium text-off-black-ink">{plano.nome}</h3>
            <p className="mt-2 text-body text-graphite">{plano.descricao}</p>
            <ul className="mt-6 flex flex-col gap-2">
              {plano.itens.map((item) => (
                <li key={item} className="text-body-sm text-off-black-ink">
                  {item}
                </li>
              ))}
            </ul>
            <LinkButton href={`/onboarding?plano=${plano.slug}`} className="mt-8">
              Escolher {plano.nome}
            </LinkButton>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex gap-8">
              <div>
                <p className="text-heading font-medium text-off-black-ink">[—]</p>
                <p className="mt-1 text-caption font-medium uppercase text-graphite">
                  Métrica real aqui
                </p>
              </div>
              <div>
                <p className="text-heading font-medium text-off-black-ink">[—]</p>
                <p className="mt-1 text-caption font-medium uppercase text-graphite">
                  Métrica real aqui
                </p>
              </div>
            </div>

            <blockquote className="rounded-3xl bg-pure-white p-6 text-body-sm text-off-black-ink">
              “[depoimento de cliente real sobre o plano {plano.nome} aqui]”
              <footer className="mt-3 text-caption font-medium uppercase text-graphite">
                [nome, cargo/loja]
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

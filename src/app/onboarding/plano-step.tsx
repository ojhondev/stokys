"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { planosConteudo, type PlanoConteudo } from "@/lib/planos-conteudo";

export function PlanoStep({ inicial }: { inicial?: PlanoConteudo["slug"] }) {
  const [selecionado, setSelecionado] = useState<PlanoConteudo["slug"] | null>(inicial ?? null);

  const plano = planosConteudo.find((p) => p.slug === selecionado);

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-3">
        {planosConteudo.map((p) => {
          const ativo = p.slug === selecionado;
          return (
            <button
              key={p.slug}
              type="button"
              onClick={() => setSelecionado(p.slug)}
              className={`flex flex-col rounded-3xl p-8 text-left transition-colors ${
                ativo ? "bg-electric-lime" : "bg-off-white-canvas"
              }`}
            >
              <h3 className="text-subheading font-medium text-off-black-ink">{p.nome}</h3>
              <p className="mt-2 text-body-sm text-off-black-ink/70">{p.descricao}</p>
              <ul className="mt-6 flex flex-col gap-2">
                {p.itens.map((item) => (
                  <li key={item} className="text-body-sm text-off-black-ink">
                    {item}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="mt-10 flex items-center justify-between rounded-3xl bg-pure-white p-8">
        <div>
          <p className="text-caption font-medium uppercase text-graphite">Plano selecionado</p>
          <p className="mt-1 text-subheading font-medium text-off-black-ink">
            {plano ? plano.nome : "Escolha um plano acima"}
          </p>
        </div>
        <Button disabled={!plano}>Continuar</Button>
      </div>

      {plano && (
        <p className="mt-4 text-body-sm text-graphite">
          Próximas etapas (plataforma, acessos e pagamento) chegam na Fase 1 do desenvolvimento —
          ver <span className="font-medium">docs/PRD.md</span>, seção 9.
        </p>
      )}
    </div>
  );
}

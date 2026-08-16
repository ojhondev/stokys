"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { planosConteudo, formatarPreco } from "@/lib/planos-conteudo";
import { criarProjeto } from "@/lib/actions/onboarding";
import type { StepProps } from "../types";

const labelPlataforma = { shopify: "Shopify", nuvemshop: "Nuvemshop" } as const;
const labelTema = { spark: "Spark", quart: "Quart" } as const;
const labelMercado = { brasil: "Brasil", global: "Global", latam: "Latam" } as const;

// Pagamento não faz parte do onboarding — só acontece depois, dentro do dashboard
// (ver docs/PRD.md 4.3). A conta já existe e está logada antes de chegar aqui
// (ver /cadastro) — "Criar minha loja" só cria o projeto (src/lib/actions/onboarding.ts).

export function RevisaoStep({ dados, onVoltar }: StepProps) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const plano = planosConteudo.find((p) => p.slug === dados.plano);

  const linhas = [
    { label: "Plano", valor: plano?.nome },
    { label: "Plataforma", valor: dados.plataforma && labelPlataforma[dados.plataforma] },
    dados.plano === "customizado"
      ? { label: "Mercado", valor: dados.mercadoAlvo && labelMercado[dados.mercadoAlvo] }
      : { label: "Tema", valor: dados.tema && labelTema[dados.tema] },
    { label: "Nicho", valor: dados.nicho },
    { label: "Referências", valor: `${dados.referencias.length} lojas listadas` },
    { label: "Valor", valor: plano && formatarPreco(plano.precoCentavos) },
  ];

  async function criarLoja() {
    setErro(null);
    setEnviando(true);
    const resultado = await criarProjeto(dados);
    // Em caso de sucesso a action redireciona (nunca retorna) — só chega aqui no erro.
    if (resultado?.erro) {
      setErro(resultado.erro);
      setEnviando(false);
    }
  }

  return (
    <div>
      <h1 className="text-heading font-heading font-bold text-off-black-ink">
        Confira antes de criar sua loja
      </h1>
      <p className="mt-2 text-body-sm text-graphite">
        Falta só o pagamento — ele acontece no próximo passo, depois de você entrar na sua conta.
        Os acessos da plataforma são pedidos depois, no painel.
      </p>

      <div className="mt-8 flex flex-col gap-2 rounded-3xl bg-off-white-canvas p-6">
        {linhas.map((linha) => (
          <div
            key={linha.label}
            className="flex items-center justify-between border-b border-ash py-2 text-body-sm text-off-black-ink last:border-b-0"
          >
            <span className="text-graphite">{linha.label}</span>
            <span className="font-medium">{linha.valor}</span>
          </div>
        ))}
      </div>

      {erro && <p className="mt-4 text-body-sm font-medium text-off-black-ink">{erro}</p>}

      <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" onClick={onVoltar} variant="ghost" disabled={enviando}>
          Voltar
        </Button>
        <Button type="button" onClick={criarLoja} disabled={enviando} className="w-full sm:w-auto">
          {enviando ? "Criando…" : "Criar minha loja"}
        </Button>
      </div>
    </div>
  );
}

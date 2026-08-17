"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { planosConteudo, formatarPreco } from "@/lib/planos-conteudo";
import { criarProjeto } from "@/lib/actions/onboarding";
import type { DadosOnboarding } from "../types";

const labelPlataforma = {
  shopify: "Shopify",
  nuvemshop: "Nuvemshop",
  tray: "Tray",
  bagy: "Bagy",
  outra: "Outra",
} as const;
const labelTema = { spark: "Spark", quart: "Quart" } as const;
const labelMercado = { brasil: "Brasil", global: "Global", latam: "Latam" } as const;

// Pagamento não faz parte do onboarding — só acontece depois, dentro do dashboard
// (ver docs/PRD.md 4.3). A conta já existe e está logada antes de chegar aqui
// (ver /cadastro) — "Criar minha loja" só cria o projeto (src/lib/actions/onboarding.ts).
//
// Layout split-screen (pedido do usuário: a versão anterior "passava pouca
// segurança") — coluna da esquerda com o resumo, direita com a foto de
// fechamento. Renderizado fora do container normal do wizard (ver
// onboarding-wizard.tsx), por isso cuida do próprio "Stokys" + barra de
// progresso, em vez de herdar do wrapper compartilhado.

export function RevisaoStep({
  dados,
  onVoltar,
  etapaAtualIndex,
  totalEtapas,
}: {
  dados: DadosOnboarding;
  onVoltar: () => void;
  etapaAtualIndex: number;
  totalEtapas: number;
}) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const plano = planosConteudo.find((p) => p.slug === dados.plano);

  const linhas = [
    { label: "Plano", valor: plano?.nome },
    {
      label: "Plataforma",
      valor:
        dados.plataforma === "outra"
          ? dados.plataformaOutraNome
          : dados.plataforma && labelPlataforma[dados.plataforma],
    },
    dados.plano === "customizado"
      ? { label: "Mercado", valor: dados.mercadoAlvo && labelMercado[dados.mercadoAlvo] }
      : { label: "Tema", valor: dados.tema && labelTema[dados.tema] },
    { label: "Nicho", valor: dados.nicho },
    { label: "Referências", valor: `${dados.referencias.length} lojas listadas` },
    { label: "Objetivo", valor: dados.objetivoCliente },
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
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-14 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-[440px]">
          <Link href="/" className="text-body font-medium text-off-black-ink">
            Stokys
          </Link>

          <div className="mt-10 flex items-center gap-2">
            {Array.from({ length: totalEtapas }).map((_, i) => (
              <div key={i} className="h-1 flex-1 rounded-full bg-electric-lime" />
            ))}
          </div>
          <p className="mt-3 text-caption font-medium uppercase text-graphite">
            Etapa {etapaAtualIndex + 1} de {totalEtapas} · Revisão
          </p>

          <h1 className="mt-6 text-heading font-heading font-bold text-off-black-ink">
            Confira antes de criar sua loja
          </h1>
          <p className="mt-2 text-body-sm text-graphite">
            Falta só o pagamento — ele acontece no próximo passo, depois de você entrar na sua
            conta. Os acessos da plataforma são pedidos depois, no painel.
          </p>

          <div className="mt-8 flex flex-col gap-2 rounded-3xl bg-off-white-canvas p-6">
            {linhas.map((linha) => (
              <div
                key={linha.label}
                className="flex items-center justify-between gap-4 border-b border-ash py-2 text-body-sm text-off-black-ink last:border-b-0"
              >
                <span className="shrink-0 text-graphite">{linha.label}</span>
                <span className="text-right font-medium">{linha.valor}</span>
              </div>
            ))}
          </div>

          {erro && <p className="mt-4 text-body-sm font-medium text-off-black-ink">{erro}</p>}

          <div className="mt-8 flex items-center justify-between">
            <Button type="button" onClick={onVoltar} variant="ghost" disabled={enviando}>
              Voltar
            </Button>
            <Button type="button" onClick={criarLoja} disabled={enviando}>
              {enviando ? "Criando…" : "Criar minha loja"}
            </Button>
          </div>
        </div>
      </div>

      <div className="relative hidden min-h-[320px] md:block">
        <Image
          src="/onboarding-revisao-foto.jpg"
          alt="Você está perto de começar a viver do digital."
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}

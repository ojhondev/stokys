"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { planosConteudo, formatarPreco } from "@/lib/planos-conteudo";
import { criarContaEProjeto } from "@/lib/actions/onboarding";
import type { StepProps } from "../types";

const labelPlataforma = { shopify: "Shopify", nuvemshop: "Nuvemshop" } as const;
const labelTema = { spark: "Spark", quart: "Quart" } as const;
const labelMercado = { brasil: "Brasil", global: "Global", latam: "Latam" } as const;

// Pagamento não faz parte do onboarding — só acontece depois, dentro do dashboard,
// com o usuário logado (ver docs/PRD.md 4.3). "Criar minha loja" já cria a conta
// e o projeto de verdade (src/lib/actions/onboarding.ts) e sai logado.

export function RevisaoStep({ dados, setDados, onVoltar }: StepProps) {
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
    const resultado = await criarContaEProjeto(dados);
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

      <div className="mt-8 flex flex-col gap-4 rounded-3xl bg-off-white-canvas p-6">
        <p className="text-caption font-medium uppercase text-graphite">Seus dados</p>
        <label className="flex flex-col gap-2">
          <span className="text-body-sm font-medium text-off-black-ink">Nome</span>
          <input
            type="text"
            value={dados.nome}
            onChange={(e) => setDados((d) => ({ ...d, nome: e.target.value }))}
            className="rounded-lg border border-ash bg-pure-white px-4 py-3 text-body text-off-black-ink"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-body-sm font-medium text-off-black-ink">E-mail</span>
          <input
            type="email"
            value={dados.email}
            onChange={(e) => setDados((d) => ({ ...d, email: e.target.value }))}
            className="rounded-lg border border-ash bg-pure-white px-4 py-3 text-body text-off-black-ink"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-body-sm font-medium text-off-black-ink">Senha</span>
          <input
            type="password"
            value={dados.senha}
            onChange={(e) => setDados((d) => ({ ...d, senha: e.target.value }))}
            className="rounded-lg border border-ash bg-pure-white px-4 py-3 text-body text-off-black-ink"
          />
        </label>
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

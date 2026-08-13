import Link from "next/link";
import { PlanoMockup } from "@/components/marketing/plano-mockup";

// Dashboard do cliente — ver docs/PRD.md, seção 4.4.
// TODO (Fase 1): trocar os dados de exemplo abaixo por dados reais do projeto
// (getSession() + getDb()) assim que auth e Neon estiverem conectados de ponta a ponta.

const etapas = [
  { chave: "onboarding", label: "Onboarding" },
  { chave: "aguardando_pagamento", label: "Pagamento" },
  { chave: "em_producao", label: "Produção" },
  { chave: "preview_disponivel", label: "Preview" },
  { chave: "entregue", label: "Entregue" },
];

const etapaAtualIndex = 2; // "em_producao", só pra ilustrar o layout

const stats = [
  { label: "Plano", valor: "Pro" },
  { label: "Etapa atual", valor: "Produção" },
  { label: "Produtos cadastrados", valor: "9 / 15" },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-caption font-medium uppercase text-graphite">Seu projeto</span>
          <h1 className="mt-1 text-heading font-heading font-medium text-off-black-ink">
            Loja Nortex — plano Pro
          </h1>
        </div>
        <span className="w-fit rounded-full bg-electric-lime px-4 py-2 text-body-sm font-medium text-off-black-ink">
          Em produção
        </span>
      </div>

      {/* Etapas */}
      <div className="mt-8 overflow-x-auto rounded-3xl bg-pure-white p-6">
        <div className="flex min-w-[560px] items-center">
          {etapas.map((etapa, i) => (
            <div key={etapa.chave} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-caption font-medium ${
                    i <= etapaAtualIndex
                      ? "bg-electric-lime text-off-black-ink"
                      : "bg-off-white-canvas text-graphite"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="whitespace-nowrap text-caption text-graphite">{etapa.label}</span>
              </div>
              {i < etapas.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 rounded-full ${
                    i < etapaAtualIndex ? "bg-electric-lime" : "bg-off-white-canvas"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl bg-pure-white p-6">
            <p className="text-caption font-medium uppercase text-graphite">{stat.label}</p>
            <p className="mt-2 text-subheading font-heading font-medium text-off-black-ink">
              {stat.valor}
            </p>
          </div>
        ))}
      </div>

      {/* Preview + mensagens */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-3xl bg-pure-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-subheading font-heading font-medium text-off-black-ink">Preview</p>
            <Link
              href="/dashboard/preview"
              className="text-body-sm font-medium text-off-black-ink underline underline-offset-4"
            >
              Ver completo
            </Link>
          </div>
          <div className="mt-4 h-[260px]">
            <PlanoMockup plano="pro" />
          </div>
        </div>

        <div className="rounded-3xl bg-pure-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-subheading font-heading font-medium text-off-black-ink">
              Mensagens
            </p>
            <Link
              href="/dashboard/mensagens"
              className="text-body-sm font-medium text-off-black-ink underline underline-offset-4"
            >
              Ver todas
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <div className="rounded-2xl bg-off-white-canvas p-4">
              <p className="text-caption font-medium uppercase text-graphite">Produção Stokys</p>
              <p className="mt-1 text-body-sm text-off-black-ink">
                Banners aprovados, seguindo pro cadastro dos produtos restantes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

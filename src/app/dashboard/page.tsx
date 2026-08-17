import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { getDb } from "@/lib/db";
import { usuarios } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { getProjetoDoCliente } from "@/lib/queries/projetos";
import { formatarPreco, nomeExibicaoPlano } from "@/lib/planos-conteudo";
import { etapasProjeto as etapas, labelStatusProjeto as labelStatus } from "@/lib/status-projeto";

// Tela raiz do dashboard — só leitura, contexto rápido do projeto (não é um
// "módulo" de interação; o cliente só interage de fato em Pagamentos,
// Mensagens e Configurações — ver docs/PRD.md 4.4 e nav-items.ts). Enriquecida
// (Fase 2) com % de conclusão, prazo estimado e próxima ação — os dois
// últimos setados pela equipe em admin/projetos/[id].

const descricaoEtapaAtual = {
  onboarding: "Recebemos os dados da sua loja — falta só o pagamento pra produção começar.",
  aguardando_pagamento: "Falta confirmar o pagamento pra produção começar a montar sua loja.",
  em_producao: "A produção está montando sua loja com base no que você enviou no onboarding.",
  preview_disponivel: "Sua loja tem um preview disponível — a produção vai te avisar pelo chat.",
  entregue: "Sua loja foi entregue. Qualquer ajuste, fale com a produção pelo chat.",
} as const;

export default async function DashboardPage() {
  const sessao = await getSession();
  if (!sessao) return null;

  const registro = await getProjetoDoCliente(sessao.userId);
  if (!registro) {
    return (
      <div>
        <span className="text-caption font-medium uppercase text-graphite">Seu projeto</span>
        <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
          Nenhum projeto encontrado
        </h1>
        <p className="mt-2 text-body-sm text-graphite">
          Fale com a produção pelo WhatsApp se você acha que isso é um erro.
        </p>
      </div>
    );
  }

  const { projeto, plano } = registro;
  const etapaAtualIndex = etapas.findIndex((e) => e.chave === projeto.status);
  const percentualConclusao = Math.round(((etapaAtualIndex + 1) / etapas.length) * 100);

  const [usuario] = await getDb()
    .select({ nomeDaLoja: usuarios.nomeDaLoja })
    .from(usuarios)
    .where(eq(usuarios.id, sessao.userId))
    .limit(1);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-caption font-medium uppercase text-graphite">Seu projeto</span>
          <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
            {usuario?.nomeDaLoja || `Loja ${nomeExibicaoPlano(plano.nome)}`}
          </h1>
        </div>
        <span className="w-fit rounded-full bg-electric-lime px-4 py-2 text-body-sm font-medium text-off-black-ink">
          {labelStatus[projeto.status]}
        </span>
      </div>

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

        <div className="mt-6 flex flex-col gap-1 border-t border-ash pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body-sm text-off-black-ink">{descricaoEtapaAtual[projeto.status]}</p>
          <p className="whitespace-nowrap text-caption text-graphite">
            Atualizado em {projeto.atualizadoEm.toLocaleDateString("pt-BR")}
          </p>
        </div>

        {projeto.proximaAcao && (
          <div className="mt-4 rounded-2xl bg-off-white-canvas p-4">
            <p className="text-caption font-medium uppercase text-graphite">
              Próxima ação necessária
            </p>
            <p className="mt-1 text-body-sm font-medium text-off-black-ink">
              {projeto.proximaAcao}
            </p>
          </div>
        )}
      </div>

      {plano.nome !== "customizado" && (
        <Link
          href="/dashboard/pagamentos"
          className="mt-6 block overflow-hidden rounded-3xl transition-transform duration-200 hover:scale-[1.01]"
        >
          <Image
            src="/banner-upsell-plano.png"
            alt="Precisa de mais recursos? Dê um upgrade no seu plano."
            width={2721}
            height={930}
            className="h-auto w-full"
          />
        </Link>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl bg-pure-white p-6">
          <p className="text-caption font-medium uppercase text-graphite">Plano</p>
          <p className="mt-2 text-subheading font-heading font-bold text-off-black-ink">
            {nomeExibicaoPlano(plano.nome)}
          </p>
        </div>
        <div className="rounded-3xl bg-pure-white p-6">
          <p className="text-caption font-medium uppercase text-graphite">Conclusão</p>
          <p className="mt-2 text-subheading font-heading font-bold text-off-black-ink">
            {percentualConclusao}%
          </p>
        </div>
        {projeto.prazoEstimadoDias != null && (
          <div className="rounded-3xl bg-pure-white p-6">
            <p className="text-caption font-medium uppercase text-graphite">Prazo estimado</p>
            <p className="mt-2 text-subheading font-heading font-bold text-off-black-ink">
              {projeto.prazoEstimadoDias} dias
            </p>
          </div>
        )}
        <div className="rounded-3xl bg-pure-white p-6">
          <p className="text-caption font-medium uppercase text-graphite">Valor</p>
          <p className="mt-2 text-subheading font-heading font-bold text-off-black-ink">
            {formatarPreco(projeto.precoNoMomentoDaCompraCentavos)}
          </p>
        </div>
      </div>
    </div>
  );
}

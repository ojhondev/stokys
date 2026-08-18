import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { getDb } from "@/lib/db";
import { usuarios } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { getProjetoDoCliente } from "@/lib/queries/projetos";
import { nomeExibicaoPlano } from "@/lib/planos-conteudo";
import { linkWhatsapp, MENSAGEM_WHATSAPP_GENERICA } from "@/lib/whatsapp";
import { etapasProjeto as etapas, labelStatusProjeto as labelStatus } from "@/lib/status-projeto";

// Tela raiz do dashboard — visão geral do projeto em formato bento (cards
// variados, não só uma grade plana de números), batendo com a referência de
// UI do painel. "Preview" e "Faturamento" são mockados por enquanto (não
// existe integração real ainda) — os demais cards usam dados reais.

const descricaoEtapaAtual = {
  onboarding: "Recebemos os dados da sua loja — falta só o pagamento pra produção começar.",
  aguardando_pagamento: "Falta confirmar o pagamento pra produção começar a montar sua loja.",
  em_producao: "A produção está montando sua loja com base no que você enviou no onboarding.",
  preview_disponivel: "Sua loja tem um preview disponível — a produção vai te avisar pelo chat.",
  entregue: "Sua loja foi entregue. Qualquer ajuste, fale com a produção pelo chat.",
} as const;

const pillLima =
  "shrink-0 whitespace-nowrap rounded-full bg-electric-lime px-4 py-2 text-caption font-bold text-off-black-ink transition-opacity hover:opacity-90";

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
  const previewDisponivel = projeto.status === "preview_disponivel" || projeto.status === "entregue";

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

      <div className="mt-8 rounded-3xl bg-pure-white p-6">
        {/* Mobile: barra de progresso compacta — o stepper com 5 rótulos lado a
            lado não cabe numa tela de celular sem exigir scroll horizontal. */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between gap-3">
            <span className="text-caption font-medium uppercase text-graphite">
              Etapa {etapaAtualIndex + 1} de {etapas.length}
            </span>
            <span className="text-caption font-medium text-off-black-ink">
              {etapas[etapaAtualIndex]?.label}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            {etapas.map((etapa, i) => (
              <span
                key={etapa.chave}
                className={`h-1.5 flex-1 rounded-full ${
                  i <= etapaAtualIndex ? "bg-electric-lime" : "bg-app-canvas"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="hidden overflow-x-auto sm:block">
          <div className="flex min-w-[560px] items-center">
            {etapas.map((etapa, i) => (
              <div key={etapa.chave} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-caption font-medium ${
                      i <= etapaAtualIndex
                        ? "bg-electric-lime text-off-black-ink"
                        : "bg-app-canvas text-graphite"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="whitespace-nowrap text-caption text-graphite">{etapa.label}</span>
                </div>
                {i < etapas.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 rounded-full ${
                      i < etapaAtualIndex ? "bg-electric-lime" : "bg-app-canvas"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-1 border-t border-ash pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body-sm text-off-black-ink">{descricaoEtapaAtual[projeto.status]}</p>
          <p className="whitespace-nowrap text-caption text-graphite">
            Atualizado em {projeto.atualizadoEm.toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col rounded-3xl bg-pure-white p-6 lg:row-span-2">
          <div className="flex items-center justify-between gap-4">
            <p className="text-body-sm font-bold text-off-black-ink">Preview</p>
            <div className="flex items-center gap-1.5">
              {etapas.map((etapa, i) => (
                <span
                  key={etapa.chave}
                  className={`h-1.5 w-6 rounded-full ${
                    i <= etapaAtualIndex ? "bg-electric-lime" : "bg-app-canvas"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-6 rounded-2xl bg-app-canvas px-6 py-10">
            <div className="w-full max-w-[220px] rounded-[2rem] border-[6px] border-off-black-ink bg-pure-white p-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-app-canvas" />
                <span className="h-2 flex-1 rounded-full bg-app-canvas" />
              </div>
              <div className="mt-3 h-20 rounded-xl bg-app-canvas" />
              <div className="mt-2 h-2.5 w-2/3 rounded-full bg-app-canvas" />
              <div className="mt-2 h-2.5 w-1/2 rounded-full bg-app-canvas" />
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="h-12 rounded-lg bg-app-canvas" />
                <div className="h-12 rounded-lg bg-app-canvas" />
              </div>
            </div>
            <p className="max-w-[260px] text-center text-body-sm text-graphite">
              {previewDisponivel
                ? "Preview disponível — confira o link no chat com a produção."
                : "Sua loja aparece aqui assim que o preview estiver disponível."}
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-pure-white p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-caption font-medium uppercase text-graphite">Faturamento da sua loja</p>
            <Link href="/dashboard/configuracoes" className={pillLima}>
              Integrar dados
            </Link>
          </div>
          <p className="mt-2 text-subheading font-heading font-bold text-off-black-ink">R$ 0,00</p>
          <div className="mt-4 flex h-24 items-center justify-center rounded-2xl bg-app-canvas">
            <p className="text-caption text-stone">Conecte sua plataforma pra ver os números aqui</p>
          </div>
        </div>

        {plano.nome !== "customizado" ? (
          <Link
            href="/dashboard/pagamentos"
            className="group relative block overflow-hidden rounded-3xl transition-transform duration-200 hover:scale-[1.01]"
          >
            <Image
              src="/banner-upsell-plano.png"
              alt="Precisa de mais recursos? Dê um upgrade no seu plano."
              width={2721}
              height={930}
              className="h-full w-full object-cover"
            />
          </Link>
        ) : (
          <div className="flex flex-col justify-center rounded-3xl bg-off-black-ink p-6">
            <p className="w-fit rounded-full bg-electric-lime px-3 py-1 text-caption font-bold text-off-black-ink">
              Plano Elite
            </p>
            <p className="mt-3 text-subheading font-heading font-bold text-pure-white">
              Sua loja é 100% customizada
            </p>
            <p className="mt-1 text-body-sm text-pure-white/70">
              Qualquer ajuste de escopo, fale direto com a produção pelo chat.
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-pure-white p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-caption font-medium uppercase text-graphite">
              O que está em andamento
            </p>
            <a href={linkWhatsapp(MENSAGEM_WHATSAPP_GENERICA)} target="_blank" rel="noopener noreferrer" className={pillLima}>
              Falar com time
            </a>
          </div>
          <p className="mt-2 text-subheading font-heading font-bold text-off-black-ink">
            {projeto.proximaAcao || labelStatus[projeto.status]}
          </p>
        </div>

        <div className="rounded-3xl bg-pure-white p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-caption font-medium uppercase text-graphite">Prazo estimado</p>
            <Link href="/dashboard/timeline" className={pillLima}>
              Ver etapas
            </Link>
          </div>
          <p className="mt-2 text-subheading font-heading font-bold text-off-black-ink">
            {projeto.prazoEstimadoDias != null ? `${projeto.prazoEstimadoDias} dias` : "A definir"}
          </p>
          <p className="mt-1 text-body-sm text-graphite">{labelStatus[projeto.status]}</p>
        </div>
      </div>
    </div>
  );
}

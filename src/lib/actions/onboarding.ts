"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { and, desc, eq, isNull } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { planos, projetos, personalizacoes, projetoItens, leads } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { nomeExibicaoPlano, formatarPreco } from "@/lib/planos-conteudo";
import { labelPlataforma, labelTema, labelMercado } from "@/lib/labels-projeto";
import { linkWhatsapp } from "@/lib/whatsapp";
import type { DadosOnboarding } from "@/app/onboarding/types";

// Revalida tudo no servidor — nunca confia que o estado client do wizard
// chegou íntegro (ver docs/PRD.md 4.2, fluxo do onboarding).
const dadosSchema = z
  .object({
    nome: z.string().min(1, "Informe seu nome."),
    whatsapp: z.string().min(1, "Informe seu WhatsApp."),
    email: z.string().email("Informe um e-mail válido."),
    plano: z.enum(["zen", "pro", "customizado"]),
    plataforma: z.enum(["shopify", "nuvemshop", "tray", "bagy", "outra"]),
    plataformaOutraNome: z.string().optional(),
    tema: z.enum(["spark", "quant"]).nullable(),
    mercadoAlvo: z.enum(["brasil", "global", "latam"]).nullable(),
    possuiIdentidadeVisual: z.boolean().nullable(),
    paletaCores: z.array(z.string()),
    nicho: z.string().min(1, "Informe o nicho da loja."),
    referencias: z.array(z.string().min(1)).length(3, "Liste as 3 referências antes de continuar."),
    objetivoCliente: z.string().min(1, "Conte o que você deseja pro seu projeto."),
  })
  .refine((d) => d.plataforma !== "outra" || !!d.plataformaOutraNome?.trim(), {
    message: "Informe o nome da plataforma.",
    path: ["plataformaOutraNome"],
  });

export type OnboardingState = { erro?: string; whatsappUrl?: string };

// Cadastro (conta) e onboarding (loja) são passos separados — a conta já
// existe e está logada antes de chegar aqui (ver /cadastro,
// lib/actions/cadastro.ts). Esta action só cria o projeto.
export async function criarProjeto(dados: DadosOnboarding): Promise<OnboardingState> {
  const sessao = await getSession();
  if (!sessao || sessao.papel !== "cliente") {
    redirect("/cadastro?tipo=cliente&next=/onboarding");
  }

  const parsed = dadosSchema.safeParse(dados);
  if (!parsed.success) {
    return { erro: parsed.error.issues[0]?.message ?? "Revise os dados antes de continuar." };
  }
  const d = parsed.data;

  if (d.plano === "customizado" && !d.mercadoAlvo) {
    return { erro: "Escolha o mercado-alvo antes de continuar." };
  }
  if (d.plano === "customizado" && d.possuiIdentidadeVisual === null) {
    return { erro: "Diga se você já tem identidade visual pronta." };
  }
  if (d.plano !== "customizado" && !d.tema) {
    return { erro: "Escolha um tema antes de continuar." };
  }

  const db = getDb();

  const [planoRow] = await db.select().from(planos).where(eq(planos.nome, d.plano)).limit(1);
  if (!planoRow || !planoRow.ativo || planoRow.precoCentavos == null) {
    return { erro: "Esse plano não está disponível no momento." };
  }

  // Sem db.transaction() de propósito — o driver neon-http (HTTP stateless,
  // mais simples que o pool via WebSocket) não suporta transações reais.
  const [projeto] = await db
    .insert(projetos)
    .values({
      clienteId: sessao.userId,
      planoId: planoRow.id,
      precoNoMomentoDaCompraCentavos: planoRow.precoCentavos!,
      plataforma: d.plataforma,
      plataformaOutraNome: d.plataforma === "outra" ? d.plataformaOutraNome?.trim() : null,
      status: "aguardando_pagamento",
      tema: d.tema,
      nicho: d.nicho,
      referencias: d.referencias,
      objetivoCliente: d.objetivoCliente,
    })
    .returning({ id: projetos.id });

  // Linka o Lead criado na etapa "Contato" (mesmo e-mail, ainda sem projeto)
  // a esta loja — é o que faz a ficha completa aparecer na janela lateral de
  // admin/leads em vez de só nome/whatsapp/e-mail.
  const [leadParaLinkar] = await db
    .select({ id: leads.id })
    .from(leads)
    .where(and(eq(leads.email, d.email), isNull(leads.projetoId)))
    .orderBy(desc(leads.criadoEm))
    .limit(1);
  if (leadParaLinkar) {
    await db.update(leads).set({ projetoId: projeto.id }).where(eq(leads.id, leadParaLinkar.id));
  }

  if (d.plano === "customizado") {
    await db.insert(personalizacoes).values({
      projetoId: projeto.id,
      mercadoAlvo: d.mercadoAlvo!,
      logoUrl: null,
      paletaCores: d.paletaCores,
      possuiIdentidadeVisual: d.possuiIdentidadeVisual,
    });
  }

  // O plano base também vira uma linha em projeto_itens — upsell e plano
  // base seguem o mesmo caminho de cobrança (ver lib/actions/pagamentos.ts).
  await db.insert(projetoItens).values({
    projetoId: projeto.id,
    tipo: "plano_base",
    descricao: `Plano ${nomeExibicaoPlano(d.plano)}`,
    valorCentavos: planoRow.precoCentavos!,
    criadoPorId: sessao.userId,
  });

  // A loja já existe no banco (o cliente já tem acesso à Área do Cliente pra
  // acompanhar) — o pedido some pra fechamento manual pelo WhatsApp em vez de
  // pagamento automático dentro do app (pedido do usuário, 2026-08-19).
  const linhasPedido = [
    `Nome: ${d.nome}`,
    `WhatsApp: ${d.whatsapp}`,
    `E-mail: ${d.email}`,
    `Plano: ${nomeExibicaoPlano(d.plano)} (${formatarPreco(planoRow.precoCentavos!)})`,
    `Plataforma: ${d.plataforma === "outra" ? d.plataformaOutraNome : labelPlataforma[d.plataforma]}`,
    d.plano === "customizado"
      ? `Mercado: ${d.mercadoAlvo ? labelMercado[d.mercadoAlvo] : "-"}`
      : `Tema: ${d.tema ? labelTema[d.tema] : "-"}`,
    `Nicho: ${d.nicho}`,
    `Objetivo: ${d.objetivoCliente}`,
  ];
  const mensagem = `Olá! Quero fechar meu pedido na Stokys:\n\n${linhasPedido.join("\n")}`;

  // Não usa redirect() aqui de propósito — o cliente precisa abrir o WhatsApp
  // E a Área do Cliente ao mesmo tempo (uma aba cada), então quem decide pra
  // onde navegar é o RevisaoStep (ver revisao-step.tsx), não a action.
  return { whatsappUrl: linkWhatsapp(mensagem) };
}

"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { planos, projetos, personalizacoes, projetoItens } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { nomeExibicaoPlano } from "@/lib/planos-conteudo";
import type { DadosOnboarding } from "@/app/onboarding/types";

// Revalida tudo no servidor — nunca confia que o estado client do wizard
// chegou íntegro (ver docs/PRD.md 4.2, fluxo do onboarding).
const dadosSchema = z
  .object({
    plano: z.enum(["zen", "pro", "customizado"]),
    plataforma: z.enum(["shopify", "nuvemshop", "tray", "bagy", "outra"]),
    plataformaOutraNome: z.string().optional(),
    tema: z.enum(["spark", "quart"]).nullable(),
    mercadoAlvo: z.enum(["brasil", "global", "latam"]).nullable(),
    paletaCores: z.array(z.string()),
    nicho: z.string().min(1, "Informe o nicho da loja."),
    referencias: z.array(z.string().min(1)).length(3, "Liste as 3 referências antes de continuar."),
    objetivoCliente: z.string().min(1, "Conte o que você deseja pro seu projeto."),
  })
  .refine((d) => d.plataforma !== "outra" || !!d.plataformaOutraNome?.trim(), {
    message: "Informe o nome da plataforma.",
    path: ["plataformaOutraNome"],
  });

export type OnboardingState = { erro?: string };

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

  if (d.plano === "customizado") {
    await db.insert(personalizacoes).values({
      projetoId: projeto.id,
      mercadoAlvo: d.mercadoAlvo!,
      logoUrl: null,
      paletaCores: d.paletaCores,
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

  redirect("/dashboard/pagamentos");
}

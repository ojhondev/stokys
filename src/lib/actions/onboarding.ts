"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { usuarios, planos, projetos, personalizacoes } from "@/lib/db/schema";
import { hashPassword, createSession } from "@/lib/auth";
import type { DadosOnboarding } from "@/app/onboarding/types";

// Revalida tudo no servidor — nunca confia que o estado client do wizard
// chegou íntegro (ver docs/PRD.md 4.2, fluxo do onboarding).
const dadosSchema = z.object({
  plano: z.enum(["zen", "pro", "customizado"]),
  plataforma: z.enum(["shopify", "nuvemshop"]),
  tema: z.enum(["spark", "quart"]).nullable(),
  mercadoAlvo: z.enum(["brasil", "global", "latam"]).nullable(),
  paletaCores: z.array(z.string()),
  nicho: z.string().min(1, "Informe o nicho da loja."),
  referencias: z.array(z.string().min(1)).length(5, "Liste as 5 referências antes de continuar."),
  nome: z.string().min(1, "Informe seu nome."),
  email: z.string().email("E-mail inválido."),
  senha: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
});

export type OnboardingState = { erro?: string };

export async function criarContaEProjeto(dados: DadosOnboarding): Promise<OnboardingState> {
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
  const email = d.email.toLowerCase();

  const [existente] = await db
    .select({ id: usuarios.id })
    .from(usuarios)
    .where(eq(usuarios.email, email))
    .limit(1);
  if (existente) {
    return { erro: "Esse e-mail já tem conta — faça login em vez de criar outra loja." };
  }

  const [planoRow] = await db.select().from(planos).where(eq(planos.nome, d.plano)).limit(1);
  if (!planoRow || !planoRow.ativo || planoRow.precoCentavos == null) {
    return { erro: "Esse plano não está disponível no momento." };
  }

  const senhaHash = await hashPassword(d.senha);

  // Sem db.transaction() de propósito — o driver neon-http (HTTP stateless,
  // mais simples que o pool via WebSocket) não suporta transações reais.
  // Inserts sequenciais bastam aqui: risco aceitável de usuário órfão se um
  // passo tardio falhar, contra a complexidade de trocar de driver agora.
  const [usuario] = await db
    .insert(usuarios)
    .values({ papel: "cliente", nome: d.nome, email, senhaHash })
    .returning({ id: usuarios.id });

  const [projeto] = await db
    .insert(projetos)
    .values({
      clienteId: usuario.id,
      planoId: planoRow.id,
      precoNoMomentoDaCompraCentavos: planoRow.precoCentavos!,
      plataforma: d.plataforma,
      status: "aguardando_pagamento",
      tema: d.tema,
      nicho: d.nicho,
      referencias: d.referencias,
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

  const usuarioId = usuario.id;

  await createSession(usuarioId, "cliente");
  redirect("/dashboard/pagamentos");
}

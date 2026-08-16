"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { produtosVencedores } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";

export type VencedorState = { erro?: string };

const vencedorSchema = z.object({
  semanaInicio: z.string().min(1, "Informe a data de início da semana."),
  nome: z.string().min(1, "Informe o nome do produto."),
  imagemUrl: z.string().optional(),
  nicho: z.string().optional(),
  porqueVence: z.string().min(1, "Explique por que o produto está vendendo."),
  linkFornecedor: z.string().optional(),
});

export async function criarVencedor(dados: {
  semanaInicio: string;
  nome: string;
  imagemUrl: string;
  nicho: string;
  porqueVence: string;
  linkFornecedor: string;
}): Promise<VencedorState> {
  const sessao = await getSession();
  if (!sessao || !["master", "admin"].includes(sessao.papel)) {
    return { erro: "Sem permissão." };
  }

  const parsed = vencedorSchema.safeParse(dados);
  if (!parsed.success) {
    return { erro: parsed.error.issues[0]?.message ?? "Revise os dados." };
  }
  const d = parsed.data;

  const db = getDb();
  const [existente] = await db
    .select({ id: produtosVencedores.id })
    .from(produtosVencedores)
    .where(eq(produtosVencedores.semanaInicio, d.semanaInicio))
    .limit(1);
  if (existente) {
    return { erro: "Já existe um produto cadastrado pra essa semana." };
  }

  await db.insert(produtosVencedores).values({
    semanaInicio: d.semanaInicio,
    nome: d.nome,
    imagemUrl: d.imagemUrl || null,
    nicho: d.nicho || null,
    porqueVence: d.porqueVence,
    linkFornecedor: d.linkFornecedor || null,
    criadoPorId: sessao.userId,
  });

  revalidatePath("/admin/vencedor-da-semana");
  revalidatePath("/dashboard/vencedor-da-semana");
  return {};
}

export async function alternarVencedorPublicado(id: string, publicado: boolean): Promise<VencedorState> {
  const sessao = await getSession();
  if (!sessao || !["master", "admin"].includes(sessao.papel)) {
    return { erro: "Sem permissão." };
  }

  await getDb().update(produtosVencedores).set({ publicado }).where(eq(produtosVencedores.id, id));

  revalidatePath("/admin/vencedor-da-semana");
  revalidatePath("/dashboard/vencedor-da-semana");
  return {};
}

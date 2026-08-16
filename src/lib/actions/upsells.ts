"use server";

import { revalidatePath } from "next/cache";
import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { catalogoUpsells, projetoItens } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { getProjetoDoCliente } from "@/lib/queries/projetos";

export type UpsellState = { erro?: string };

// --- Admin/master: catálogo de upsells ---------------------------------

const catalogoSchema = z.object({
  nome: z.string().min(1, "Informe o nome."),
  descricao: z.string().optional(),
  valorCentavos: z.coerce.number().int().positive("Informe um valor válido."),
});

export async function criarUpsell(dados: {
  nome: string;
  descricao: string;
  valorCentavos: number;
}): Promise<UpsellState> {
  const sessao = await getSession();
  if (!sessao || !["master", "admin"].includes(sessao.papel)) {
    return { erro: "Sem permissão." };
  }

  const parsed = catalogoSchema.safeParse(dados);
  if (!parsed.success) {
    return { erro: parsed.error.issues[0]?.message ?? "Revise os dados." };
  }
  const d = parsed.data;

  await getDb()
    .insert(catalogoUpsells)
    .values({ nome: d.nome, descricao: d.descricao || null, valorCentavos: d.valorCentavos });

  revalidatePath("/admin/upsells");
  return {};
}

export async function alternarUpsellAtivo(id: string, ativo: boolean): Promise<UpsellState> {
  const sessao = await getSession();
  if (!sessao || !["master", "admin"].includes(sessao.papel)) {
    return { erro: "Sem permissão." };
  }

  await getDb().update(catalogoUpsells).set({ ativo }).where(eq(catalogoUpsells.id, id));

  revalidatePath("/admin/upsells");
  return {};
}

// --- Cliente: adicionar/remover upsell no pedido em aberto --------------

export async function adicionarUpsellAoProjeto(catalogoUpsellId: string): Promise<UpsellState> {
  const sessao = await getSession();
  if (!sessao || sessao.papel !== "cliente") {
    return { erro: "Sessão inválida." };
  }

  const registro = await getProjetoDoCliente(sessao.userId);
  if (!registro) return { erro: "Nenhum projeto encontrado." };

  const db = getDb();
  const [upsell] = await db
    .select()
    .from(catalogoUpsells)
    .where(and(eq(catalogoUpsells.id, catalogoUpsellId), eq(catalogoUpsells.ativo, true)))
    .limit(1);
  if (!upsell) return { erro: "Upsell não disponível." };

  await db.insert(projetoItens).values({
    projetoId: registro.projeto.id,
    tipo: "upsell",
    catalogoUpsellId: upsell.id,
    descricao: upsell.nome,
    valorCentavos: upsell.valorCentavos,
    criadoPorId: sessao.userId,
  });

  revalidatePath("/dashboard/pagamentos");
  return {};
}

export async function removerItemAberto(itemId: string): Promise<UpsellState> {
  const sessao = await getSession();
  if (!sessao || sessao.papel !== "cliente") {
    return { erro: "Sessão inválida." };
  }

  const registro = await getProjetoDoCliente(sessao.userId);
  if (!registro) return { erro: "Nenhum projeto encontrado." };

  const db = getDb();
  // Só remove upsell ainda não cobrado — plano base não sai da lista, e um
  // item já vinculado a uma cobrança fica congelado (ver schema.ts).
  await db
    .delete(projetoItens)
    .where(
      and(
        eq(projetoItens.id, itemId),
        eq(projetoItens.projetoId, registro.projeto.id),
        eq(projetoItens.tipo, "upsell"),
        isNull(projetoItens.cobrancaId),
      ),
    );

  revalidatePath("/dashboard/pagamentos");
  return {};
}

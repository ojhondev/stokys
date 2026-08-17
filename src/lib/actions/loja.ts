"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { projetos } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { getProjetoDoCliente } from "@/lib/queries/projetos";

export type LojaState = { erro?: string };

export async function atualizarDominio(dominio: string): Promise<LojaState> {
  const sessao = await getSession();
  if (!sessao || sessao.papel !== "cliente") return { erro: "Sessão inválida." };

  const registro = await getProjetoDoCliente(sessao.userId);
  if (!registro) return { erro: "Nenhum projeto encontrado." };

  await getDb()
    .update(projetos)
    .set({ dominio: dominio.trim() || null, atualizadoEm: new Date() })
    .where(eq(projetos.id, registro.projeto.id));

  revalidatePath("/dashboard/configuracoes");
  return {};
}

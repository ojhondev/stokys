"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { projetos } from "@/lib/db/schema";
import { getSession, type Papel } from "@/lib/auth";
import { getProjetoDoCliente } from "@/lib/queries/projetos";
import { registrarEvento } from "@/lib/eventos";
import { eq } from "drizzle-orm";

export type BriefingState = { erro?: string };

export async function atualizarBriefing(dados: {
  identidadeDriveUrl: string;
  publico: string;
  posicionamento: string;
}): Promise<BriefingState> {
  const sessao = await getSession();
  if (!sessao || sessao.papel !== "cliente") return { erro: "Sessão inválida." };

  const registro = await getProjetoDoCliente(sessao.userId);
  if (!registro) return { erro: "Nenhum projeto encontrado." };

  await getDb()
    .update(projetos)
    .set({
      identidadeDriveUrl: dados.identidadeDriveUrl.trim() || null,
      publico: dados.publico.trim() || null,
      posicionamento: dados.posicionamento.trim() || null,
      atualizadoEm: new Date(),
    })
    .where(eq(projetos.id, registro.projeto.id));

  await registrarEvento(registro.projeto.id, "Cliente atualizou o briefing.");

  revalidatePath("/dashboard/briefing");
  revalidatePath(`/admin/projetos/${registro.projeto.id}`);
  return {};
}

const PAPEIS_EQUIPE: Papel[] = ["master", "admin", "producao"];

export async function atualizarVisaoGeral(
  projetoId: string,
  dados: { prazoEstimadoDias: number | null; proximaAcao: string },
): Promise<BriefingState> {
  const sessao = await getSession();
  if (!sessao || !PAPEIS_EQUIPE.includes(sessao.papel)) return { erro: "Sessão inválida." };

  await getDb()
    .update(projetos)
    .set({
      prazoEstimadoDias: dados.prazoEstimadoDias,
      proximaAcao: dados.proximaAcao.trim() || null,
      atualizadoEm: new Date(),
    })
    .where(eq(projetos.id, projetoId));

  revalidatePath("/dashboard");
  revalidatePath(`/admin/projetos/${projetoId}`);
  return {};
}

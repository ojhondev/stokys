"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { projetos, statusProjetoEnum } from "@/lib/db/schema";
import { getSession, type Papel } from "@/lib/auth";
import { registrarEvento } from "@/lib/eventos";
import { labelStatusProjeto } from "@/lib/status-projeto";

const PAPEIS_EQUIPE: Papel[] = ["master", "admin", "producao"];
const statusValidos = statusProjetoEnum.enumValues;
type StatusProjeto = (typeof statusValidos)[number];

export type AdminState = { erro?: string };

export async function atualizarStatusProjeto(
  projetoId: string,
  status: StatusProjeto,
): Promise<AdminState> {
  const sessao = await getSession();
  if (!sessao || !PAPEIS_EQUIPE.includes(sessao.papel)) {
    return { erro: "Sessão inválida." };
  }
  if (!statusValidos.includes(status)) {
    return { erro: "Status inválido." };
  }

  const db = getDb();

  // Produção só mexe nos projetos atribuídos a ela — master/admin veem/operam tudo.
  if (sessao.papel === "producao") {
    const [projeto] = await db.select().from(projetos).where(eq(projetos.id, projetoId)).limit(1);
    if (!projeto || projeto.responsavelId !== sessao.userId) {
      return { erro: "Esse projeto não está atribuído a você." };
    }
  }

  await db.update(projetos).set({ status, atualizadoEm: new Date() }).where(eq(projetos.id, projetoId));
  await registrarEvento(projetoId, `Status mudou para ${labelStatusProjeto[status]}.`);

  revalidatePath("/admin");
  revalidatePath(`/admin/projetos/${projetoId}`);
  revalidatePath("/dashboard/timeline");
  revalidatePath("/dashboard/historico");
  return {};
}

// Atribuir um responsável de produção — só master/admin (não producao).
export async function atribuirResponsavel(
  projetoId: string,
  responsavelId: string | null,
): Promise<AdminState> {
  const sessao = await getSession();
  if (!sessao || sessao.papel === "producao" || sessao.papel === "cliente") {
    return { erro: "Sessão inválida." };
  }

  await getDb()
    .update(projetos)
    .set({ responsavelId, atualizadoEm: new Date() })
    .where(eq(projetos.id, projetoId));

  revalidatePath("/admin");
  revalidatePath(`/admin/projetos/${projetoId}`);
  return {};
}

// Arquivar em vez de excluir de verdade — um projeto tem histórico real
// (mensagens antigas, tarefas, cobranças) que quebraria em cascata com um
// hard delete; arquivar só tira da lista principal, reversível a qualquer
// momento. Só master/admin (não producao, que só deveria ver o que é seu).
export async function arquivarProjeto(projetoId: string, arquivado: boolean): Promise<AdminState> {
  const sessao = await getSession();
  if (!sessao || !["master", "admin"].includes(sessao.papel)) {
    return { erro: "Sessão inválida." };
  }

  await getDb()
    .update(projetos)
    .set({ arquivado, atualizadoEm: new Date() })
    .where(eq(projetos.id, projetoId));

  revalidatePath("/admin");
  revalidatePath(`/admin/projetos/${projetoId}`);
  return {};
}

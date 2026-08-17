"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { tarefas, projetos } from "@/lib/db/schema";
import { getSession, type Papel } from "@/lib/auth";
import { getProjetoDoCliente } from "@/lib/queries/projetos";
import { registrarEvento } from "@/lib/eventos";

export type TarefaState = { erro?: string };

const PAPEIS_EQUIPE: Papel[] = ["master", "admin", "producao"];

export async function criarTarefa(
  projetoId: string,
  titulo: string,
  responsavel: "cliente" | "stokys",
): Promise<TarefaState> {
  const sessao = await getSession();
  if (!sessao || !PAPEIS_EQUIPE.includes(sessao.papel)) return { erro: "Sessão inválida." };
  if (!titulo.trim()) return { erro: "Escreva o título da tarefa." };

  if (sessao.papel === "producao") {
    const [projeto] = await getDb().select().from(projetos).where(eq(projetos.id, projetoId)).limit(1);
    if (!projeto || projeto.responsavelId !== sessao.userId) {
      return { erro: "Esse projeto não está atribuído a você." };
    }
  }

  await getDb().insert(tarefas).values({
    projetoId,
    titulo: titulo.trim(),
    responsavel,
    criadoPorId: sessao.userId,
  });
  await registrarEvento(projetoId, `Nova tarefa criada: "${titulo.trim()}".`);

  revalidatePath(`/admin/projetos/${projetoId}`);
  revalidatePath("/dashboard/tarefas");
  return {};
}

export async function concluirTarefa(tarefaId: string, concluida: boolean): Promise<TarefaState> {
  const sessao = await getSession();
  if (!sessao) return { erro: "Sessão inválida." };

  const [tarefa] = await getDb().select().from(tarefas).where(eq(tarefas.id, tarefaId)).limit(1);
  if (!tarefa) return { erro: "Tarefa não encontrada." };

  if (sessao.papel === "cliente") {
    if (tarefa.responsavel !== "cliente") return { erro: "Essa tarefa não é sua." };
    const registro = await getProjetoDoCliente(sessao.userId);
    if (!registro || registro.projeto.id !== tarefa.projetoId) return { erro: "Sessão inválida." };
  } else if (PAPEIS_EQUIPE.includes(sessao.papel)) {
    if (sessao.papel === "producao") {
      const [projeto] = await getDb().select().from(projetos).where(eq(projetos.id, tarefa.projetoId)).limit(1);
      if (!projeto || projeto.responsavelId !== sessao.userId) {
        return { erro: "Esse projeto não está atribuído a você." };
      }
    }
  } else {
    return { erro: "Sessão inválida." };
  }

  await getDb().update(tarefas).set({ concluida }).where(eq(tarefas.id, tarefaId));
  if (concluida) {
    await registrarEvento(tarefa.projetoId, `Tarefa concluída: "${tarefa.titulo}".`);
  }

  revalidatePath(`/admin/projetos/${tarefa.projetoId}`);
  revalidatePath("/dashboard/tarefas");
  return {};
}

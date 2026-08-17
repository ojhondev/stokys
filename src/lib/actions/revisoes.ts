"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { revisoes, revisaoComentarios, projetos } from "@/lib/db/schema";
import { getSession, type Papel } from "@/lib/auth";
import { getProjetoDoCliente } from "@/lib/queries/projetos";
import { registrarEvento } from "@/lib/eventos";

export type RevisaoState = { erro?: string };

const PAPEIS_EQUIPE: Papel[] = ["master", "admin", "producao"];

export async function criarRevisao(
  projetoId: string,
  titulo: string,
  linkOuArquivoUrl: string,
): Promise<RevisaoState> {
  const sessao = await getSession();
  if (!sessao || !PAPEIS_EQUIPE.includes(sessao.papel)) return { erro: "Sessão inválida." };
  if (!titulo.trim() || !linkOuArquivoUrl.trim()) {
    return { erro: "Preencha o título e envie um arquivo ou link." };
  }

  if (sessao.papel === "producao") {
    const [projeto] = await getDb().select().from(projetos).where(eq(projetos.id, projetoId)).limit(1);
    if (!projeto || projeto.responsavelId !== sessao.userId) {
      return { erro: "Esse projeto não está atribuído a você." };
    }
  }

  await getDb().insert(revisoes).values({
    projetoId,
    titulo: titulo.trim(),
    linkOuArquivoUrl: linkOuArquivoUrl.trim(),
    criadoPorId: sessao.userId,
  });
  await registrarEvento(projetoId, `Nova versão enviada pra revisão: "${titulo.trim()}".`);

  revalidatePath(`/admin/projetos/${projetoId}`);
  revalidatePath("/dashboard/revisoes");
  return {};
}

export async function atualizarStatusRevisao(
  revisaoId: string,
  status: "aprovado" | "mudancas_solicitadas",
): Promise<RevisaoState> {
  const sessao = await getSession();
  if (!sessao || sessao.papel !== "cliente") return { erro: "Sessão inválida." };

  const [revisao] = await getDb().select().from(revisoes).where(eq(revisoes.id, revisaoId)).limit(1);
  if (!revisao) return { erro: "Revisão não encontrada." };

  const registro = await getProjetoDoCliente(sessao.userId);
  if (!registro || registro.projeto.id !== revisao.projetoId) return { erro: "Sessão inválida." };

  await getDb().update(revisoes).set({ status }).where(eq(revisoes.id, revisaoId));
  await registrarEvento(
    revisao.projetoId,
    status === "aprovado"
      ? `Cliente aprovou a versão: "${revisao.titulo}".`
      : `Cliente pediu mudanças na versão: "${revisao.titulo}".`,
  );

  revalidatePath("/dashboard/revisoes");
  revalidatePath(`/admin/projetos/${revisao.projetoId}`);
  return {};
}

export async function criarComentarioRevisao(revisaoId: string, texto: string): Promise<RevisaoState> {
  const sessao = await getSession();
  if (!sessao) return { erro: "Sessão inválida." };
  if (!texto.trim()) return { erro: "Escreva um comentário." };

  const [revisao] = await getDb().select().from(revisoes).where(eq(revisoes.id, revisaoId)).limit(1);
  if (!revisao) return { erro: "Revisão não encontrada." };

  if (sessao.papel === "cliente") {
    const registro = await getProjetoDoCliente(sessao.userId);
    if (!registro || registro.projeto.id !== revisao.projetoId) return { erro: "Sessão inválida." };
  } else if (!PAPEIS_EQUIPE.includes(sessao.papel)) {
    return { erro: "Sessão inválida." };
  }

  await getDb().insert(revisaoComentarios).values({
    revisaoId,
    autorId: sessao.userId,
    texto: texto.trim(),
  });

  revalidatePath("/dashboard/revisoes");
  revalidatePath(`/admin/projetos/${revisao.projetoId}`);
  return {};
}

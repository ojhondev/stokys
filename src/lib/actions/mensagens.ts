"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { mensagens, projetos } from "@/lib/db/schema";
import { getSession, type Papel } from "@/lib/auth";
import { getProjetoDoCliente } from "@/lib/queries/projetos";

const PAPEIS_EQUIPE: Papel[] = ["master", "admin", "producao"];

export type MensagemState = { erro?: string };

// Usado tanto pelo cliente (thread do próprio projeto) quanto pela equipe
// (thread de um projeto específico, passando projetoIdParaEquipe) — só o
// autorId muda, então fica uma função só em vez de duplicar a lógica.
export async function enviarMensagem(
  texto: string,
  projetoIdParaEquipe?: string,
  anexoUrl?: string,
): Promise<MensagemState> {
  const sessao = await getSession();
  if (!sessao) return { erro: "Sessão inválida." };

  const conteudo = texto.trim();
  if (!conteudo && !anexoUrl) return { erro: "Escreva uma mensagem ou anexe um arquivo." };

  let projetoId: string;

  if (sessao.papel === "cliente") {
    const registro = await getProjetoDoCliente(sessao.userId);
    if (!registro) return { erro: "Nenhum projeto encontrado." };
    projetoId = registro.projeto.id;
  } else if (PAPEIS_EQUIPE.includes(sessao.papel) && projetoIdParaEquipe) {
    if (sessao.papel === "producao") {
      const [projeto] = await getDb()
        .select()
        .from(projetos)
        .where(eq(projetos.id, projetoIdParaEquipe))
        .limit(1);
      if (!projeto || projeto.responsavelId !== sessao.userId) {
        return { erro: "Esse projeto não está atribuído a você." };
      }
    }
    projetoId = projetoIdParaEquipe;
  } else {
    return { erro: "Sessão inválida." };
  }

  await getDb()
    .insert(mensagens)
    .values({ projetoId, autorId: sessao.userId, texto: conteudo, anexoUrl: anexoUrl || null });

  revalidatePath("/dashboard/mensagens");
  revalidatePath(`/admin/projetos/${projetoId}`);
  return {};
}

"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { solicitacoes, statusSolicitacaoEnum } from "@/lib/db/schema";
import { getSession, type Papel } from "@/lib/auth";
import { getProjetoDoCliente } from "@/lib/queries/projetos";
import { registrarEvento } from "@/lib/eventos";

export type SolicitacaoState = { erro?: string };

const PAPEIS_EQUIPE: Papel[] = ["master", "admin", "producao"];

const labelTipoSolicitacao = {
  alteracao: "Pedido de alteração",
  informacao: "Envio de informação",
  conteudo: "Solicitação de conteúdo",
} as const;

export async function criarSolicitacao(
  tipo: "alteracao" | "informacao" | "conteudo",
  texto: string,
): Promise<SolicitacaoState> {
  const sessao = await getSession();
  if (!sessao || sessao.papel !== "cliente") return { erro: "Sessão inválida." };
  if (!texto.trim()) return { erro: "Descreva sua solicitação." };

  const registro = await getProjetoDoCliente(sessao.userId);
  if (!registro) return { erro: "Nenhum projeto encontrado." };

  await getDb().insert(solicitacoes).values({
    projetoId: registro.projeto.id,
    tipo,
    texto: texto.trim(),
    criadoPorId: sessao.userId,
  });
  await registrarEvento(
    registro.projeto.id,
    `Cliente abriu uma solicitação: ${labelTipoSolicitacao[tipo]}.`,
  );

  revalidatePath("/dashboard/solicitacoes");
  revalidatePath(`/admin/projetos/${registro.projeto.id}`);
  return {};
}

export async function atualizarStatusSolicitacao(
  solicitacaoId: string,
  status: (typeof statusSolicitacaoEnum.enumValues)[number],
): Promise<SolicitacaoState> {
  const sessao = await getSession();
  if (!sessao || !PAPEIS_EQUIPE.includes(sessao.papel)) return { erro: "Sessão inválida." };

  const [solicitacao] = await getDb()
    .select()
    .from(solicitacoes)
    .where(eq(solicitacoes.id, solicitacaoId))
    .limit(1);
  if (!solicitacao) return { erro: "Solicitação não encontrada." };

  await getDb().update(solicitacoes).set({ status }).where(eq(solicitacoes.id, solicitacaoId));
  if (status === "concluida") {
    await registrarEvento(solicitacao.projetoId, `Solicitação concluída: "${solicitacao.texto}".`);
  }

  revalidatePath("/dashboard/solicitacoes");
  revalidatePath(`/admin/projetos/${solicitacao.projetoId}`);
  return {};
}

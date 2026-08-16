"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { parceiros } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";

const perfilSchema = z.object({
  nome: z.string().min(1, "Informe o nome."),
  especialidade: z.string().min(1, "Informe a especialidade."),
  descricao: z.string().optional(),
  linkWhatsapp: z.string().min(1, "Informe o link do WhatsApp."),
});

export type PerfilParceiroState = { erro?: string; salvo?: boolean };

export async function atualizarPerfilParceiro(
  _prevState: PerfilParceiroState,
  formData: FormData,
): Promise<PerfilParceiroState> {
  const sessao = await getSession();
  if (!sessao || sessao.papel !== "parceiro") return { erro: "Sessão inválida." };

  const parsed = perfilSchema.safeParse({
    nome: formData.get("nome"),
    especialidade: formData.get("especialidade"),
    descricao: formData.get("descricao") ?? undefined,
    linkWhatsapp: formData.get("linkWhatsapp"),
  });
  if (!parsed.success) {
    return { erro: parsed.error.issues[0]?.message ?? "Revise os dados." };
  }
  const d = parsed.data;

  await getDb()
    .update(parceiros)
    .set({
      nome: d.nome,
      especialidade: d.especialidade,
      descricao: d.descricao || null,
      linkWhatsapp: d.linkWhatsapp,
    })
    .where(eq(parceiros.usuarioId, sessao.userId));

  return { salvo: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { usuarios } from "@/lib/db/schema";
import { getSession, hashPassword } from "@/lib/auth";

// Sem autopromoção: contas de equipe (admin/producao) só existem por ação de
// um master — ver docs do plano de Fase 1.

const schema = z.object({
  nome: z.string().min(1, "Informe o nome."),
  email: z.string().email("E-mail inválido."),
  senha: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
  papel: z.enum(["admin", "producao"]),
});

export type EquipeState = { erro?: string };

export async function criarFuncionario(dados: {
  nome: string;
  email: string;
  senha: string;
  papel: "admin" | "producao";
}): Promise<EquipeState> {
  const sessao = await getSession();
  if (!sessao || sessao.papel !== "master") {
    return { erro: "Só o master pode gerenciar a equipe." };
  }

  const parsed = schema.safeParse(dados);
  if (!parsed.success) {
    return { erro: parsed.error.issues[0]?.message ?? "Revise os dados." };
  }
  const d = parsed.data;
  const email = d.email.toLowerCase();

  const db = getDb();
  const [existente] = await db
    .select({ id: usuarios.id })
    .from(usuarios)
    .where(eq(usuarios.email, email))
    .limit(1);
  if (existente) {
    return { erro: "Já existe uma conta com esse e-mail." };
  }

  const senhaHash = await hashPassword(d.senha);
  await db.insert(usuarios).values({ papel: d.papel, nome: d.nome, email, senhaHash });

  revalidatePath("/admin/equipe");
  return {};
}

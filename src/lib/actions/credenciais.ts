"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { acessosPlataforma } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { getProjetoDoCliente } from "@/lib/queries/projetos";
import { encryptSecret } from "@/lib/credentials";

export type CredenciaisState = { erro?: string };

export async function salvarAcessos(usuario: string, senha: string): Promise<CredenciaisState> {
  const sessao = await getSession();
  if (!sessao || sessao.papel !== "cliente") return { erro: "Sessão inválida." };

  const usuarioAcesso = usuario.trim();
  if (!usuarioAcesso || !senha.trim()) return { erro: "Preencha usuário e senha." };

  const registro = await getProjetoDoCliente(sessao.userId);
  if (!registro) return { erro: "Nenhum projeto encontrado." };

  const segredoCriptografado = encryptSecret(senha);

  await getDb()
    .insert(acessosPlataforma)
    .values({ projetoId: registro.projeto.id, usuarioAcesso, segredoCriptografado })
    .onConflictDoUpdate({
      target: acessosPlataforma.projetoId,
      set: { usuarioAcesso, segredoCriptografado, revogadoEm: null },
    });

  revalidatePath("/dashboard/configuracoes");
  return {};
}

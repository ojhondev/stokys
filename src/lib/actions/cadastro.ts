"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { usuarios, parceiros } from "@/lib/db/schema";
import { hashPassword, createSession } from "@/lib/auth";
import { gerarToken } from "@/lib/verificacao";
import { enviarEmail } from "@/lib/email/enviar";
import { templateVerificacaoEmail } from "@/lib/email/templates";

const cadastroSchema = z.object({
  nome: z.string().min(1, "Informe seu nome."),
  email: z.string().email("E-mail inválido."),
  senha: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
  tipo: z.enum(["cliente", "parceiro"]),
  next: z.string().optional(),
});

export type CadastroState = { erro?: string };

export async function criarConta(
  _prevState: CadastroState,
  formData: FormData,
): Promise<CadastroState> {
  const parsed = cadastroSchema.safeParse({
    nome: formData.get("nome"),
    email: formData.get("email"),
    senha: formData.get("senha"),
    tipo: formData.get("tipo"),
    next: formData.get("next") ?? undefined,
  });
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
    return { erro: "Esse e-mail já tem conta — faça login em vez de cadastrar de novo." };
  }

  const senhaHash = await hashPassword(d.senha);

  // tipo -> papel vem de uma tabela fixa no servidor — nunca aceita "papel"
  // vindo do formulário (senão um POST forjado poderia pedir papel=master).
  const papel = d.tipo === "parceiro" ? ("parceiro" as const) : ("cliente" as const);

  const [usuario] = await db
    .insert(usuarios)
    .values({ papel, nome: d.nome, email, senhaHash, emailVerificado: false })
    .returning({ id: usuarios.id });

  if (d.tipo === "parceiro") {
    await db.insert(parceiros).values({
      usuarioId: usuario.id,
      nome: d.nome,
      especialidade: "",
      linkWhatsapp: "",
      ativo: false, // aprovação do admin antes de aparecer na vitrine (PRD 4.6)
    });
  }

  const token = await gerarToken(usuario.id, "verificacao_email");
  await enviarEmail({
    para: email,
    assunto: "Confirme seu e-mail — Stokys",
    html: templateVerificacaoEmail(d.nome, token),
  });

  await createSession(usuario.id, papel);

  if (d.tipo === "parceiro") {
    redirect("/parceiro");
  }
  redirect(d.next && d.next.startsWith("/") ? d.next : "/onboarding");
}

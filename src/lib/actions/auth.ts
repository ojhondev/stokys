"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { usuarios } from "@/lib/db/schema";
import { createSession, destroySession, verifyPassword, type Papel } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
  next: z.string().optional(),
});

function destinoPadrao(papel: Papel): string {
  return papel === "cliente" || papel === "parceiro" ? "/dashboard" : "/admin";
}

export type LoginState = { erro?: string };

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    senha: formData.get("senha"),
    next: formData.get("next") ?? undefined,
  });
  if (!parsed.success) {
    return { erro: "Preencha e-mail e senha." };
  }
  const { email, senha, next } = parsed.data;

  const [usuario] = await getDb()
    .select()
    .from(usuarios)
    .where(eq(usuarios.email, email.toLowerCase()))
    .limit(1);

  // Mensagem genérica de propósito — não revela se o e-mail existe ou não.
  if (!usuario || !usuario.senhaHash || !(await verifyPassword(senha, usuario.senhaHash))) {
    return { erro: "E-mail ou senha inválidos." };
  }

  await createSession(usuario.id, usuario.papel as Papel);
  redirect(next && next.startsWith("/") ? next : destinoPadrao(usuario.papel as Papel));
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/login");
}

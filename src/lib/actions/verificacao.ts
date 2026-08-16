"use server";

import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { usuarios } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { gerarToken } from "@/lib/verificacao";
import { enviarEmail } from "@/lib/email/enviar";
import { templateVerificacaoEmail } from "@/lib/email/templates";

const REENVIO_MIN_INTERVALO_MS = 60 * 1000; // 1 por minuto

export type VerificacaoState = { erro?: string; enviado?: boolean };

export async function reenviarVerificacao(): Promise<VerificacaoState> {
  const sessao = await getSession();
  if (!sessao) return { erro: "Sessão inválida." };

  const db = getDb();
  const [usuario] = await db.select().from(usuarios).where(eq(usuarios.id, sessao.userId)).limit(1);
  if (!usuario) return { erro: "Sessão inválida." };
  if (usuario.emailVerificado) return { erro: "Esse e-mail já está verificado." };

  if (
    usuario.ultimoEnvioVerificacaoEm &&
    Date.now() - usuario.ultimoEnvioVerificacaoEm.getTime() < REENVIO_MIN_INTERVALO_MS
  ) {
    return { erro: "Aguarde um minuto antes de pedir outro e-mail." };
  }

  const token = await gerarToken(usuario.id, "verificacao_email");
  await enviarEmail({
    para: usuario.email,
    assunto: "Confirme seu e-mail — Stokys",
    html: templateVerificacaoEmail(usuario.nome, token),
  });

  await db
    .update(usuarios)
    .set({ ultimoEnvioVerificacaoEm: new Date() })
    .where(eq(usuarios.id, usuario.id));

  return { enviado: true };
}

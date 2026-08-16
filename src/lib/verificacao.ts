import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { tokensVerificacao } from "@/lib/db/schema";

// Token de verificação de e-mail / reset de senha — guarda só o hash SHA-256
// no banco, nunca o token em texto puro (ver schema.ts, tokensVerificacao).

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h
type TipoToken = "verificacao_email" | "reset_senha";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function gerarToken(usuarioId: string, tipo: TipoToken): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const expiraEm = new Date(Date.now() + TOKEN_TTL_MS);

  await getDb()
    .insert(tokensVerificacao)
    .values({ usuarioId, tipo, tokenHash: hashToken(token), expiraEm });

  return token;
}

export async function consumirToken(
  token: string,
  tipo: TipoToken,
): Promise<{ usuarioId: string } | { erro: "invalido" | "expirado" | "usado" }> {
  const db = getDb();
  const [registro] = await db
    .select()
    .from(tokensVerificacao)
    .where(eq(tokensVerificacao.tokenHash, hashToken(token)))
    .limit(1);

  if (!registro || registro.tipo !== tipo) return { erro: "invalido" };
  if (registro.usadoEm) return { erro: "usado" };
  if (registro.expiraEm < new Date()) return { erro: "expirado" };

  await db
    .update(tokensVerificacao)
    .set({ usadoEm: new Date() })
    .where(eq(tokensVerificacao.id, registro.id));

  return { usuarioId: registro.usuarioId };
}

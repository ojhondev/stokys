import "server-only";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { projetos, planos } from "@/lib/db/schema";

// Fase 1 assume um projeto ativo por cliente (sem seletor de projeto) — ver
// plano em C:\Users\55149\.claude\plans. Sempre o mais recente.
export async function getProjetoDoCliente(clienteId: string) {
  const db = getDb();
  const [linha] = await db
    .select({ projeto: projetos, plano: planos })
    .from(projetos)
    .innerJoin(planos, eq(projetos.planoId, planos.id))
    .where(eq(projetos.clienteId, clienteId))
    .orderBy(desc(projetos.criadoEm))
    .limit(1);
  return linha ?? null;
}

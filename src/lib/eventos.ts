import "server-only";
import { getDb } from "@/lib/db";
import { eventos } from "@/lib/db/schema";

// Chamado a partir de toda ação que muda estado visível do projeto —
// atualizarStatusProjeto, criar/concluir tarefa, criar solicitação,
// criar/aprovar revisão (ver docs/PRD e plano de Fase 2). Módulo Histórico
// só lê essa tabela em ordem cronológica reversa, sem interação.
export async function registrarEvento(projetoId: string, descricao: string) {
  await getDb().insert(eventos).values({ projetoId, descricao });
}

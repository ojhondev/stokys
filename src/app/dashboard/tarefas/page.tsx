import { asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { tarefas } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { getProjetoDoCliente } from "@/lib/queries/projetos";
import { TarefaToggle } from "@/components/dashboard/tarefa-toggle";

// Módulo Tarefas — pendências do cliente e da Stokys pro mesmo projeto. O
// cliente só marca como concluída as tarefas que são dele (ver
// lib/actions/tarefas.ts) — as da Stokys ficam só como visibilidade.

export default async function TarefasPage() {
  const sessao = await getSession();
  if (!sessao) return null;

  const registro = await getProjetoDoCliente(sessao.userId);
  if (!registro) {
    return (
      <div>
        <span className="text-caption font-medium uppercase text-graphite">Tarefas</span>
        <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
          Nenhum projeto encontrado
        </h1>
      </div>
    );
  }

  const todas = await getDb()
    .select()
    .from(tarefas)
    .where(eq(tarefas.projetoId, registro.projeto.id))
    .orderBy(asc(tarefas.criadoEm));

  const doCliente = todas.filter((t) => t.responsavel === "cliente");
  const daStokys = todas.filter((t) => t.responsavel === "stokys");

  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Tarefas</span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
        Pendências do projeto
      </h1>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <p className="text-caption font-medium uppercase text-graphite">Suas pendências</p>
          <div className="mt-3 flex flex-col gap-2 rounded-3xl bg-pure-white p-6">
            {doCliente.length === 0 && (
              <p className="text-body-sm text-graphite">Nenhuma pendência sua no momento.</p>
            )}
            {doCliente.map((t) => (
              <div key={t.id} className="flex items-center gap-3 border-b border-ash py-2 last:border-b-0">
                <TarefaToggle tarefaId={t.id} concluida={t.concluida} interativa />
                <span
                  className={`text-body-sm ${t.concluida ? "text-graphite line-through" : "text-off-black-ink"}`}
                >
                  {t.titulo}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-caption font-medium uppercase text-graphite">Pendências da Stokys</p>
          <div className="mt-3 flex flex-col gap-2 rounded-3xl bg-pure-white p-6">
            {daStokys.length === 0 && (
              <p className="text-body-sm text-graphite">Nenhuma pendência da equipe no momento.</p>
            )}
            {daStokys.map((t) => (
              <div key={t.id} className="flex items-center gap-3 border-b border-ash py-2 last:border-b-0">
                <TarefaToggle tarefaId={t.id} concluida={t.concluida} interativa={false} />
                <span
                  className={`text-body-sm ${t.concluida ? "text-graphite line-through" : "text-off-black-ink"}`}
                >
                  {t.titulo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

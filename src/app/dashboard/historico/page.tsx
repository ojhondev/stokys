import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { eventos } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { getProjetoDoCliente } from "@/lib/queries/projetos";

// Módulo Histórico — log cronológico simples, só leitura. Populado por
// registrarEvento() a partir de mudança de status, tarefa, solicitação e
// revisão (ver lib/eventos.ts).

export default async function HistoricoPage() {
  const sessao = await getSession();
  if (!sessao) return null;

  const registro = await getProjetoDoCliente(sessao.userId);
  if (!registro) {
    return (
      <div>
        <span className="text-caption font-medium uppercase text-graphite">Histórico</span>
        <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
          Nenhum projeto encontrado
        </h1>
      </div>
    );
  }

  const lista = await getDb()
    .select()
    .from(eventos)
    .where(eq(eventos.projetoId, registro.projeto.id))
    .orderBy(desc(eventos.criadoEm));

  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Histórico</span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
        Tudo que aconteceu no seu projeto
      </h1>

      <div className="mt-6 flex flex-col gap-2 rounded-3xl bg-pure-white p-6">
        {lista.length === 0 && <p className="text-body-sm text-graphite">Nenhum evento ainda.</p>}
        {lista.map((e) => (
          <div
            key={e.id}
            className="flex items-center justify-between gap-4 border-b border-ash py-2 text-body-sm last:border-b-0"
          >
            <span className="text-off-black-ink">{e.descricao}</span>
            <span className="whitespace-nowrap text-caption text-graphite">
              {e.criadoEm.toLocaleDateString("pt-BR")} às{" "}
              {e.criadoEm.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { solicitacoes } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { getProjetoDoCliente } from "@/lib/queries/projetos";
import { SolicitacaoForm } from "@/components/dashboard/solicitacao-form";

const labelTipo = {
  alteracao: "Alteração",
  informacao: "Informação",
  conteudo: "Conteúdo",
} as const;

const labelStatus = {
  aberta: "Aberta",
  em_andamento: "Em andamento",
  concluida: "Concluída",
} as const;

export default async function SolicitacoesPage() {
  const sessao = await getSession();
  if (!sessao) return null;

  const registro = await getProjetoDoCliente(sessao.userId);
  if (!registro) {
    return (
      <div>
        <span className="text-caption font-medium uppercase text-graphite">Solicitações</span>
        <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
          Nenhum projeto encontrado
        </h1>
      </div>
    );
  }

  const lista = await getDb()
    .select()
    .from(solicitacoes)
    .where(eq(solicitacoes.projetoId, registro.projeto.id))
    .orderBy(desc(solicitacoes.criadoEm));

  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Solicitações</span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
        Pedir alteração, informação ou conteúdo
      </h1>

      <div className="mt-6 flex flex-col gap-3">
        {lista.length === 0 && (
          <p className="text-body-sm text-graphite">Você ainda não fez nenhuma solicitação.</p>
        )}
        {lista.map((s) => (
          <div key={s.id} className="rounded-3xl bg-pure-white p-6">
            <div className="flex items-center justify-between gap-4">
              <span className="text-caption font-medium uppercase text-graphite">
                {labelTipo[s.tipo]}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-caption font-medium ${
                  s.status === "concluida"
                    ? "bg-electric-lime text-off-black-ink"
                    : "bg-off-white-canvas text-graphite"
                }`}
              >
                {labelStatus[s.status]}
              </span>
            </div>
            <p className="mt-2 text-body-sm text-off-black-ink">{s.texto}</p>
            <p className="mt-2 text-caption text-graphite">
              {s.criadoEm.toLocaleDateString("pt-BR")}
            </p>
          </div>
        ))}
      </div>

      <SolicitacaoForm />
    </div>
  );
}

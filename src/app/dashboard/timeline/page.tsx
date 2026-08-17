import { asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { eventos } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { getProjetoDoCliente } from "@/lib/queries/projetos";
import { etapasProjeto, labelStatusProjeto } from "@/lib/status-projeto";

// Módulo Timeline — a mesma trilha de etapas da Visão geral, mas com mais
// detalhe: o que já foi concluído / está em andamento / vem depois, mais um
// histórico de quando cada status mudou (populado por registrarEvento() em
// atualizarStatusProjeto, ver lib/actions/admin.ts).

export default async function TimelinePage() {
  const sessao = await getSession();
  if (!sessao) return null;

  const registro = await getProjetoDoCliente(sessao.userId);
  if (!registro) {
    return (
      <div>
        <span className="text-caption font-medium uppercase text-graphite">Timeline</span>
        <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
          Nenhum projeto encontrado
        </h1>
      </div>
    );
  }

  const { projeto } = registro;
  const etapaAtualIndex = etapasProjeto.findIndex((e) => e.chave === projeto.status);

  const historicoStatus = await getDb()
    .select()
    .from(eventos)
    .where(eq(eventos.projetoId, projeto.id))
    .orderBy(asc(eventos.criadoEm));

  const mudancasDeStatus = historicoStatus.filter((e) => e.descricao.startsWith("Status mudou"));

  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Timeline</span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
        Etapas do seu projeto
      </h1>

      <div className="mt-6 flex flex-col gap-3">
        {etapasProjeto.map((etapa, i) => {
          const situacao = i < etapaAtualIndex ? "concluida" : i === etapaAtualIndex ? "andamento" : "futura";
          return (
            <div
              key={etapa.chave}
              className="flex items-center gap-4 rounded-3xl bg-pure-white p-6"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-caption font-medium ${
                  situacao === "futura"
                    ? "bg-off-white-canvas text-graphite"
                    : "bg-electric-lime text-off-black-ink"
                }`}
              >
                {situacao === "concluida" ? "✓" : i + 1}
              </span>
              <div className="flex flex-1 items-center justify-between gap-4">
                <p className="text-body-sm font-medium text-off-black-ink">{etapa.label}</p>
                <span className="text-caption font-medium uppercase text-graphite">
                  {situacao === "concluida"
                    ? "Concluída"
                    : situacao === "andamento"
                      ? "Em andamento"
                      : "Vem depois"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-caption font-medium uppercase text-graphite">
        Histórico de mudanças
      </p>
      <div className="mt-4 flex flex-col gap-2 rounded-3xl bg-pure-white p-6">
        {mudancasDeStatus.length === 0 && (
          <p className="text-body-sm text-graphite">
            Ainda não teve mudança de etapa — o projeto está em {labelStatusProjeto[projeto.status]}.
          </p>
        )}
        {mudancasDeStatus.map((e) => (
          <div
            key={e.id}
            className="flex items-center justify-between gap-4 border-b border-ash py-2 text-body-sm last:border-b-0"
          >
            <span className="text-off-black-ink">{e.descricao}</span>
            <span className="whitespace-nowrap text-caption text-graphite">
              {e.criadoEm.toLocaleDateString("pt-BR")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

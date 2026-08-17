import { asc, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { revisoes, revisaoComentarios, usuarios } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { getProjetoDoCliente } from "@/lib/queries/projetos";
import { RevisaoCard } from "@/components/dashboard/revisao-card";

// Módulo Revisões — versões entregues pela equipe (link ou arquivo), o
// cliente aprova ou pede mudanças, com comentários por versão.

export default async function RevisoesPage() {
  const sessao = await getSession();
  if (!sessao) return null;

  const registro = await getProjetoDoCliente(sessao.userId);
  if (!registro) {
    return (
      <div>
        <span className="text-caption font-medium uppercase text-graphite">Revisões</span>
        <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
          Nenhum projeto encontrado
        </h1>
      </div>
    );
  }

  const db = getDb();
  const lista = await db
    .select()
    .from(revisoes)
    .where(eq(revisoes.projetoId, registro.projeto.id))
    .orderBy(desc(revisoes.criadoEm));

  const idsRevisoes = lista.map((r) => r.id);
  const comentarios = idsRevisoes.length
    ? await db
        .select({
          id: revisaoComentarios.id,
          revisaoId: revisaoComentarios.revisaoId,
          texto: revisaoComentarios.texto,
          criadoEm: revisaoComentarios.criadoEm,
          autorNome: usuarios.nome,
        })
        .from(revisaoComentarios)
        .innerJoin(usuarios, eq(revisaoComentarios.autorId, usuarios.id))
        .where(inArray(revisaoComentarios.revisaoId, idsRevisoes))
        .orderBy(asc(revisaoComentarios.criadoEm))
    : [];

  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Revisões</span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
        Versões entregues
      </h1>

      <div className="mt-6 flex flex-col gap-4">
        {lista.length === 0 && (
          <p className="text-body-sm text-graphite">
            Nenhuma versão entregue ainda — a produção avisa por aqui quando tiver algo pra você
            revisar.
          </p>
        )}
        {lista.map((r) => (
          <RevisaoCard
            key={r.id}
            revisaoId={r.id}
            titulo={r.titulo}
            linkOuArquivoUrl={r.linkOuArquivoUrl}
            status={r.status}
            criadoEm={r.criadoEm}
            comentarios={comentarios.filter((c) => c.revisaoId === r.id)}
            podeAprovar
          />
        ))}
      </div>
    </div>
  );
}

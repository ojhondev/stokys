import { notFound } from "next/navigation";
import { asc, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  projetos,
  usuarios,
  planos,
  acessosPlataforma,
  mensagens,
  tarefas,
  solicitacoes,
  revisoes,
  revisaoComentarios,
} from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { formatarPreco, nomeExibicaoPlano } from "@/lib/planos-conteudo";
import { labelPlataforma } from "@/lib/labels-projeto";
import { ProjetoControls } from "@/components/admin/projeto-controls";
import { VisaoGeralControls } from "@/components/admin/visao-geral-controls";
import { TarefasEquipe } from "@/components/admin/tarefas-equipe";
import { SolicitacoesEquipe } from "@/components/admin/solicitacoes-equipe";
import { RevisoesEquipe } from "@/components/admin/revisoes-equipe";
import { MensagemForm } from "@/components/dashboard/mensagem-form";

export default async function ProjetoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sessao = await getSession();
  if (!sessao) return null;

  const db = getDb();

  const [registro] = await db
    .select({ projeto: projetos, cliente: usuarios, plano: planos })
    .from(projetos)
    .innerJoin(usuarios, eq(projetos.clienteId, usuarios.id))
    .innerJoin(planos, eq(projetos.planoId, planos.id))
    .where(eq(projetos.id, id))
    .limit(1);

  if (!registro) notFound();
  const { projeto, cliente, plano } = registro;

  if (sessao.papel === "producao" && projeto.responsavelId !== sessao.userId) {
    notFound();
  }

  const [acessos] = await db
    .select()
    .from(acessosPlataforma)
    .where(eq(acessosPlataforma.projetoId, projeto.id))
    .limit(1);

  const tarefasDoProjeto = await db
    .select()
    .from(tarefas)
    .where(eq(tarefas.projetoId, projeto.id))
    .orderBy(asc(tarefas.criadoEm));

  const solicitacoesDoProjeto = await db
    .select()
    .from(solicitacoes)
    .where(eq(solicitacoes.projetoId, projeto.id))
    .orderBy(desc(solicitacoes.criadoEm));

  const revisoesDoProjeto = await db
    .select()
    .from(revisoes)
    .where(eq(revisoes.projetoId, projeto.id))
    .orderBy(desc(revisoes.criadoEm));

  const idsRevisoes = revisoesDoProjeto.map((r) => r.id);
  const comentariosDasRevisoes = idsRevisoes.length
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

  const revisoesComComentarios = revisoesDoProjeto.map((r) => ({
    ...r,
    comentarios: comentariosDasRevisoes.filter((c) => c.revisaoId === r.id),
  }));

  const thread = await db
    .select({
      id: mensagens.id,
      texto: mensagens.texto,
      anexoUrl: mensagens.anexoUrl,
      criadoEm: mensagens.criadoEm,
      autorNome: usuarios.nome,
    })
    .from(mensagens)
    .innerJoin(usuarios, eq(mensagens.autorId, usuarios.id))
    .where(eq(mensagens.projetoId, projeto.id))
    .orderBy(asc(mensagens.criadoEm));

  const podeAtribuir = sessao.papel === "master" || sessao.papel === "admin";
  const producaoDisponivel = podeAtribuir
    ? await db
        .select({ id: usuarios.id, nome: usuarios.nome })
        .from(usuarios)
        .where(eq(usuarios.papel, "producao"))
    : [];

  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Projeto</span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
        {cliente.nome} — {nomeExibicaoPlano(plano.nome)}
      </h1>
      <p className="mt-1 text-body-sm text-graphite">{cliente.email}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 rounded-3xl bg-pure-white p-6 text-body-sm">
            <div className="flex items-center justify-between">
              <span className="text-graphite">Plataforma</span>
              <span className="font-bold text-off-black-ink">
                {projeto.plataforma === "outra"
                  ? projeto.plataformaOutraNome
                  : labelPlataforma[projeto.plataforma]}
              </span>
            </div>
            {projeto.tema && (
              <div className="flex items-center justify-between">
                <span className="text-graphite">Tema</span>
                <span className="font-bold text-off-black-ink">{projeto.tema}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-graphite">Nicho</span>
              <span className="font-bold text-off-black-ink">{projeto.nicho}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-graphite">Valor</span>
              <span className="font-bold text-off-black-ink">
                {formatarPreco(projeto.precoNoMomentoDaCompraCentavos)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-graphite">Acessos de plataforma</span>
              <span className="font-bold text-off-black-ink">
                {acessos && !acessos.revogadoEm ? "Recebidos" : "Pendentes"}
              </span>
            </div>
          </div>

          <div>
            <p className="text-caption font-medium uppercase text-graphite">Referências</p>
            <ul className="mt-2 flex flex-col gap-1">
              {projeto.referencias.map((ref, i) => (
                <li key={i} className="text-body-sm text-off-black-ink">
                  {ref}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2 rounded-3xl bg-pure-white p-6 text-body-sm">
            <p className="text-caption font-medium uppercase text-graphite">Briefing</p>
            <div className="flex items-center justify-between gap-4">
              <span className="text-graphite">Identidade (Drive)</span>
              {projeto.identidadeDriveUrl ? (
                <a
                  href={projeto.identidadeDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-off-black-ink underline"
                >
                  Abrir link
                </a>
              ) : (
                <span className="font-bold text-off-black-ink">Pendente</span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-graphite">Público</span>
              <span className="font-medium text-off-black-ink">{projeto.publico || "—"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-graphite">Posicionamento</span>
              <span className="font-medium text-off-black-ink">{projeto.posicionamento || "—"}</span>
            </div>
          </div>

          <VisaoGeralControls
            projetoId={projeto.id}
            prazoEstimadoDias={projeto.prazoEstimadoDias}
            proximaAcao={projeto.proximaAcao}
          />

          <TarefasEquipe projetoId={projeto.id} tarefas={tarefasDoProjeto} />

          <SolicitacoesEquipe solicitacoes={solicitacoesDoProjeto} />

          <RevisoesEquipe projetoId={projeto.id} revisoes={revisoesComComentarios} />

          <ProjetoControls
            projetoId={projeto.id}
            statusAtual={projeto.status}
            producaoDisponivel={producaoDisponivel}
            responsavelAtualId={projeto.responsavelId}
            podeAtribuir={podeAtribuir}
          />
        </div>

        <div>
          <p className="text-caption font-medium uppercase text-graphite">Mensagens</p>
          <div className="mt-4 flex flex-col gap-4">
            {thread.length === 0 && (
              <p className="text-body-sm text-graphite">Nenhuma mensagem ainda.</p>
            )}
            {thread.map((m) => (
              <div key={m.id} className="rounded-3xl bg-pure-white p-6">
                <div className="flex items-center justify-between">
                  <p className="text-caption font-medium uppercase text-graphite">{m.autorNome}</p>
                  <p className="text-caption text-graphite">{m.criadoEm.toLocaleDateString("pt-BR")}</p>
                </div>
                {m.texto && <p className="mt-2 text-body-sm text-off-black-ink">{m.texto}</p>}
                {m.anexoUrl && (
                  <a
                    href={m.anexoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-body-sm font-medium text-off-black-ink underline"
                  >
                    Ver anexo
                  </a>
                )}
              </div>
            ))}
          </div>
          <MensagemForm projetoIdParaEquipe={projeto.id} />
        </div>
      </div>
    </div>
  );
}

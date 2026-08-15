import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { projetos, usuarios, planos, acessosPlataforma, mensagens } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { formatarPreco, nomeExibicaoPlano } from "@/lib/planos-conteudo";
import { ProjetoControls } from "@/components/admin/projeto-controls";
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

  const thread = await db
    .select({
      id: mensagens.id,
      texto: mensagens.texto,
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
              <span className="font-bold text-off-black-ink">{projeto.plataforma}</span>
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
                <p className="mt-2 text-body-sm text-off-black-ink">{m.texto}</p>
              </div>
            ))}
          </div>
          <MensagemForm projetoIdParaEquipe={projeto.id} />
        </div>
      </div>
    </div>
  );
}

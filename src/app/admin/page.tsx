import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { projetos, usuarios, planos } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { formatarPreco, nomeExibicaoPlano } from "@/lib/planos-conteudo";
import { labelStatusProjeto as labelStatus } from "@/lib/status-projeto";
import { ProjetoArquivarToggle } from "@/components/admin/projeto-arquivar-toggle";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ arquivados?: string }>;
}) {
  const sessao = await getSession();
  if (!sessao) return null;

  const { arquivados: arquivadosParam } = await searchParams;
  const verArquivados = arquivadosParam === "1";

  const db = getDb();
  const query = db
    .select({
      id: projetos.id,
      status: projetos.status,
      plataforma: projetos.plataforma,
      precoCentavos: projetos.precoNoMomentoDaCompraCentavos,
      criadoEm: projetos.criadoEm,
      arquivado: projetos.arquivado,
      clienteNome: usuarios.nome,
      clienteEmail: usuarios.email,
      planoNome: planos.nome,
    })
    .from(projetos)
    .innerJoin(usuarios, eq(projetos.clienteId, usuarios.id))
    .innerJoin(planos, eq(projetos.planoId, planos.id))
    .orderBy(desc(projetos.criadoEm));

  const filtroArquivado = eq(projetos.arquivado, verArquivados);
  const lista =
    sessao.papel === "producao"
      ? await query.where(and(eq(projetos.responsavelId, sessao.userId), filtroArquivado))
      : await query.where(filtroArquivado);

  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Painel interno</span>
      <div className="mt-1 flex items-center justify-between gap-4">
        <h1 className="text-heading font-heading font-bold text-off-black-ink">
          {verArquivados ? "Projetos arquivados" : "Projetos"}
        </h1>
        <Link
          href={verArquivados ? "/admin" : "/admin?arquivados=1"}
          className="text-body-sm font-medium text-graphite underline underline-offset-4"
        >
          {verArquivados ? "Ver ativos" : "Ver arquivados"}
        </Link>
      </div>

      {lista.length === 0 && (
        <p className="mt-6 text-body-sm text-graphite">
          {verArquivados ? "Nenhum projeto arquivado." : "Nenhum projeto por aqui ainda."}
        </p>
      )}

      <div className="mt-8 overflow-x-auto rounded-3xl bg-pure-white">
        {lista.length > 0 && (
          <table className="w-full min-w-[780px] border-collapse text-body-sm">
            <thead>
              <tr className="border-b border-ash text-left text-caption font-medium uppercase text-graphite">
                <th className="px-6 py-4">Cliente</th>
                <th className="px-4 py-4">Plano</th>
                <th className="px-4 py-4">Plataforma</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Valor</th>
                <th className="px-4 py-4">Criado em</th>
                <th className="px-4 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {lista.map((p) => (
                <tr key={p.id} className="border-b border-ash last:border-b-0">
                  <td className="px-6 py-4">
                    <Link href={`/admin/projetos/${p.id}`} className="font-bold text-off-black-ink underline underline-offset-4">
                      {p.clienteNome}
                    </Link>
                    <p className="text-caption text-graphite">{p.clienteEmail}</p>
                  </td>
                  <td className="px-4 py-4 text-off-black-ink">{nomeExibicaoPlano(p.planoNome)}</td>
                  <td className="px-4 py-4 text-off-black-ink">{p.plataforma}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-off-white-canvas px-3 py-1 text-caption font-medium text-off-black-ink">
                      {labelStatus[p.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-off-black-ink">{formatarPreco(p.precoCentavos)}</td>
                  <td className="px-4 py-4 text-graphite">{p.criadoEm.toLocaleDateString("pt-BR")}</td>
                  <td className="px-4 py-4">
                    <ProjetoArquivarToggle projetoId={p.id} arquivado={p.arquivado} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

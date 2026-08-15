import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { projetos, usuarios, planos } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { formatarPreco, nomeExibicaoPlano } from "@/lib/planos-conteudo";

const labelStatus = {
  onboarding: "Onboarding",
  aguardando_pagamento: "Aguardando pagamento",
  em_producao: "Em produção",
  preview_disponivel: "Preview disponível",
  entregue: "Entregue",
} as const;

export default async function AdminPage() {
  const sessao = await getSession();
  if (!sessao) return null;

  const db = getDb();
  const query = db
    .select({
      id: projetos.id,
      status: projetos.status,
      plataforma: projetos.plataforma,
      precoCentavos: projetos.precoNoMomentoDaCompraCentavos,
      criadoEm: projetos.criadoEm,
      clienteNome: usuarios.nome,
      clienteEmail: usuarios.email,
      planoNome: planos.nome,
    })
    .from(projetos)
    .innerJoin(usuarios, eq(projetos.clienteId, usuarios.id))
    .innerJoin(planos, eq(projetos.planoId, planos.id))
    .orderBy(desc(projetos.criadoEm));

  const lista =
    sessao.papel === "producao"
      ? await query.where(eq(projetos.responsavelId, sessao.userId))
      : await query;

  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Painel interno</span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">Projetos</h1>

      {lista.length === 0 && (
        <p className="mt-6 text-body-sm text-graphite">Nenhum projeto por aqui ainda.</p>
      )}

      <div className="mt-8 overflow-x-auto rounded-3xl bg-pure-white">
        {lista.length > 0 && (
          <table className="w-full min-w-[720px] border-collapse text-body-sm">
            <thead>
              <tr className="border-b border-ash text-left text-caption font-medium uppercase text-graphite">
                <th className="px-6 py-4">Cliente</th>
                <th className="px-4 py-4">Plano</th>
                <th className="px-4 py-4">Plataforma</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Valor</th>
                <th className="px-4 py-4">Criado em</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

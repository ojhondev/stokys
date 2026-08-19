import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { leads, projetos, planos, personalizacoes } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { LeadsTable } from "@/components/admin/leads-table";

// Leads capturados pelo popup de vídeo da LP e pela etapa "Contato" do
// onboarding (ver marketing/video-popup.tsx e onboarding/steps/contato-step.tsx)
// — só master/admin acessam, mesmo padrão de Upsells. Quando o lead completa
// o onboarding inteiro, leads.projetoId é preenchido (ver lib/actions/onboarding.ts)
// e a ficha completa aparece na janela lateral em vez de só o contato.
export default async function AdminLeadsPage() {
  const sessao = await getSession();
  if (!sessao || !["master", "admin"].includes(sessao.papel)) {
    redirect("/login?next=/admin/leads");
  }

  const lista = await getDb()
    .select({
      id: leads.id,
      nome: leads.nome,
      whatsapp: leads.whatsapp,
      email: leads.email,
      contatado: leads.contatado,
      criadoEm: leads.criadoEm,
      projetoId: leads.projetoId,
      planoNome: planos.nome,
      precoCentavos: projetos.precoNoMomentoDaCompraCentavos,
      plataforma: projetos.plataforma,
      plataformaOutraNome: projetos.plataformaOutraNome,
      tema: projetos.tema,
      nicho: projetos.nicho,
      referencias: projetos.referencias,
      objetivoCliente: projetos.objetivoCliente,
      statusProjeto: projetos.status,
      mercadoAlvo: personalizacoes.mercadoAlvo,
      possuiIdentidadeVisual: personalizacoes.possuiIdentidadeVisual,
      paletaCores: personalizacoes.paletaCores,
    })
    .from(leads)
    .leftJoin(projetos, eq(leads.projetoId, projetos.id))
    .leftJoin(planos, eq(projetos.planoId, planos.id))
    .leftJoin(personalizacoes, eq(personalizacoes.projetoId, projetos.id))
    .orderBy(desc(leads.criadoEm));

  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Painel interno</span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">Leads</h1>
      <p className="mt-1 text-body-sm text-graphite">
        Cadastros feitos pelo popup de vídeo e pela primeira etapa do onboarding.
      </p>

      <LeadsTable leads={lista} />
    </div>
  );
}

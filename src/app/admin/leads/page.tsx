import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { LeadToggle } from "@/components/admin/lead-toggle";

// Leads capturados pelo popup de vídeo da LP (ver marketing/video-popup.tsx)
// — só master/admin acessam, mesmo padrão de upsells/vencedor-da-semana.
function linkWhatsappLead(whatsapp: string, nome: string): string {
  const numero = whatsapp.replace(/\D/g, "");
  const mensagem = `Olá, ${nome}! Vi que você se interessou pela Stokys, vamos conversar?`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

export default async function AdminLeadsPage() {
  const sessao = await getSession();
  if (!sessao || !["master", "admin"].includes(sessao.papel)) {
    redirect("/login?next=/admin/leads");
  }

  const lista = await getDb().select().from(leads).orderBy(desc(leads.criadoEm));

  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Painel interno</span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">Leads</h1>
      <p className="mt-1 text-body-sm text-graphite">
        Cadastros feitos pelo popup de vídeo da landing page.
      </p>

      {lista.length === 0 && (
        <p className="mt-6 text-body-sm text-graphite">Nenhum lead por aqui ainda.</p>
      )}

      <div className="mt-8 overflow-x-auto rounded-3xl bg-pure-white">
        {lista.length > 0 && (
          <table className="w-full min-w-[760px] border-collapse text-body-sm">
            <thead>
              <tr className="border-b border-ash text-left text-caption font-medium uppercase text-graphite">
                <th className="px-6 py-4">Nome</th>
                <th className="px-4 py-4">WhatsApp</th>
                <th className="px-4 py-4">E-mail</th>
                <th className="px-4 py-4">Recebido em</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {lista.map((lead) => (
                <tr key={lead.id} className="border-b border-ash last:border-b-0">
                  <td className="px-6 py-4 font-bold text-off-black-ink">{lead.nome}</td>
                  <td className="px-4 py-4 text-off-black-ink">{lead.whatsapp}</td>
                  <td className="px-4 py-4 text-off-black-ink">{lead.email}</td>
                  <td className="px-4 py-4 text-graphite">
                    {lead.criadoEm.toLocaleString("pt-BR")}
                  </td>
                  <td className="px-4 py-4">
                    <LeadToggle leadId={lead.id} contatado={lead.contatado} />
                  </td>
                  <td className="px-4 py-4">
                    <a
                      href={linkWhatsappLead(lead.whatsapp, lead.nome)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-off-black-ink underline underline-offset-4"
                    >
                      Chamar no WhatsApp
                    </a>
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

import { asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { mensagens, usuarios } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { getProjetoDoCliente } from "@/lib/queries/projetos";
import { MensagemForm } from "@/components/dashboard/mensagem-form";

export default async function MensagensPage() {
  const sessao = await getSession();
  if (!sessao) return null;

  const registro = await getProjetoDoCliente(sessao.userId);
  if (!registro) {
    return (
      <div>
        <span className="text-caption font-medium uppercase text-graphite">Mensagens</span>
        <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
          Nenhum projeto encontrado
        </h1>
      </div>
    );
  }

  const lista = await getDb()
    .select({
      id: mensagens.id,
      texto: mensagens.texto,
      criadoEm: mensagens.criadoEm,
      autorPapel: usuarios.papel,
    })
    .from(mensagens)
    .innerJoin(usuarios, eq(mensagens.autorId, usuarios.id))
    .where(eq(mensagens.projetoId, registro.projeto.id))
    .orderBy(asc(mensagens.criadoEm));

  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Mensagens</span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
        Conversa com a produção
      </h1>

      <div className="mt-8 flex flex-col gap-4">
        {lista.length === 0 && (
          <p className="text-body-sm text-graphite">
            Nenhuma mensagem ainda — mande um oi pra produção.
          </p>
        )}
        {lista.map((m) => (
          <div key={m.id} className="rounded-3xl bg-pure-white p-6">
            <div className="flex items-center justify-between">
              <p className="text-caption font-medium uppercase text-graphite">
                {m.autorPapel === "cliente" ? "Você" : "Produção Stokys"}
              </p>
              <p className="text-caption text-graphite">{m.criadoEm.toLocaleDateString("pt-BR")}</p>
            </div>
            <p className="mt-2 text-body-sm text-off-black-ink">{m.texto}</p>
          </div>
        ))}
      </div>

      <MensagemForm />
    </div>
  );
}

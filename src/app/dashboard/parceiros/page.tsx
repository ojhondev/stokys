import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { parceiros } from "@/lib/db/schema";

// Vitrine de parceiros (tráfego pago) — vive dentro do dashboard autenticado
// de propósito: o lead precisa estar cadastrado como cliente pra ter acesso
// (decisão do usuário, ver plano V1). Vitrine + WhatsApp, sem rastreio de lead.
export default async function ParceirosPage() {
  const lista = await getDb().select().from(parceiros).where(eq(parceiros.ativo, true));

  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Tráfego Pago</span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
        Parceiros pra escalar sua loja
      </h1>
      <p className="mt-2 max-w-[520px] text-body-sm text-graphite">
        Agências de performance e tráfego pago recomendadas pela Stokys. Contato direto pelo
        WhatsApp, sem intermediário.
      </p>

      {lista.length === 0 ? (
        <p className="mt-8 text-body-sm text-graphite">Nenhum parceiro disponível no momento.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {lista.map((p) => (
            <div key={p.id} className="flex flex-col gap-3 rounded-3xl bg-pure-white p-6">
              <div>
                <p className="text-body-sm font-bold text-off-black-ink">{p.nome}</p>
                <p className="text-caption text-graphite">{p.especialidade}</p>
              </div>
              {p.descricao && <p className="text-body-sm text-off-black-ink">{p.descricao}</p>}
              <a
                href={p.linkWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-fit rounded-full bg-electric-lime px-5 py-2.5 text-body-sm font-bold text-off-black-ink"
              >
                Falar no WhatsApp
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

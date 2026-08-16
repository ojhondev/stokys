import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { catalogoUpsells } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { formatarPreco } from "@/lib/planos-conteudo";
import { CriarUpsellForm } from "@/components/admin/criar-upsell-form";
import { UpsellAtivoToggle } from "@/components/admin/upsell-ativo-toggle";

export default async function AdminUpsellsPage() {
  const sessao = await getSession();
  if (!sessao || !["master", "admin"].includes(sessao.papel)) {
    redirect("/admin");
  }

  const catalogo = await getDb().select().from(catalogoUpsells).orderBy(catalogoUpsells.ordem);

  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Painel interno</span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
        Catálogo de upsells
      </h1>
      <p className="mt-2 max-w-[520px] text-body-sm text-graphite">
        Upsells ativos aparecem pro cliente na tela de Pagamentos, antes de ele gerar a cobrança.
      </p>

      <div className="mt-8 overflow-hidden rounded-3xl bg-pure-white">
        {catalogo.length === 0 && (
          <p className="p-6 text-body-sm text-graphite">Nenhum upsell cadastrado ainda.</p>
        )}
        {catalogo.map((u) => (
          <div
            key={u.id}
            className="flex items-center justify-between border-b border-ash p-6 last:border-b-0"
          >
            <div>
              <p className="text-body-sm font-bold text-off-black-ink">{u.nome}</p>
              {u.descricao && <p className="text-caption text-graphite">{u.descricao}</p>}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-body-sm text-off-black-ink">
                {formatarPreco(u.valorCentavos)}
              </span>
              <UpsellAtivoToggle id={u.id} ativo={u.ativo} />
            </div>
          </div>
        ))}
      </div>

      <CriarUpsellForm />
    </div>
  );
}

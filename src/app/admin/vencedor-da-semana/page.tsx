import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { produtosVencedores } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { CriarVencedorForm } from "@/components/admin/criar-vencedor-form";
import { VencedorPublicadoToggle } from "@/components/admin/vencedor-publicado-toggle";

export default async function AdminVencedorDaSemanaPage() {
  const sessao = await getSession();
  if (!sessao || !["master", "admin"].includes(sessao.papel)) {
    redirect("/admin");
  }

  const vencedores = await getDb()
    .select()
    .from(produtosVencedores)
    .orderBy(desc(produtosVencedores.semanaInicio));

  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Painel interno</span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
        Produto Vencedor da Semana
      </h1>
      <p className="mt-2 max-w-[520px] text-body-sm text-graphite">
        Só produtos publicados aparecem pro cliente — o mais recente com data já passada é o exibido.
      </p>

      <div className="mt-8 overflow-hidden rounded-3xl bg-pure-white">
        {vencedores.length === 0 && (
          <p className="p-6 text-body-sm text-graphite">Nenhum produto cadastrado ainda.</p>
        )}
        {vencedores.map((v) => (
          <div
            key={v.id}
            className="flex items-center justify-between border-b border-ash p-6 last:border-b-0"
          >
            <div>
              <p className="text-body-sm font-bold text-off-black-ink">{v.nome}</p>
              <p className="text-caption text-graphite">
                Semana de {new Date(`${v.semanaInicio}T00:00:00`).toLocaleDateString("pt-BR")}
                {v.nicho ? ` · ${v.nicho}` : ""}
              </p>
            </div>
            <VencedorPublicadoToggle id={v.id} publicado={v.publicado} />
          </div>
        ))}
      </div>

      <CriarVencedorForm />
    </div>
  );
}

import { redirect } from "next/navigation";
import { inArray } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { usuarios } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { CriarFuncionarioForm } from "@/components/admin/criar-funcionario-form";

const labelPapel = { master: "Master", admin: "Admin", producao: "Produção" } as const;

export default async function EquipePage() {
  const sessao = await getSession();
  if (!sessao || sessao.papel !== "master") {
    redirect("/admin");
  }

  const equipe = await getDb()
    .select({ id: usuarios.id, nome: usuarios.nome, email: usuarios.email, papel: usuarios.papel })
    .from(usuarios)
    .where(inArray(usuarios.papel, ["master", "admin", "producao"]));

  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Painel interno</span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">Equipe</h1>
      <p className="mt-2 max-w-[520px] text-body-sm text-graphite">
        Só o master cria contas de equipe — sem cadastro público de admin/produção.
      </p>

      <div className="mt-8 overflow-hidden rounded-3xl bg-pure-white">
        {equipe.map((u) => (
          <div
            key={u.id}
            className="flex items-center justify-between border-b border-ash p-6 last:border-b-0"
          >
            <div>
              <p className="text-body-sm font-bold text-off-black-ink">{u.nome}</p>
              <p className="text-caption text-graphite">{u.email}</p>
            </div>
            <span className="rounded-full bg-off-white-canvas px-3 py-1 text-caption font-medium text-off-black-ink">
              {labelPapel[u.papel as keyof typeof labelPapel]}
            </span>
          </div>
        ))}
      </div>

      <CriarFuncionarioForm />
    </div>
  );
}

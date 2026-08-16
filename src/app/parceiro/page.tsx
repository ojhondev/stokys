import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { parceiros } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { PerfilParceiroForm } from "@/components/parceiro/perfil-form";

export default async function ParceiroPage() {
  const sessao = await getSession();
  if (!sessao) return null;

  const [parceiro] = await getDb()
    .select()
    .from(parceiros)
    .where(eq(parceiros.usuarioId, sessao.userId))
    .limit(1);

  if (!parceiro) {
    return (
      <div>
        <span className="text-caption font-medium uppercase text-graphite">Parceiro</span>
        <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
          Perfil não encontrado
        </h1>
      </div>
    );
  }

  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Parceiro</span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">Seu perfil</h1>

      <div className="mt-4 rounded-2xl bg-pure-white p-5">
        {parceiro.ativo ? (
          <p className="text-body-sm font-medium text-off-black-ink">
            Seu perfil está ativo e aparece na vitrine de parceiros pros clientes Stokys.
          </p>
        ) : (
          <p className="text-body-sm font-medium text-off-black-ink">
            Seu cadastro está em análise. Assim que for aprovado, seu perfil aparece na vitrine de
            parceiros pros clientes Stokys.
          </p>
        )}
      </div>

      <div className="mt-8 rounded-3xl bg-pure-white p-6">
        <p className="text-caption font-medium uppercase text-graphite">Editar perfil da vitrine</p>
        <PerfilParceiroForm parceiro={parceiro} />
      </div>
    </div>
  );
}

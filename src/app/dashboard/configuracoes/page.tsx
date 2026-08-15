import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { acessosPlataforma } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { getProjetoDoCliente } from "@/lib/queries/projetos";
import { AcessosForm } from "@/components/dashboard/acessos-form";

// Acessos da plataforma (Shopify/Nuvemshop) — ver docs/PRD.md 4.2.1: pedidos
// aqui, dentro do painel, não no onboarding. Nunca decifra/re-exibe o segredo
// salvo pro cliente — só confirma que já tem um cadastro válido.

export default async function ConfiguracoesPage() {
  const sessao = await getSession();
  if (!sessao) return null;

  const registro = await getProjetoDoCliente(sessao.userId);
  if (!registro) {
    return (
      <div>
        <span className="text-caption font-medium uppercase text-graphite">Configurações</span>
        <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
          Nenhum projeto encontrado
        </h1>
      </div>
    );
  }

  const [acessos] = await getDb()
    .select()
    .from(acessosPlataforma)
    .where(eq(acessosPlataforma.projetoId, registro.projeto.id))
    .limit(1);

  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Configurações</span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
        Acessos da plataforma
      </h1>
      <p className="mt-2 max-w-[520px] text-body-sm text-graphite">
        A produção precisa desses acessos pra implementar sua loja. Ficam criptografados e são
        revogados assim que a loja é entregue.
      </p>

      {acessos && !acessos.revogadoEm && (
        <p className="mt-4 text-body-sm font-medium text-off-black-ink">
          Acessos salvos em {acessos.criadoEm.toLocaleDateString("pt-BR")} — usuário{" "}
          {acessos.usuarioAcesso}. Envie o formulário abaixo de novo se algo mudou.
        </p>
      )}

      <AcessosForm />
    </div>
  );
}

import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { acessosPlataforma } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { getProjetoDoCliente } from "@/lib/queries/projetos";
import { labelPlataforma } from "@/lib/labels-projeto";
import { AcessosForm } from "@/components/dashboard/acessos-form";
import { DominioForm } from "@/components/dashboard/dominio-form";

// Acessos da plataforma (Shopify/Nuvemshop) — ver docs/PRD.md 4.2.1: pedidos
// aqui, dentro do painel, não no onboarding. Nunca decifra/re-exibe o segredo
// salvo pro cliente — só confirma que já tem um cadastro válido.
//
// Módulo "Informações da loja" (Fase 2) fundido aqui em vez de virar tela
// nova — mesmo dado (domínio/plataforma/produtos/integrações), fica junto
// dos acessos que já vivem nesta página.

const integracoesPadrao = [
  "Meta Pixel",
  "Google Analytics",
  "WhatsApp Business",
  "Gateway de pagamento",
];

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

  const { projeto, plano } = registro;

  const [acessos] = await getDb()
    .select()
    .from(acessosPlataforma)
    .where(eq(acessosPlataforma.projetoId, projeto.id))
    .limit(1);

  const itensPlano = (plano.escopo as { itens?: string[] } | null)?.itens ?? [];
  const itemProdutos = itensPlano.find((item) => item.toLowerCase().includes("produto"));

  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Configurações</span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
        Informações da loja
      </h1>

      <div className="mt-6 flex flex-col gap-2 rounded-3xl bg-pure-white p-6 text-body-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-graphite">Plataforma</span>
          <span className="font-bold text-off-black-ink">
            {projeto.plataforma === "outra" ? projeto.plataformaOutraNome : labelPlataforma[projeto.plataforma]}
          </span>
        </div>
        {itemProdutos && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-graphite">Produtos</span>
            <span className="font-bold text-off-black-ink">{itemProdutos}</span>
          </div>
        )}
      </div>

      <div className="mt-4 rounded-3xl bg-pure-white p-6">
        <DominioForm dominioAtual={projeto.dominio ?? ""} />
      </div>

      <div className="mt-4 rounded-3xl bg-pure-white p-6">
        <p className="text-caption font-medium uppercase text-graphite">Integrações</p>
        <p className="mt-1 text-caption text-graphite">
          Configuradas junto com a produção depois da entrega da loja.
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {integracoesPadrao.map((nome) => (
            <li key={nome} className="flex items-center justify-between text-body-sm">
              <span className="text-off-black-ink">{nome}</span>
              <span className="text-caption uppercase text-graphite">A configurar</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-8 text-caption font-medium uppercase text-graphite">Acessos da plataforma</p>
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

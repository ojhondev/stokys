import { and, desc, eq, isNull } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { cobrancas, catalogoUpsells, projetoItens } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { getProjetoDoCliente } from "@/lib/queries/projetos";
import { formatarPreco } from "@/lib/planos-conteudo";
import { PagamentoForm } from "@/components/dashboard/pagamento-form";
import { UpsellsCatalogo } from "@/components/dashboard/upsells-catalogo";
import { labelPlataforma } from "@/lib/labels-projeto";

const labelMetodo = { pix: "PIX", cartao: "Cartão", boleto: "Boleto" } as const;
const labelStatus = {
  pendente: "Pendente",
  pago: "Pago",
  expirado: "Expirado",
  estornado: "Estornado",
} as const;

export default async function PagamentosPage() {
  const sessao = await getSession();
  if (!sessao) return null; // middleware já garante sessão; guarda extra pro type-check.

  const registro = await getProjetoDoCliente(sessao.userId);
  if (!registro) {
    return (
      <div>
        <span className="text-caption font-medium uppercase text-graphite">Pagamentos</span>
        <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
          Nenhum projeto encontrado
        </h1>
        <p className="mt-2 text-body-sm text-graphite">
          Fale com a produção pelo WhatsApp se você acha que isso é um erro.
        </p>
      </div>
    );
  }

  const { projeto } = registro;
  const db = getDb();
  const historico = await db
    .select()
    .from(cobrancas)
    .where(eq(cobrancas.projetoId, projeto.id))
    .orderBy(desc(cobrancas.criadoEm));

  const jaPago = projeto.status !== "aguardando_pagamento" && projeto.status !== "onboarding";
  const cobrancaPendente = historico.find((c) => c.status === "pendente") ?? null;

  // Com cobrança pendente, os itens já estão vinculados a ela (cobrancaId
  // preenchido) — mostra esses em vez dos "em aberto" (que ficariam vazios).
  const itensAbertosRaw = jaPago
    ? []
    : await db
        .select({
          id: projetoItens.id,
          tipo: projetoItens.tipo,
          descricao: projetoItens.descricao,
          valorCentavos: projetoItens.valorCentavos,
          catalogoUpsellId: projetoItens.catalogoUpsellId,
        })
        .from(projetoItens)
        .where(
          cobrancaPendente
            ? and(eq(projetoItens.projetoId, projeto.id), eq(projetoItens.cobrancaId, cobrancaPendente.id))
            : and(eq(projetoItens.projetoId, projeto.id), isNull(projetoItens.cobrancaId)),
        );

  const itensAbertos = itensAbertosRaw.map(({ id, tipo, descricao, valorCentavos }) => ({
    id,
    tipo,
    descricao,
    valorCentavos,
  }));
  const idsUpsellsNoPedido = new Set(
    itensAbertosRaw.map((item) => item.catalogoUpsellId).filter((id): id is string => !!id),
  );
  const upsellsDisponiveis =
    jaPago || cobrancaPendente
      ? []
      : (
          await db
            .select({
              id: catalogoUpsells.id,
              nome: catalogoUpsells.nome,
              descricao: catalogoUpsells.descricao,
              valorCentavos: catalogoUpsells.valorCentavos,
            })
            .from(catalogoUpsells)
            .where(eq(catalogoUpsells.ativo, true))
        ).filter((upsell) => !idsUpsellsNoPedido.has(upsell.id));

  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Pagamentos</span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
        {jaPago ? "Histórico de cobranças" : "Fechar pedido e pagar"}
      </h1>

      {!jaPago && (
        <>
          <p className="mt-6 text-body-sm text-off-black-ink">
            Plataforma{" "}
            <span className="font-bold">
              {projeto.plataforma === "outra"
                ? projeto.plataformaOutraNome
                : labelPlataforma[projeto.plataforma]}
            </span>
          </p>

          <UpsellsCatalogo
            itensAbertos={itensAbertos}
            disponiveis={upsellsDisponiveis}
            bloqueado={!!cobrancaPendente}
          />

          <PagamentoForm
            cobrancaPendente={
              cobrancaPendente && {
                id: cobrancaPendente.id,
                metodo: cobrancaPendente.metodo,
                linkOuQrCode: cobrancaPendente.linkOuQrCode,
              }
            }
          />
        </>
      )}

      {jaPago && (
        <div className="mt-6 overflow-hidden rounded-3xl bg-pure-white">
          {historico.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between border-b border-ash p-6 last:border-b-0"
            >
              <div>
                <p className="text-body-sm font-bold text-off-black-ink">{labelMetodo[c.metodo]}</p>
                <p className="text-caption text-graphite">
                  {(c.pagoEm ?? c.criadoEm).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-body-sm text-off-black-ink">
                  {formatarPreco(c.valorCentavos)}
                </span>
                <span className="rounded-full bg-electric-lime px-3 py-1 text-caption font-bold text-off-black-ink">
                  {labelStatus[c.status]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { cobrancas } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { getProjetoDoCliente } from "@/lib/queries/projetos";
import { formatarPreco, nomeExibicaoPlano } from "@/lib/planos-conteudo";
import { PagamentoForm } from "@/components/dashboard/pagamento-form";

const labelPlataforma = { shopify: "Shopify", nuvemshop: "Nuvemshop" } as const;
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

  const { projeto, plano } = registro;
  const historico = await getDb()
    .select()
    .from(cobrancas)
    .where(eq(cobrancas.projetoId, projeto.id))
    .orderBy(desc(cobrancas.criadoEm));

  const jaPago = projeto.status !== "aguardando_pagamento" && projeto.status !== "onboarding";
  const cobrancaPendente = historico.find((c) => c.status === "pendente") ?? null;

  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Pagamentos</span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
        {jaPago ? "Histórico de cobranças" : "Fechar pedido e pagar"}
      </h1>

      {!jaPago && (
        <>
          <div className="mt-6 flex flex-col gap-2 rounded-3xl bg-pure-white p-6">
            <div className="flex items-center justify-between text-body-sm text-off-black-ink">
              <span>Plano</span>
              <span className="font-bold">{nomeExibicaoPlano(plano.nome)}</span>
            </div>
            <div className="flex items-center justify-between text-body-sm text-off-black-ink">
              <span>Plataforma</span>
              <span className="font-bold">{labelPlataforma[projeto.plataforma]}</span>
            </div>
            <div className="flex items-center justify-between text-body-sm text-off-black-ink">
              <span>Valor</span>
              <span className="font-bold">
                {formatarPreco(projeto.precoNoMomentoDaCompraCentavos)}
              </span>
            </div>
          </div>

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

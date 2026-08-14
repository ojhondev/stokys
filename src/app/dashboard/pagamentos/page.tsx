"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { planosConteudo, formatarPreco } from "@/lib/planos-conteudo";

// Pagamento acontece aqui, dentro do dashboard (usuário logado) — não no
// onboarding. Ver docs/PRD.md 4.3. Cobrança mockada, formato pensado pra bater
// com a API do Asaas quando a integração real entrar.

type Metodo = "pix" | "cartao" | "boleto";

const metodos: { valor: Metodo; label: string }[] = [
  { valor: "pix", label: "PIX" },
  { valor: "cartao", label: "Cartão de crédito" },
  { valor: "boleto", label: "Boleto" },
];

export default function PagamentosPage() {
  const [metodo, setMetodo] = useState<Metodo>("pix");
  const [pago, setPago] = useState(false);

  // Mock: projeto de exemplo no plano Pro (ver docs/dashboard/page.tsx).
  const plano = planosConteudo.find((p) => p.slug === "pro")!;
  const cobrancas = [
    { metodo: "PIX", valor: formatarPreco(plano.precoCentavos), status: "Pago", quando: "12/08/2026" },
  ];

  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Pagamentos</span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
        {pago ? "Histórico de cobranças" : "Fechar pedido e pagar"}
      </h1>

      {!pago && (
        <>
          <div className="mt-6 flex flex-col gap-2 rounded-3xl bg-pure-white p-6">
            <div className="flex items-center justify-between text-body-sm text-off-black-ink">
              <span>Plano</span>
              <span className="font-bold">{plano.nome}</span>
            </div>
            <div className="flex items-center justify-between text-body-sm text-off-black-ink">
              <span>Plataforma</span>
              <span className="font-bold">Shopify</span>
            </div>
            <div className="flex items-center justify-between text-body-sm text-off-black-ink">
              <span>Valor</span>
              <span className="font-bold">{formatarPreco(plano.precoCentavos)}</span>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-caption font-medium uppercase text-graphite">Forma de pagamento</p>
            <div className="mt-3 inline-flex flex-wrap rounded-full bg-pure-white p-1">
              {metodos.map((m) => (
                <button
                  key={m.valor}
                  type="button"
                  onClick={() => setMetodo(m.valor)}
                  className={`rounded-full px-5 py-2.5 text-body-sm font-bold transition-colors ${
                    metodo === m.valor ? "bg-electric-lime text-off-black-ink" : "text-graphite"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-3xl bg-pure-white p-6 sm:p-8">
              {metodo === "pix" && (
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-off-white-canvas text-caption text-graphite">
                    QR Code (mock)
                  </div>
                  <p className="mt-4 max-w-[320px] break-all text-caption text-graphite">
                    00020126580014BR.GOV.BCB.PIX...stokys-mock...5204000053039865802BR
                  </p>
                  <p className="mt-2 text-body-sm text-graphite">
                    Copia e cola, ou aponte a câmera.
                  </p>
                </div>
              )}

              {metodo === "cartao" && (
                <div className="flex flex-col gap-4">
                  <label className="flex flex-col gap-2">
                    <span className="text-body-sm font-medium text-off-black-ink">
                      Número do cartão
                    </span>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex flex-col gap-2">
                      <span className="text-body-sm font-medium text-off-black-ink">
                        Validade
                      </span>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-body-sm font-medium text-off-black-ink">CVV</span>
                      <input
                        type="text"
                        placeholder="000"
                        className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
                      />
                    </label>
                  </div>
                </div>
              )}

              {metodo === "boleto" && (
                <div className="flex flex-col items-center text-center">
                  <p className="text-body-sm text-off-black-ink">
                    Boleto gerado com vencimento em 3 dias úteis.
                  </p>
                  <p className="mt-3 break-all text-caption text-graphite">
                    34191.79001 01043.510047 91020.150008 1 96380000000000
                  </p>
                  <span className="mt-4 rounded-full bg-off-white-canvas px-4 py-2 text-body-sm font-bold text-off-black-ink">
                    Baixar PDF (mock)
                  </span>
                </div>
              )}
            </div>
          </div>

          <Button type="button" onClick={() => setPago(true)} className="mt-8 w-full sm:w-auto">
            Simular pagamento
          </Button>

          <p className="mt-4 text-caption text-graphite">
            O projeto fica pendente até a confirmação. Depois do pagamento, a produção é
            liberada automaticamente — nossa equipe confere as informações e entra em contato por
            WhatsApp ou e-mail se tiver alguma dúvida.
          </p>
        </>
      )}

      {pago && (
        <div className="mt-6 overflow-hidden rounded-3xl bg-pure-white">
          {cobrancas.map((c, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-ash p-6 last:border-b-0"
            >
              <div>
                <p className="text-body-sm font-bold text-off-black-ink">{c.metodo}</p>
                <p className="text-caption text-graphite">{c.quando}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-body-sm text-off-black-ink">{c.valor}</span>
                <span className="rounded-full bg-electric-lime px-3 py-1 text-caption font-bold text-off-black-ink">
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

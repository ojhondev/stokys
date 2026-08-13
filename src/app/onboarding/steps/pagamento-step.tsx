"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { planosConteudo } from "@/lib/planos-conteudo";
import type { MetodoPagamento, StepProps } from "../types";

const metodos: { valor: MetodoPagamento; label: string }[] = [
  { valor: "pix", label: "PIX" },
  { valor: "cartao", label: "Cartão de crédito" },
  { valor: "boleto", label: "Boleto" },
];

// Cobrança mockada (ver docs/PRD.md 4.3) — formato pensado pra bater com a API do
// Asaas quando a integração real entrar; por ora não chama nenhum gateway de verdade.

export function PagamentoStep({ dados, onVoltar }: StepProps) {
  const [metodo, setMetodo] = useState<MetodoPagamento>("pix");
  const [pago, setPago] = useState(false);

  const plano = planosConteudo.find((p) => p.slug === dados.plano);

  if (pago) {
    return (
      <div className="flex flex-col items-center rounded-3xl bg-off-white-canvas p-10 text-center sm:p-16">
        <span className="rounded-full bg-electric-lime px-4 py-1 text-body-sm font-medium text-off-black-ink">
          Pagamento confirmado (mock)
        </span>
        <h1 className="mt-6 text-heading font-heading font-medium text-off-black-ink">
          Seu projeto {plano?.nome} está em produção.
        </h1>
        <p className="mt-3 max-w-[420px] text-body-sm text-graphite">
          Acompanhe status, mensagens e o preview da loja pelo seu dashboard.
        </p>
        <a
          href="/dashboard"
          className="mt-8 rounded-3xl bg-electric-lime pt-4 pb-4 pl-4 pr-3 text-body font-medium text-off-black-ink"
        >
          Ir para o dashboard
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-heading font-heading font-medium text-off-black-ink">
        Fechar pedido e pagar
      </h1>

      <div className="mt-6 flex flex-col gap-2 rounded-3xl bg-off-white-canvas p-6">
        <div className="flex items-center justify-between text-body-sm text-off-black-ink">
          <span>Plano</span>
          <span className="font-medium">{plano?.nome}</span>
        </div>
        <div className="flex items-center justify-between text-body-sm text-off-black-ink">
          <span>Plataforma</span>
          <span className="font-medium capitalize">{dados.plataforma}</span>
        </div>
        <div className="flex items-center justify-between text-body-sm text-off-black-ink">
          <span>Valor</span>
          <span className="font-medium">A definir</span>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-caption font-medium uppercase text-graphite">Forma de pagamento</p>
        <div className="mt-3 inline-flex flex-wrap rounded-full bg-off-white-canvas p-1">
          {metodos.map((m) => (
            <button
              key={m.valor}
              type="button"
              onClick={() => setMetodo(m.valor)}
              className={`rounded-full px-5 py-2.5 text-body-sm font-medium transition-colors ${
                metodo === m.valor ? "bg-electric-lime text-off-black-ink" : "text-graphite"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-3xl bg-off-white-canvas p-6 sm:p-8">
          {metodo === "pix" && (
            <div className="flex flex-col items-center text-center">
              <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-pure-white text-caption text-graphite">
                QR Code (mock)
              </div>
              <p className="mt-4 max-w-[320px] break-all text-caption text-graphite">
                00020126580014BR.GOV.BCB.PIX...stokys-mock...5204000053039865802BR
              </p>
              <p className="mt-2 text-body-sm text-graphite">Copia e cola, ou aponte a câmera.</p>
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
                  className="rounded-lg border border-ash bg-pure-white px-4 py-3 text-body text-off-black-ink"
                />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-body-sm font-medium text-off-black-ink">Validade</span>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    className="rounded-lg border border-ash bg-pure-white px-4 py-3 text-body text-off-black-ink"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-body-sm font-medium text-off-black-ink">CVV</span>
                  <input
                    type="text"
                    placeholder="000"
                    className="rounded-lg border border-ash bg-pure-white px-4 py-3 text-body text-off-black-ink"
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
              <span className="mt-4 rounded-full bg-pure-white px-4 py-2 text-body-sm font-medium text-off-black-ink">
                Baixar PDF (mock)
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" onClick={onVoltar} variant="ghost">
          Voltar
        </Button>
        <Button type="button" onClick={() => setPago(true)} className="w-full sm:w-auto">
          Simular pagamento
        </Button>
      </div>
    </div>
  );
}

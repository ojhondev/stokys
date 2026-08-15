"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { criarCobranca, marcarCobrancaPaga } from "@/lib/actions/pagamentos";
import type { MetodoCobranca } from "@/lib/payments/asaas";

const metodos: { valor: MetodoCobranca; label: string }[] = [
  { valor: "pix", label: "PIX" },
  { valor: "cartao", label: "Cartão de crédito" },
  { valor: "boleto", label: "Boleto" },
];

type CobrancaPendente = {
  id: string;
  metodo: MetodoCobranca;
  linkOuQrCode: string | null;
} | null;

export function PagamentoForm({ cobrancaPendente }: { cobrancaPendente: CobrancaPendente }) {
  const router = useRouter();
  const [metodo, setMetodo] = useState<MetodoCobranca>(cobrancaPendente?.metodo ?? "pix");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();

  function gerarCobranca() {
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await criarCobranca(metodo);
      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }
      router.refresh();
    });
  }

  function simularPagamento() {
    if (!cobrancaPendente) return;
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await marcarCobrancaPaga(cobrancaPendente.id);
      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="mt-8">
      <p className="text-caption font-medium uppercase text-graphite">Forma de pagamento</p>
      <div className="mt-3 inline-flex flex-wrap rounded-full bg-pure-white p-1">
        {metodos.map((m) => (
          <button
            key={m.valor}
            type="button"
            disabled={!!cobrancaPendente}
            onClick={() => setMetodo(m.valor)}
            className={`rounded-full px-5 py-2.5 text-body-sm font-bold transition-colors disabled:opacity-50 ${
              metodo === m.valor ? "bg-electric-lime text-off-black-ink" : "text-graphite"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-3xl bg-pure-white p-6 sm:p-8">
        {!cobrancaPendente && (
          <p className="text-body-sm text-graphite">
            Escolha a forma de pagamento e gere a cobrança pra ver o QR Code, boleto ou formulário
            de cartão.
          </p>
        )}

        {cobrancaPendente?.metodo === "pix" && (
          <div className="flex flex-col items-center text-center">
            <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-off-white-canvas text-caption text-graphite">
              QR Code (mock)
            </div>
            <p className="mt-4 max-w-[320px] break-all text-caption text-graphite">
              {cobrancaPendente.linkOuQrCode}
            </p>
            <p className="mt-2 text-body-sm text-graphite">Copia e cola, ou aponte a câmera.</p>
          </div>
        )}

        {cobrancaPendente?.metodo === "cartao" && (
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-body-sm font-medium text-off-black-ink">Número do cartão</span>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
              />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-body-sm font-medium text-off-black-ink">Validade</span>
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

        {cobrancaPendente?.metodo === "boleto" && (
          <div className="flex flex-col items-center text-center">
            <p className="text-body-sm text-off-black-ink">
              Boleto gerado com vencimento em 3 dias úteis.
            </p>
            <p className="mt-3 break-all text-caption text-graphite">
              {cobrancaPendente.linkOuQrCode}
            </p>
            <span className="mt-4 rounded-full bg-off-white-canvas px-4 py-2 text-body-sm font-bold text-off-black-ink">
              Baixar PDF (mock)
            </span>
          </div>
        )}
      </div>

      {erro && <p className="mt-4 text-body-sm font-medium text-off-black-ink">{erro}</p>}

      {!cobrancaPendente ? (
        <Button type="button" onClick={gerarCobranca} disabled={pendente} className="mt-8 w-full sm:w-auto">
          {pendente ? "Gerando…" : "Gerar cobrança"}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={simularPagamento}
          disabled={pendente}
          className="mt-8 w-full sm:w-auto"
        >
          {pendente ? "Confirmando…" : "Simular pagamento"}
        </Button>
      )}

      <p className="mt-4 text-caption text-graphite">
        O projeto fica pendente até a confirmação. Depois do pagamento, a produção é liberada
        automaticamente — nossa equipe confere as informações e entra em contato por WhatsApp ou
        e-mail se tiver alguma dúvida.
      </p>
    </div>
  );
}

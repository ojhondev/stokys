"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { criarLead } from "@/lib/actions/leads";
import { formatarWhatsapp } from "@/lib/telefone";
import type { StepProps } from "../types";

// Primeira etapa do onboarding — coleta contato antes de qualquer outra
// pergunta e salva como Lead (ver admin/leads), assim a equipe já vê quem
// começou o fluxo mesmo que não termine.
export function ContatoStep({ dados, setDados, onContinuar }: StepProps) {
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const podeContinuar =
    dados.nome.trim().length > 0 && dados.whatsapp.trim().length > 0 && dados.email.trim().length > 0;

  async function continuar() {
    setErro(null);
    setEnviando(true);
    const resultado = await criarLead(dados.nome, dados.whatsapp, dados.email);
    setEnviando(false);
    if (resultado.erro) {
      setErro(resultado.erro);
      return;
    }
    onContinuar();
  }

  return (
    <div>
      <h1 className="text-heading font-heading font-bold text-off-black-ink">
        Antes de começar, como podemos falar com você?
      </h1>
      <p className="mt-2 max-w-[480px] text-body-sm text-graphite">
        Usamos esses dados pra te acompanhar durante o onboarding e fechar seu pedido no final.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-body-sm font-medium text-off-black-ink">Nome</span>
          <input
            type="text"
            value={dados.nome}
            onChange={(e) => setDados((d) => ({ ...d, nome: e.target.value }))}
            placeholder="Seu nome"
            className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-body-sm font-medium text-off-black-ink">WhatsApp</span>
          <input
            type="tel"
            inputMode="numeric"
            value={dados.whatsapp}
            onChange={(e) => setDados((d) => ({ ...d, whatsapp: formatarWhatsapp(e.target.value) }))}
            placeholder="(00) 00000-0000"
            className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-body-sm font-medium text-off-black-ink">E-mail</span>
          <input
            type="email"
            value={dados.email}
            onChange={(e) => setDados((d) => ({ ...d, email: e.target.value }))}
            placeholder="seu@email.com"
            className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
          />
        </label>
      </div>

      {erro && <p className="mt-4 text-body-sm font-medium text-off-black-ink">{erro}</p>}

      <div className="mt-8 flex items-center justify-end">
        <Button disabled={!podeContinuar || enviando} onClick={continuar} className="w-full sm:w-auto">
          {enviando ? "Enviando…" : "Continuar"}
        </Button>
      </div>
    </div>
  );
}

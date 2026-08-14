"use client";

import { useState } from "react";
import { dadosIniciais, type DadosOnboarding } from "./types";
import { PlanoStep } from "./steps/plano-step";
import { PlataformaStep } from "./steps/plataforma-step";
import { TemaStep } from "./steps/tema-step";
import { PersonalizacaoStep } from "./steps/personalizacao-step";
import { NichoStep } from "./steps/nicho-step";
import { ReferenciasStep } from "./steps/referencias-step";
import { RevisaoStep } from "./steps/revisao-step";
import { PagamentoStep } from "./steps/pagamento-step";

export function OnboardingWizard({
  planoInicial,
}: {
  planoInicial?: DadosOnboarding["plano"];
}) {
  const [passo, setPasso] = useState(0);
  const [dados, setDadosState] = useState<DadosOnboarding>({
    ...dadosIniciais,
    plano: planoInicial ?? null,
  });

  function setDados(updater: (dados: DadosOnboarding) => DadosOnboarding) {
    setDadosState(updater);
  }

  // Plano -> Plataforma -> Tema (Zen/Pro) ou Personalização (Customizado) -> Nicho ->
  // Referências -> Revisão ("Criar minha loja") -> Pagamento. Nenhuma etapa deixa
  // avançar sem os campos obrigatórios preenchidos (ver validação em cada step).
  const etapas =
    dados.plano === "customizado"
      ? (["Plano", "Plataforma", "Personalização", "Nicho", "Referências", "Revisão", "Pagamento"] as const)
      : (["Plano", "Plataforma", "Tema", "Nicho", "Referências", "Revisão", "Pagamento"] as const);

  const avancar = () => setPasso((p) => Math.min(p + 1, etapas.length - 1));
  const voltar = () => setPasso((p) => Math.max(p - 1, 0));

  const etapaAtual = etapas[passo];

  return (
    <div>
      <div className="flex items-center gap-2">
        {etapas.map((etapa, i) => (
          <div
            key={etapa}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= passo ? "bg-electric-lime" : "bg-ash"
            }`}
          />
        ))}
      </div>
      <p className="mt-3 text-caption font-medium uppercase text-graphite">
        Etapa {passo + 1} de {etapas.length} · {etapaAtual}
      </p>

      <div className="mt-8">
        {etapaAtual === "Plano" && (
          <PlanoStep dados={dados} setDados={setDados} onContinuar={avancar} />
        )}
        {etapaAtual === "Plataforma" && (
          <PlataformaStep dados={dados} setDados={setDados} onContinuar={avancar} onVoltar={voltar} />
        )}
        {etapaAtual === "Tema" && (
          <TemaStep dados={dados} setDados={setDados} onContinuar={avancar} onVoltar={voltar} />
        )}
        {etapaAtual === "Personalização" && (
          <PersonalizacaoStep
            dados={dados}
            setDados={setDados}
            onContinuar={avancar}
            onVoltar={voltar}
          />
        )}
        {etapaAtual === "Nicho" && (
          <NichoStep dados={dados} setDados={setDados} onContinuar={avancar} onVoltar={voltar} />
        )}
        {etapaAtual === "Referências" && (
          <ReferenciasStep
            dados={dados}
            setDados={setDados}
            onContinuar={avancar}
            onVoltar={voltar}
          />
        )}
        {etapaAtual === "Revisão" && (
          <RevisaoStep dados={dados} setDados={setDados} onContinuar={avancar} onVoltar={voltar} />
        )}
        {etapaAtual === "Pagamento" && (
          <PagamentoStep dados={dados} setDados={setDados} onContinuar={avancar} onVoltar={voltar} />
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { dadosIniciais, type DadosOnboarding } from "./types";
import { PlanoStep } from "./steps/plano-step";
import { PlataformaStep } from "./steps/plataforma-step";
import { TemaStep } from "./steps/tema-step";
import { PersonalizacaoStep } from "./steps/personalizacao-step";
import { NichoStep } from "./steps/nicho-step";
import { ReferenciasStep } from "./steps/referencias-step";
import { RevisaoStep } from "./steps/revisao-step";
import { BarraAjuda } from "@/components/onboarding/barra-ajuda";

export function OnboardingWizard({
  planoInicial,
  nome,
  email,
}: {
  planoInicial?: DadosOnboarding["plano"];
  nome: string;
  email: string;
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
  // Referências -> Revisão ("Criar minha loja"). Nenhuma etapa deixa avançar sem os
  // campos obrigatórios preenchidos (ver validação em cada step). Pagamento NÃO faz
  // parte do onboarding — só acontece depois, dentro do dashboard, com o usuário
  // logado (RevisaoStep leva pra /login ao concluir).
  const etapas =
    dados.plano === "customizado"
      ? (["Plano", "Plataforma", "Personalização", "Nicho", "Referências", "Revisão"] as const)
      : (["Plano", "Plataforma", "Tema", "Nicho", "Referências", "Revisão"] as const);

  const avancar = () => setPasso((p) => Math.min(p + 1, etapas.length - 1));
  const voltar = () => setPasso((p) => Math.max(p - 1, 0));

  const etapaAtual = etapas[passo];

  // Revisão quebra o container centralizado normal — vira split-screen
  // full-bleed (foto grande do lado direito), por isso o layout dela vive
  // fora do wrapper com max-width/padding usado por todas as outras etapas.
  if (etapaAtual === "Revisão") {
    return (
      <>
        <RevisaoStep
          dados={dados}
          onVoltar={voltar}
          etapaAtualIndex={passo}
          totalEtapas={etapas.length}
        />
        <BarraAjuda nome={nome} email={email} />
      </>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[900px] px-6 py-14 pb-24 sm:px-10 lg:px-16">
      <Link href="/" className="text-body font-medium text-off-black-ink">
        Stokys
      </Link>

      <div className="mt-10">
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
            <PlataformaStep
              dados={dados}
              setDados={setDados}
              onContinuar={avancar}
              onVoltar={voltar}
            />
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
        </div>
      </div>

      <BarraAjuda nome={nome} email={email} />
    </div>
  );
}

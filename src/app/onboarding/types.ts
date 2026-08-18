import type { PlanoConteudo } from "@/lib/planos-conteudo";

export type MercadoAlvo = "brasil" | "global" | "latam";
export type Plataforma = "shopify" | "nuvemshop" | "tray" | "bagy" | "outra";
export type Tema = "spark" | "quant";

export const TOTAL_REFERENCIAS = 3;

export type DadosOnboarding = {
  plano: PlanoConteudo["slug"] | null;
  plataforma: Plataforma | null;
  // Só preenchido quando plataforma === "outra".
  plataformaOutraNome: string;
  // Zen/Pro escolhem um tema pronto; Customizado personaliza (ver docs/PRD.md seção 3).
  tema: Tema | null;
  mercadoAlvo: MercadoAlvo | null;
  logoNome: string | null;
  paletaCores: string[];
  nicho: string;
  referencias: string[];
  // O que o cliente quer pro projeto, com base nas referências listadas.
  objetivoCliente: string;
};

export const dadosIniciais: DadosOnboarding = {
  plano: null,
  plataforma: null,
  plataformaOutraNome: "",
  tema: null,
  mercadoAlvo: null,
  logoNome: null,
  paletaCores: [],
  nicho: "",
  referencias: Array(TOTAL_REFERENCIAS).fill(""),
  objetivoCliente: "",
};

export type StepProps = {
  dados: DadosOnboarding;
  setDados: (updater: (dados: DadosOnboarding) => DadosOnboarding) => void;
  onContinuar: () => void;
  onVoltar?: () => void;
};

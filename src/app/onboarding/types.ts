import type { PlanoConteudo } from "@/lib/planos-conteudo";

export type MercadoAlvo = "brasil" | "global" | "latam";
export type Plataforma = "shopify" | "nuvemshop";
export type Tema = "spark" | "quart";

export const TOTAL_REFERENCIAS = 5;

export type DadosOnboarding = {
  plano: PlanoConteudo["slug"] | null;
  plataforma: Plataforma | null;
  // Zen/Pro escolhem um tema pronto; Customizado personaliza (ver docs/PRD.md seção 3).
  tema: Tema | null;
  mercadoAlvo: MercadoAlvo | null;
  logoNome: string | null;
  paletaCores: string[];
  nicho: string;
  referencias: string[];
};

export const dadosIniciais: DadosOnboarding = {
  plano: null,
  plataforma: null,
  tema: null,
  mercadoAlvo: null,
  logoNome: null,
  paletaCores: [],
  nicho: "",
  referencias: Array(TOTAL_REFERENCIAS).fill(""),
};

export type StepProps = {
  dados: DadosOnboarding;
  setDados: (updater: (dados: DadosOnboarding) => DadosOnboarding) => void;
  onContinuar: () => void;
  onVoltar?: () => void;
};

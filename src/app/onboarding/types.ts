import type { PlanoConteudo } from "@/lib/planos-conteudo";

export type MercadoAlvo = "brasil" | "global" | "latam";
export type Plataforma = "shopify" | "nuvemshop";
export type MetodoPagamento = "pix" | "cartao" | "boleto";

export type DadosOnboarding = {
  plano: PlanoConteudo["slug"] | null;
  // Só usado quando plano === "customizado" — ver docs/PRD.md seção 3.
  mercadoAlvo: MercadoAlvo | null;
  logoNome: string | null;
  paletaCores: string[];
  plataforma: Plataforma | null;
  // Ver docs/PRD.md seção 4.2.1 — criptografado antes de gravar no banco (Fase 1).
  acessoUsuario: string;
  acessoSenha: string;
};

export const dadosIniciais: DadosOnboarding = {
  plano: null,
  mercadoAlvo: null,
  logoNome: null,
  paletaCores: [],
  plataforma: null,
  acessoUsuario: "",
  acessoSenha: "",
};

export type StepProps = {
  dados: DadosOnboarding;
  setDados: (updater: (dados: DadosOnboarding) => DadosOnboarding) => void;
  onContinuar: () => void;
  onVoltar?: () => void;
};

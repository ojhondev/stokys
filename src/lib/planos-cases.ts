// Conteúdo de apoio (case + estatísticas) exibido junto de cada plano na LP.
// Copy de rascunho, com números plausíveis pro contexto — trocar pela copy
// oficial/real antes do lançamento (marca, depoimento e stats ainda são fictícios).

import type { PlanoConteudo } from "./planos-conteudo";

export type PlanoCase = {
  marca: string;
  stat1: { valor: string; label: string };
  stat2: { valor: string; label: string };
  citacao: string;
  autor: string;
};

export const planosCases: Record<PlanoConteudo["slug"], PlanoCase> = {
  zen: {
    marca: "Ludus",
    stat1: { valor: "48h", label: "da compra à loja no ar" },
    stat2: { valor: "15", label: "produtos publicados de saída" },
    citacao:
      "Eu não entendia nada de loja virtual. Escolhi o Zen numa sexta e segunda já tinha link pra mandar pros clientes.",
    autor: "Marina Costa, fundadora da Ludus",
  },
  pro: {
    marca: "Nortex",
    stat1: { valor: "12 dias", label: "até a primeira venda" },
    stat2: { valor: "2,4x", label: "mais pedidos no 1º mês" },
    citacao:
      "A página de rastreio sozinha já reduziu metade das mensagens de suporte que eu recebia todo dia.",
    autor: "Rafael Almeida, sócio da Nortex",
  },
  customizado: {
    marca: "Órbita",
    stat1: { valor: "3 mercados", label: "Brasil, Global e Latam" },
    stat2: { valor: "1", label: "mentoria com a Viscale Assessoria" },
    citacao:
      "Não queria uma loja genérica. A Stokys fez a identidade inteira em volta da marca que eu já tinha na cabeça.",
    autor: "Bianca Ferreira, fundadora da Órbita",
  },
};

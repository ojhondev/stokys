// Conteúdo de exibição dos planos (LP + onboarding). Preço em centavos, valor
// único do projeto (não mensalidade) — confirmado pelo usuário em 2026-08-14.

export type PlanoConteudo = {
  slug: "zen" | "pro" | "customizado";
  nome: string;
  descricao: string;
  precoCentavos: number;
  destaque?: boolean;
  itens: string[];
};

export const planosConteudo: PlanoConteudo[] = [
  {
    slug: "zen",
    nome: "Zen",
    descricao: "Pra começar com o essencial já pronto.",
    precoCentavos: 69700,
    itens: [
      "4 banners",
      "Capa de categorias",
      "15 produtos minerados e cadastrados",
      "Tema Spark ou Quart incluso",
    ],
  },
  {
    slug: "pro",
    nome: "Pro",
    descricao: "Mais estrutura pra loja crescer.",
    precoCentavos: 99700,
    destaque: true,
    itens: [
      "4 banners",
      "Até 8 capas de categorias",
      "Página de política e rastreio",
      "15 produtos minerados e cadastrados",
      "Tema Spark ou Quart incluso",
    ],
  },
  {
    slug: "customizado",
    nome: "Customizado",
    descricao: "Loja sob medida, com mentoria de tráfego inclusa.",
    precoCentavos: 199700,
    itens: [
      "Template para mercado Brasil, Global ou Latam",
      "Logotipo e paleta de cores personalizados",
      "4 banners · 8 capas de coleções",
      "35 produtos minerados e cadastrados",
      "1 Mentoria Estratégica com a Viscale Assessoria",
    ],
  },
];

// planos.nome no banco é o slug (enum "zen"|"pro"|"customizado"), não um nome
// de exibição — usado por telas que leem o projeto/plano real do banco
// (dashboard, admin), diferente de planosConteudo que é conteúdo estático da LP.
export function nomeExibicaoPlano(slug: PlanoConteudo["slug"]): string {
  return planosConteudo.find((p) => p.slug === slug)?.nome ?? slug;
}

export function formatarPreco(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: centavos % 100 === 0 ? 0 : 2,
  });
}

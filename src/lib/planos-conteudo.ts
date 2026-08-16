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
      "Tema Spark ou Quart incluso",
      "3 banners",
      "5 capas de categoria",
      "15 produtos minerados e cadastrados",
    ],
  },
  {
    slug: "pro",
    nome: "Pro",
    descricao: "Mais estrutura pra loja crescer.",
    precoCentavos: 99700,
    destaque: true,
    itens: [
      "Tema Spark ou Quart incluso",
      "4 banners desktop + 4 banners mobile",
      "5 capas de categoria",
      "Página de política e rastreio",
      "15 produtos minerados e cadastrados",
      "Video commerce",
      "Tabela de medidas premium",
      "Parcelamento dinâmico",
      "Barra de menu estilo app",
    ],
  },
  {
    slug: "customizado",
    nome: "Premium",
    descricao: "Loja sob medida, com mentoria de tráfego inclusa.",
    precoCentavos: 199700,
    itens: [
      "Tema Spark ou Quart incluso",
      "Logotipo e paleta de cores personalizados",
      "Template para mercado Brasil, Global ou Latam",
      "4 banners desktop + 4 banners mobile",
      "5 capas de categoria",
      "Página de política e rastreio",
      "35 produtos minerados e cadastrados",
      "Video commerce",
      "Tag de avisos na PDP",
      "Filtro de busca dinâmico",
      "Tabela de medidas nativa",
      "Parcelamento dinâmico",
      "Barra de menu estilo app",
      "Barra de adição ao carrinho fixa",
      "Stories commerce",
      "Barra dinâmica de frete no carrinho",
      "Comunidade Sem Estoque no Discord",
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

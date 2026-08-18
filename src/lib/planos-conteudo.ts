// Conteúdo de exibição dos planos (LP + onboarding). Preço em centavos, valor
// único do projeto (não mensalidade) — confirmado pelo usuário em 2026-08-14.

export type PlanoConteudo = {
  slug: "zen" | "pro" | "customizado";
  nome: string;
  descricao: string;
  precoCentavos: number;
  prazoDiasUteis: number;
  destaque?: boolean;
  itens: string[];
};

// Preços e escopo ajustados em definitivo pelo usuário (2026-08-17, ref.
// planos-novos.png) — "customizado" continua sendo o slug interno (enum do
// banco, não renomeado pra não exigir migration), só o nome de exibição virou
// "Elite" (era "Premium").
export const planosConteudo: PlanoConteudo[] = [
  {
    slug: "zen",
    nome: "Zen",
    descricao: "Pra começar com o essencial já pronto.",
    precoCentavos: 69700,
    prazoDiasUteis: 10,
    itens: [
      "Tema gratuito",
      "3 banners desktop",
      "3 banners mobile",
      "5 capas de categorias",
      "10 produtos minerados e cadastrados",
      "Suporte",
    ],
  },
  {
    slug: "pro",
    nome: "Pro",
    descricao: "Mais estrutura pra loja crescer.",
    precoCentavos: 99700,
    prazoDiasUteis: 15,
    destaque: true,
    itens: [
      "Tema Spark ou Quart",
      "4 banners desktop",
      "4 banners mobile",
      "8 capas de categorias",
      "Página de política e rastreio",
      "25 produtos minerados e cadastrados",
      "Video Commerce",
      "Tabela de Medidas Nativa",
      "Parcelamento Dinâmico",
      "Barra de menu Mobile",
      "Suporte",
    ],
  },
  {
    slug: "customizado",
    nome: "Elite",
    descricao: "Loja com identidade visual própria e suporte prioritário.",
    precoCentavos: 199700,
    prazoDiasUteis: 15,
    itens: [
      "Tema Spark ou Quart",
      "Logotipo e paleta de cores personalizados",
      "4 banners desktop + 4 banners mobile",
      "5 capas de categoria",
      "Página de Política e Rastreio",
      "35 produtos minerados e cadastrados",
      "Video Commerce",
      "Tag de Avisos na PDP",
      "Filtro de Busca Dinâmico",
      "Tabela de Medidas Nativa",
      "Parcelamento Dinâmico",
      "Barra de menu Mobile",
      "Barra de Adição ao Carrinho Fixa",
      "Stories Commerce na PDP",
      "Barra Dinâmica de Frete no Carrinho",
      "Comunidade Sem Estoque no Discord",
      "Suporte Prioritário",
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

// Conteúdo de exibição dos planos (LP + onboarding). Preço fica de fora — ainda
// não definido (ver docs/PRD.md, seção 11) e vem do banco (`planos.preco_centavos`)
// quando o admin configurar.

export type PlanoConteudo = {
  slug: "zen" | "pro" | "customizado";
  nome: string;
  descricao: string;
  destaque?: boolean;
  itens: string[];
};

export const planosConteudo: PlanoConteudo[] = [
  {
    slug: "zen",
    nome: "Zen",
    descricao: "Pra começar com o essencial já pronto.",
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
    itens: [
      "Template para mercado Brasil, Global ou Latam",
      "Logotipo e paleta de cores personalizados",
      "4 banners · 8 capas de coleções",
      "35 produtos minerados e cadastrados",
      "1 Mentoria Estratégica com a Viscale Assessoria",
    ],
  },
];

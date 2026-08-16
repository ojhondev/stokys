import { Fragment } from "react";

// Tabela de comparação — mesmo padrão de "Comparar todos os recursos" da
// slack.com/pricing: título dos planos fixo no topo enquanto o usuário rola
// pra comparar os recursos. Usa CSS Grid em vez de <table> porque um wrapper
// overflow-x-auto força overflow-y para "auto" (regra da spec de overflow),
// o que quebra o position: sticky — a Slack evita isso não usando scroll
// horizontal no mobile, então as colunas aqui são estreitas o bastante pra
// caber sem scroll em qualquer largura de tela.

const colunas: { slug: "zen" | "pro" | "customizado"; nome: string; badge?: string }[] = [
  { slug: "zen", nome: "Zen" },
  { slug: "pro", nome: "Pro", badge: "Mais popular" },
  { slug: "customizado", nome: "Premium" },
];

type Valor = boolean | string;

const linhas: { label: string; valores: Record<(typeof colunas)[number]["slug"], Valor> }[] = [
  {
    label: "Plataforma (Shopify ou Nuvemshop)",
    valores: { zen: true, pro: true, customizado: true },
  },
  {
    label: "Tema",
    valores: { zen: "Spark ou Quart", pro: "Spark ou Quart", customizado: "Spark ou Quart" },
  },
  {
    label: "Banners",
    valores: { zen: "3", pro: "4 desktop + 4 mobile", customizado: "4 desktop + 4 mobile" },
  },
  { label: "Capas de categoria", valores: { zen: "5", pro: "5", customizado: "5" } },
  {
    label: "Produtos cadastrados",
    valores: { zen: "15", pro: "15", customizado: "35" },
  },
  {
    label: "Página de política e rastreio",
    valores: { zen: false, pro: true, customizado: true },
  },
  { label: "Video commerce", valores: { zen: false, pro: true, customizado: true } },
  {
    label: "Tabela de medidas",
    valores: { zen: false, pro: "Premium", customizado: "Nativa" },
  },
  { label: "Parcelamento dinâmico", valores: { zen: false, pro: true, customizado: true } },
  { label: "Barra de menu estilo app", valores: { zen: false, pro: true, customizado: true } },
  { label: "Tag de avisos na PDP", valores: { zen: false, pro: false, customizado: true } },
  { label: "Filtro de busca dinâmico", valores: { zen: false, pro: false, customizado: true } },
  {
    label: "Barra de adição ao carrinho fixa",
    valores: { zen: false, pro: false, customizado: true },
  },
  { label: "Stories commerce", valores: { zen: false, pro: false, customizado: true } },
  {
    label: "Barra dinâmica de frete no carrinho",
    valores: { zen: false, pro: false, customizado: true },
  },
  {
    label: "Logotipo e paleta de cores personalizados",
    valores: { zen: false, pro: false, customizado: true },
  },
  {
    label: "Template para mercado (Brasil, Global ou Latam)",
    valores: { zen: false, pro: false, customizado: true },
  },
  {
    label: "Comunidade Sem Estoque no Discord",
    valores: { zen: false, pro: false, customizado: true },
  },
  {
    label: "Mentoria estratégica com a Viscale Assessoria",
    valores: { zen: false, pro: false, customizado: true },
  },
  { label: "Cobrança PIX, cartão ou boleto", valores: { zen: true, pro: true, customizado: true } },
  { label: "Preview em tempo real", valores: { zen: true, pro: true, customizado: true } },
  { label: "Mensageria com a produção", valores: { zen: true, pro: true, customizado: true } },
  { label: "Acessos criptografados", valores: { zen: true, pro: true, customizado: true } },
];

function Celula({ valor }: { valor: Valor }) {
  if (typeof valor === "boolean") {
    return (
      <span className={`text-body ${valor ? "text-off-black-ink" : "text-graphite"}`}>
        {valor ? "✓" : "✕"}
      </span>
    );
  }
  return <span className="text-body-sm text-off-black-ink">{valor}</span>;
}

export function ComparisonTable() {
  return (
    <section className="bg-pure-white px-6 py-14 sm:px-10 md:py-16 lg:px-16">
      <div className="mx-auto w-full max-w-[1800px]">
        <h2 className="text-center text-heading-lg font-heading font-bold text-off-black-ink">
          Entenda os planos
        </h2>

        <div className="mt-14 grid grid-cols-[minmax(120px,1.5fr)_repeat(3,minmax(0,1fr))] gap-x-3 sm:gap-x-6 md:grid-cols-[280px_repeat(3,1fr)]">
          {/* Título dos planos — fixo no topo ao rolar, no mobile e no desktop */}
          <div className="sticky top-24 z-10 bg-pure-white pb-8" />
          {colunas.map((coluna) => (
            <div
              key={coluna.slug}
              className="sticky top-24 z-10 flex flex-col items-start gap-2 bg-pure-white pb-8"
            >
              <span className="text-subheading font-heading font-bold text-off-black-ink">
                {coluna.nome}
              </span>
              {coluna.badge && (
                <span className="rounded-full bg-electric-lime px-3 py-1 text-caption font-medium text-off-black-ink">
                  {coluna.badge}
                </span>
              )}
            </div>
          ))}

          {linhas.map((linha) => (
            <Fragment key={linha.label}>
              <div className="border-b border-ash py-5 pr-2 text-body-sm font-bold text-off-black-ink">
                {linha.label}
              </div>
              {colunas.map((coluna) => (
                <div key={coluna.slug} className="border-b border-ash py-5">
                  <Celula valor={linha.valores[coluna.slug]} />
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

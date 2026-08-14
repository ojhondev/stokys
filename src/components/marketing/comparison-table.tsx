// Tabela de comparação — mesmo padrão de "The long list" da perk.com: cabeçalho
// com os 3 planos (badge no mais popular), linhas de recurso com check/valor por
// coluna. Só mostra o que já está confirmado no PRD — nada inventado por plano.

const colunas: { slug: "zen" | "pro" | "customizado"; nome: string; badge?: string }[] = [
  { slug: "zen", nome: "Zen" },
  { slug: "pro", nome: "Pro", badge: "Mais popular" },
  { slug: "customizado", nome: "Customizado" },
];

type Valor = boolean | string;

const linhas: { label: string; valores: Record<(typeof colunas)[number]["slug"], Valor> }[] = [
  {
    label: "Plataforma (Shopify ou Nuvemshop)",
    valores: { zen: true, pro: true, customizado: true },
  },
  { label: "Banners", valores: { zen: "4", pro: "4", customizado: "4" } },
  {
    label: "Capas",
    valores: {
      zen: "Capa de categorias",
      pro: "Até 8 capas de categorias",
      customizado: "8 capas de coleções",
    },
  },
  {
    label: "Produtos cadastrados",
    valores: { zen: "15", pro: "15", customizado: "35" },
  },
  {
    label: "Tema",
    valores: {
      zen: "Spark ou Quart",
      pro: "Spark ou Quart",
      customizado: "Template por mercado (Brasil, Global ou Latam)",
    },
  },
  {
    label: "Logotipo e paleta de cores personalizados",
    valores: { zen: false, pro: false, customizado: true },
  },
  {
    label: "Página de política e rastreio",
    valores: { zen: false, pro: true, customizado: false },
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
      <span className="text-body text-off-black-ink">{valor ? "✓" : ""}</span>
    );
  }
  return <span className="text-body-sm text-off-black-ink">{valor}</span>;
}

export function ComparisonTable() {
  return (
    <section className="bg-pure-white px-6 py-14 sm:px-10 md:py-16 lg:px-16">
      <div className="mx-auto w-full max-w-[1800px]">
        <h2 className="text-center text-heading-lg font-heading font-bold text-off-black-ink">
          A lista completa
        </h2>

        <div className="mt-14 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr>
                <th className="w-[280px]" />
                {colunas.map((coluna) => (
                  <th key={coluna.slug} className="px-4 pb-8 text-left align-bottom">
                    <div className="flex items-center gap-3">
                      <span className="text-subheading font-heading font-bold text-off-black-ink">
                        {coluna.nome}
                      </span>
                      {coluna.badge && (
                        <span className="rounded-full bg-electric-lime px-3 py-1 text-caption font-medium text-off-black-ink">
                          {coluna.badge}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {linhas.map((linha) => (
                <tr key={linha.label} className="border-b border-ash">
                  <td className="py-5 pr-4 text-body-sm font-medium text-off-black-ink">
                    {linha.label}
                  </td>
                  {colunas.map((coluna) => (
                    <td key={coluna.slug} className="px-4 py-5">
                      <Celula valor={linha.valores[coluna.slug]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

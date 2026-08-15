import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { PromoBar } from "@/components/marketing/promo-bar";

// Vitrine de temas — mesmo espírito de listagem da Shopify Theme Store: cada
// tema com nome, posicionamento e o pacote de recursos que ele carrega. Ainda
// sem captura de tela/vídeo reais, então usamos o mesmo bloco-mockup em grid
// (ver FeatureMockup em features-grid.tsx) como placeholder, com legenda
// avisando que material real chega depois.

const recursos = [
  "Video commerce",
  "Tabela de medidas premium",
  "Stories commerce",
  "Tag de avisos na PDP",
  "Parcelamento dinâmico",
  "Barra dinâmica de frete no carrinho",
  "Filtro de busca dinâmico",
  "Barra de adição ao carrinho fixa",
  "Barra de menu mobile",
];

const temas = [
  {
    nome: "Spark",
    categoria: "Moda e vestuário",
    descricao:
      "Pensado pra marcas de roupa e acessórios: grid de produto que valoriza foto de modelo e uma vitrine que guia até o carrinho sem fricção.",
  },
  {
    nome: "Quart",
    categoria: "Decoração e casa",
    descricao:
      "Layout mais espaçoso pra peças de ambiente — categorias por cômodo, blocos de inspiração e destaque pra combos e kits.",
  },
];

function TemaMockup() {
  return (
    <div className="grid aspect-video w-full grid-cols-4 gap-2 rounded-2xl bg-off-white-canvas p-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className={`rounded-lg ${
            [1, 5].includes(i) ? "bg-electric-lime/60" : "bg-pure-white"
          } ${i === 0 ? "col-span-2 row-span-2" : ""}`}
        />
      ))}
    </div>
  );
}

export default function TemasPage() {
  return (
    <>
      <SiteHeader />

      <main className="flex flex-1 flex-col bg-off-white-canvas px-6 py-14 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-[1800px]">
          <span className="text-caption font-medium uppercase text-graphite">Temas</span>
          <h1 className="mt-3 max-w-[640px] text-heading-lg font-heading font-bold text-off-black-ink">
            Temas com o essencial de conversão já pronto.
          </h1>
          <p className="mt-4 max-w-[480px] text-body-sm text-graphite">
            Todo plano Stokys já sai com um dos dois temas abaixo aplicado — sem editor visual,
            sem configuração manual.
          </p>

          {/* Recursos compartilhados por todos os temas */}
          <div className="mt-12 rounded-3xl bg-pure-white p-8 md:p-10">
            <h2 className="text-subheading font-heading font-bold text-off-black-ink">
              Recursos inclusos em todos os temas
            </h2>
            <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {recursos.map((recurso) => (
                <li
                  key={recurso}
                  className="flex items-center gap-3 text-body-sm font-medium text-off-black-ink"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-electric-lime text-caption text-off-black-ink">
                    ✓
                  </span>
                  {recurso}
                </li>
              ))}
            </ul>
          </div>

          {/* Cards dos dois temas */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {temas.map((tema) => (
              <div
                key={tema.nome}
                className="flex flex-col rounded-3xl bg-pure-white p-8 transition-transform duration-200 hover:scale-[1.02]"
              >
                <TemaMockup />
                <span className="mt-2 text-caption text-graphite">
                  Capturas de tela e vídeo reais em breve
                </span>

                <span className="mt-6 w-fit rounded-full border border-ash px-3 py-1 text-caption font-medium uppercase text-graphite">
                  {tema.categoria}
                </span>
                <h3 className="mt-4 text-heading font-heading font-bold text-off-black-ink">
                  {tema.nome}
                </h3>
                <p className="mt-2 text-body-sm text-graphite">{tema.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
      <div className="h-20" aria-hidden />
      <PromoBar />
    </>
  );
}

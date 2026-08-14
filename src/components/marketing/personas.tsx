// Mesmo padrão da seção de personas da perk.com: título centralizado maior, cards
// com título + subtexto + placeholder de imagem à direita, e efeito de scroll onde
// cada card fixa e o próximo sobe por cima (stacking via position: sticky).

const personas = [
  {
    titulo: "Quem tá começando",
    subtexto:
      "Sua primeira loja, sem aprender a mexer em nada técnico. O plano Zen entrega o essencial: tema, produtos e banners prontos.",
  },
  {
    titulo: "Quem já vende",
    subtexto:
      "Quer profissionalizar sem recomeçar do zero. O plano Pro adiciona página de política, rastreio e mais categorias.",
  },
  {
    titulo: "Quem quer sob medida",
    subtexto:
      "Marca própria, mercado definido, loja customizada — logotipo, paleta de cores e template para Brasil, Global ou Latam.",
  },
  {
    titulo: "Quem quer tráfego",
    subtexto:
      "Loja pronta é só metade do caminho. Depois da entrega, acesse a vitrine de parceiros de tráfego pago.",
  },
];

export function Personas() {
  return (
    <section id="como-funciona" className="bg-pure-white px-6 py-14 sm:px-10 md:py-24 lg:px-16">
      <div className="mx-auto w-full max-w-[1800px]">
        <h2 className="mx-auto max-w-[720px] text-center text-heading-lg font-heading font-bold text-off-black-ink">
          Simples pra você. Direto pra quem produz.
        </h2>

        <div className="relative mt-16">
          {personas.map((persona, i) => (
            <div
              key={persona.titulo}
              className="sticky top-24 flex min-h-[64vh] items-center"
              style={{ zIndex: i + 1 }}
            >
              <div className="grid w-full items-center gap-10 rounded-3xl bg-off-white-canvas p-10 md:grid-cols-2 md:p-16">
                <div>
                  <h3 className="text-heading font-heading font-bold text-off-black-ink">
                    {persona.titulo}
                  </h3>
                  <p className="mt-4 max-w-[420px] text-body text-graphite">{persona.subtexto}</p>
                </div>
                <div className="aspect-[4/3] rounded-2xl bg-pure-white" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

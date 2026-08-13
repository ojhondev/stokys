// Carrossel de cases — mesmo padrão da seção "10,000+ real businesses" da perk.com
// (cards escuros, min-height alto, um case em destaque). Sem clientes reais entregues
// ainda, então os 3 cards ficam como placeholder explícito — trocar por cases reais
// conforme lojas forem entregues (PRD seção 9).

const placeholders = [1, 2, 3];

export function CaseStudies() {
  return (
    <section className="bg-off-white-canvas px-6 py-20 md:py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        <span className="text-caption font-medium uppercase text-graphite">Resultados</span>
        <h2 className="mt-3 max-w-[560px] text-heading font-heading font-medium text-off-black-ink">
          [X]+ lojas entregues, gente de verdade vendendo.
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {placeholders.map((n) => (
            <div
              key={n}
              className="flex min-h-[320px] flex-col justify-between rounded-3xl bg-deep-charcoal p-8"
            >
              <span className="text-caption font-medium uppercase text-ash">
                [case de cliente {n}]
              </span>
              <div>
                <p className="text-subheading font-medium text-off-white-canvas">
                  “[Como a loja de [cliente] saiu do zero com a Stokys]”
                </p>
                <p className="mt-4 text-body-sm text-ash">[Ler case completo →]</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

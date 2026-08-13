// Grid de 4 colunas — mesmo padrão da seção CONTROL/VISIBILITY/EXPERIENCE/IMPACT da
// perk.com: card com ícone, eyebrow, heading curto e descrição. Ícone tipográfico
// monocromático (não colorido) pra manter a regra do design system de um único
// acento cromático (o lima), em vez de uma cor por card.

const valores = [
  {
    glifo: "◇",
    eyebrow: "Transparência",
    heading: "Orçamento fechado antes de pagar",
    descricao:
      "O plano já define o que está incluso — sem surpresa de escopo depois que o pagamento cai.",
  },
  {
    glifo: "◎",
    eyebrow: "Acompanhamento",
    heading: "Status real, não previsão por WhatsApp",
    descricao: "Cada etapa da produção aparece no seu dashboard assim que muda de status.",
  },
  {
    glifo: "▦",
    eyebrow: "Simplicidade",
    heading: "Tudo dentro da mesma plataforma",
    descricao: "Onboarding, pagamento, mensagens e preview — sem alternar entre 5 ferramentas.",
  },
  {
    glifo: "✓",
    eyebrow: "Resultado",
    heading: "Loja pronta pra vender",
    descricao: "Produtos cadastrados, tema aplicado e checkout funcionando na entrega.",
  },
];

export function ValueGrid() {
  return (
    <section className="bg-pure-white px-6 sm:px-10 lg:px-16 py-14 md:py-16">
      <div className="mx-auto grid w-full max-w-[1800px] gap-6 md:grid-cols-4">
        {valores.map((valor) => (
          <div key={valor.eyebrow} className="rounded-3xl bg-off-white-canvas p-8">
            <span className="text-heading text-off-black-ink">{valor.glifo}</span>
            <p className="mt-6 text-caption font-medium uppercase text-graphite">
              {valor.eyebrow}
            </p>
            <h3 className="mt-3 text-subheading font-heading font-medium text-off-black-ink">
              {valor.heading}
            </h3>
            <p className="mt-3 text-body-sm text-graphite">{valor.descricao}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Grid de 4 colunas — mesmo padrão da seção CONTROL/VISIBILITY/EXPERIENCE/IMPACT da
// perk.com (eyebrow + heading curto + descrição, fundo branco).

const valores = [
  {
    eyebrow: "Transparência",
    heading: "Orçamento fechado antes de pagar",
    descricao:
      "O plano já define o que está incluso — sem surpresa de escopo depois que o pagamento cai.",
  },
  {
    eyebrow: "Acompanhamento",
    heading: "Status real, não previsão por WhatsApp",
    descricao: "Cada etapa da produção aparece no seu dashboard assim que muda de status.",
  },
  {
    eyebrow: "Simplicidade",
    heading: "Tudo dentro da mesma plataforma",
    descricao: "Onboarding, pagamento, mensagens e preview — sem alternar entre 5 ferramentas.",
  },
  {
    eyebrow: "Resultado",
    heading: "Loja pronta pra vender",
    descricao: "Produtos cadastrados, tema aplicado e checkout funcionando na entrega.",
  },
];

export function ValueGrid() {
  return (
    <section className="bg-pure-white px-6 py-20 md:py-24">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 md:grid-cols-4">
        {valores.map((valor) => (
          <div key={valor.eyebrow}>
            <span className="text-caption font-medium uppercase text-graphite">
              {valor.eyebrow}
            </span>
            <h3 className="mt-3 text-subheading font-medium text-off-black-ink">
              {valor.heading}
            </h3>
            <p className="mt-3 text-body-sm text-graphite">{valor.descricao}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

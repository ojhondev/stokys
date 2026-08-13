// Grid de features — mesmo padrão da seção AI POLICY / PERSONALIZATION / ... da
// perk.com (glifo tipográfico + heading + descrição curta, sem ilustração).

const features = [
  { glifo: "◆", heading: "Acessos protegidos", descricao: "Credenciais da plataforma criptografadas, revogadas após a entrega." },
  { glifo: "▤", heading: "Preview em tempo real", descricao: "Acompanhe a loja sendo montada direto no seu dashboard." },
  { glifo: "✎", heading: "Mensageria direta", descricao: "Fale com a produção do seu projeto sem sair da plataforma." },
  { glifo: "$", heading: "Cobrança na plataforma", descricao: "PIX, cartão ou boleto — sem link externo, sem intermediário." },
  { glifo: "▢", heading: "Escopo fechado por plano", descricao: "Zen, Pro ou Customizado — você sabe exatamente o que está pagando." },
  { glifo: "⇄", heading: "Parceiros de tráfego", descricao: "Vitrine de agências parceiras pra vender depois que a loja tá pronta." },
  { glifo: "✓", heading: "Suporte pós-entrega", descricao: "Loja publicada não é ponto final — segue com acompanhamento." },
];

export function FeaturesGrid() {
  return (
    <section className="bg-off-white-canvas px-6 py-20 md:py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        <span className="text-caption font-medium uppercase text-graphite">
          Por dentro da plataforma
        </span>
        <h2 className="mt-3 max-w-[560px] text-heading font-heading font-medium text-off-black-ink">
          Cada detalhe do processo, resolvido em um lugar só.
        </h2>

        <div className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.heading}>
              <span className="text-heading font-medium text-off-black-ink">{feature.glifo}</span>
              <h3 className="mt-4 text-subheading font-heading font-medium text-off-black-ink">
                {feature.heading}
              </h3>
              <p className="mt-2 text-body-sm text-graphite">{feature.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

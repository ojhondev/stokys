// FAQ — <details>/<summary> nativo (acessível, sem JS extra pra um accordion simples).

const perguntas = [
  {
    pergunta: "Preciso saber programar ou mexer com Shopify/Nuvemshop?",
    resposta:
      "Não. A produção Stokys cuida de toda a configuração técnica da loja — você só define nicho, tema e referências no onboarding.",
  },
  {
    pergunta: "Como funciona o pagamento?",
    resposta:
      "Pagamento único por projeto, feito direto no seu dashboard via PIX, cartão ou boleto — não é mensalidade.",
  },
  {
    pergunta: "Vocês cadastram os produtos também?",
    resposta:
      "Sim. Cadastramos os produtos definidos no seu plano (10 no Zen, 25 no Pro, 35 no Elite), já prontos pra vender.",
  },
  {
    pergunta: "Quanto tempo demora até a loja ficar pronta?",
    resposta:
      "O prazo varia conforme o plano e a fila de produção. Você acompanha cada etapa — do pagamento até a entrega — em tempo real pelo dashboard.",
  },
  {
    pergunta: "Posso trocar de plano depois de começar?",
    resposta:
      "Sim, é só falar com a produção pelas mensagens do seu dashboard pra ajustar o escopo do projeto.",
  },
  {
    pergunta: "A Stokys também cuida do tráfego pago da loja?",
    resposta:
      "Não diretamente, mas assim que sua loja é entregue você tem acesso à vitrine de agências parceiras de tráfego.",
  },
];

export function Faq() {
  return (
    <section className="bg-pure-white px-6 py-14 sm:px-10 md:py-16 lg:px-16">
      <div className="mx-auto w-full max-w-[840px]">
        <h2 className="text-center text-heading-lg font-heading font-bold text-off-black-ink md:text-display">
          Perguntas frequentes
        </h2>

        <div className="mt-10 flex flex-col gap-3">
          {perguntas.map((item) => (
            <details
              key={item.pergunta}
              className="group rounded-3xl bg-off-white-canvas p-6 open:pb-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-body font-bold text-off-black-ink">
                {item.pergunta}
                <span className="shrink-0 text-heading text-off-black-ink transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-body-sm text-graphite">{item.resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

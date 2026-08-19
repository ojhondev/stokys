// FAQ — <details>/<summary> nativo (acessível, sem JS extra pra um accordion simples).

const perguntas = [
  {
    pergunta: "A Stokys é uma agência de lojas para dropshipping?",
    resposta:
      "Sim. Somos uma agência especializada em lojas prontas pra dropshipping — cuidamos da configuração técnica, do design, do cadastro de produtos e da entrega, pra você só precisar tocar o marketing e as vendas.",
  },
  {
    pergunta: "Qual o diferencial da Stokys para outras agências?",
    resposta:
      "O diferencial está em duas frentes: desenvolvemos lojas prontas pra vender, com alto padrão de design e performance, pra mais de 10 nichos diferentes — e construímos nossos próprios temas, Spark e Quant, com funcionalidades que antes só as grandes marcas tinham.",
  },
  {
    pergunta: "Qual a diferença entre os planos Zen, Pro e Elite?",
    resposta:
      "Zen entrega o essencial com tema gratuito e 10 produtos cadastrados. Pro adiciona o tema Spark ou Quant, mais banners, mais produtos e recursos como video commerce e parcelamento dinâmico. Elite é a loja com identidade visual própria (logotipo e paleta de cores personalizados), o pacote completo de recursos e suporte prioritário — veja a comparação completa acima.",
  },
  {
    pergunta: "Em quanto tempo minha loja fica pronta?",
    resposta:
      "10 dias úteis no plano Zen, 15 dias úteis nos planos Pro e Elite, a partir da confirmação do pedido. Você acompanha cada etapa da produção pela Área do Cliente.",
  },
  {
    pergunta: "Pra que serve a área de membros?",
    resposta:
      "É a Comunidade Sem Estoque, nosso grupo no Discord — benefício exclusivo do plano Elite, com conteúdo e trocas sobre dropshipping além da sua loja.",
  },
  {
    pergunta: "Preciso saber programar ou mexer com Shopify/Nuvemshop?",
    resposta:
      "Não. A produção Stokys cuida de toda a configuração técnica da loja — você só define nicho, tema e referências no onboarding.",
  },
  {
    pergunta: "Como funciona o pagamento?",
    resposta:
      "Pagamento único por projeto — não é mensalidade. Depois de enviar seu pedido, nosso time fala com você pelo WhatsApp pra fechar os detalhes e liberar a produção.",
  },
  {
    pergunta: "Vocês cadastram os produtos também?",
    resposta:
      "Sim. Cadastramos os produtos definidos no seu plano (10 no Zen, 25 no Pro, 35 no Elite), já prontos pra vender.",
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

import Image from "next/image";

// Resultados — imagens reais de lojas entregues, rolando em marquee (mesmo
// padrão da faixa de nichos): dois grupos idênticos animando em sincronia.

const cases = [
  { arquivo: "/case-loja-1.png", nome: "Loja entregue 1" },
  { arquivo: "/case-loja-2.png", nome: "Loja entregue 2" },
  { arquivo: "/case-loja-3.png", nome: "Loja entregue 3" },
];

function Itens() {
  return (
    <>
      {cases.map((item, i) => (
        <div
          key={i}
          className="relative h-[280px] w-[280px] shrink-0 overflow-hidden rounded-3xl sm:h-[360px] sm:w-[360px]"
        >
          <Image src={item.arquivo} alt={item.nome} fill sizes="360px" className="object-cover" />
        </div>
      ))}
    </>
  );
}

export function CaseStudies() {
  return (
    <section className="overflow-hidden bg-off-white-canvas py-14 md:py-16">
      <div className="mx-auto w-full max-w-[1800px] px-6 sm:px-10 lg:px-16">
        <span className="text-caption font-medium uppercase text-graphite">Resultados</span>
        <h2 className="mt-3 max-w-[720px] text-heading-lg font-heading font-bold text-off-black-ink">
          +40 cases de sucesso com lojas profissionais rodando pelo mundo
        </h2>
      </div>

      <div className="mt-10 flex whitespace-nowrap">
        <div className="flex shrink-0 animate-marquee-reverse items-center gap-6 pr-6">
          <Itens />
        </div>
        <div aria-hidden className="flex shrink-0 animate-marquee-reverse items-center gap-6 pr-6">
          <Itens />
        </div>
      </div>
    </section>
  );
}

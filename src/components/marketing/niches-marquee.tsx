import Image from "next/image";

// Faixa de nichos — substitui a seção "Vamos pra prática". Rola devagar pra
// direita, apresentando os nichos que a Stokys atende (foto + nome), igual à
// referência do usuário. Mesmo truque de loop do marquee do rodapé: dois
// grupos idênticos animando em sincronia.

const nichos = [
  { nome: "Semi-joias", imagem: "/nicho-semijoias.png" },
  { nome: "Moda Feminina", imagem: "/nicho-moda-feminina.png" },
  { nome: "Beleza", imagem: "/nicho-beleza.png" },
  { nome: "Joias", imagem: "/nicho-joias.png" },
  { nome: "Decoração", imagem: "/nicho-decoracao.png" },
  { nome: "Acessórios", imagem: "/nicho-acessorios.png" },
  { nome: "Fitness", imagem: "/nicho-fitness.png" },
  { nome: "Pet", imagem: "/nicho-pet.png" },
];

function Itens() {
  return (
    <>
      {nichos.map((nicho, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl sm:h-20 sm:w-20">
            <Image src={nicho.imagem} alt={nicho.nome} fill sizes="80px" className="object-cover" />
          </div>
          <span className="whitespace-nowrap text-heading font-heading font-bold text-off-black-ink">
            {nicho.nome}
          </span>
        </div>
      ))}
    </>
  );
}

export function NichesMarquee() {
  return (
    <section className="overflow-hidden bg-pure-white py-14 md:py-16">
      <span className="mx-auto block w-full max-w-[1800px] px-6 text-caption font-medium uppercase text-graphite sm:px-10 lg:px-16">
        Pra qualquer nicho
      </span>
      <div className="mt-8 flex whitespace-nowrap">
        <div className="flex shrink-0 animate-marquee-reverse items-center gap-10 pr-10">
          <Itens />
        </div>
        <div aria-hidden className="flex shrink-0 animate-marquee-reverse items-center gap-10 pr-10">
          <Itens />
        </div>
      </div>
    </section>
  );
}

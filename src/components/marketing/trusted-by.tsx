import Image from "next/image";

// Tira de "confiado por" — mesma posição/fundo cinza da faixa de logos da perk.com.
// Marcas fictícias (pedido explícito do usuário) — logos reais enviados por ele.
// Rola devagar pra esquerda (mesmo truque de loop dos outros marquees do site).

const marcas = [
  { arquivo: "/marca-1.png", nome: "Vanaski", w: 2360, h: 413 },
  { arquivo: "/marca-2.png", nome: "useSezo", w: 1963, h: 1015 },
  { arquivo: "/marca-3.png", nome: "Zevime", w: 2479, h: 379 },
  { arquivo: "/marca-4.png", nome: "Grivany", w: 3692, h: 494 },
  { arquivo: "/marca-5.png", nome: "Posthure", w: 2640, h: 583 },
  { arquivo: "/marca-6.png", nome: "Hauzzia", w: 2971, h: 697 },
  { arquivo: "/marca-7.png", nome: "Cazzari", w: 2926, h: 601 },
];

function Logos() {
  return (
    <>
      {marcas.map((marca) => (
        <Image
          key={marca.arquivo}
          src={marca.arquivo}
          alt={marca.nome}
          width={marca.w}
          height={marca.h}
          className="h-4 w-auto shrink-0"
        />
      ))}
    </>
  );
}

export function TrustedBy() {
  return (
    <section className="overflow-hidden bg-ash px-6 py-3 sm:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col items-center gap-3 md:flex-row md:justify-between">
        <p className="shrink-0 text-eyebrow font-medium uppercase text-off-black-ink/70">
          Confiado por dropshippers em todo o Brasil
        </p>
        <div className="flex w-full overflow-hidden whitespace-nowrap opacity-60 md:w-[600px]">
          <div className="flex shrink-0 animate-marquee-slow items-center gap-10 pr-10">
            <Logos />
          </div>
          <div aria-hidden className="flex shrink-0 animate-marquee-slow items-center gap-10 pr-10">
            <Logos />
          </div>
        </div>
      </div>
    </section>
  );
}

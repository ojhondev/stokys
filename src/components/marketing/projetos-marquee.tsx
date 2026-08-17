import Image from "next/image";

// Slide contínuo de prints de lojas já entregues — substitui a imagem estática
// do hero (public/hero-mockup.png), no mesmo espírito de referência trazida
// pelo usuário (ecomhard.com.br): fileira de screenshots de lojas rolando sem
// parar, logo abaixo do título/CTA. Mesmo truque de loop dos outros marquees
// do site (dois grupos idênticos animando em sequência).

const projetos = [
  { arquivo: "/projetos/projeto-01.png", w: 429, h: 807 },
  { arquivo: "/projetos/projeto-02.png", w: 429, h: 807 },
  { arquivo: "/projetos/projeto-03.png", w: 429, h: 807 },
  { arquivo: "/projetos/projeto-04.png", w: 429, h: 807 },
  { arquivo: "/projetos/projeto-05.png", w: 429, h: 807 },
  { arquivo: "/projetos/projeto-06.png", w: 429, h: 807 },
  { arquivo: "/projetos/projeto-07.png", w: 429, h: 807 },
  { arquivo: "/projetos/projeto-08.png", w: 429, h: 807 },
  { arquivo: "/projetos/projeto-09.png", w: 429, h: 807 },
  { arquivo: "/projetos/projeto-10.png", w: 429, h: 807 },
  { arquivo: "/projetos/projeto-11.png", w: 429, h: 807 },
  { arquivo: "/projetos/projeto-12.png", w: 429, h: 807 },
  { arquivo: "/projetos/projeto-13.png", w: 477, h: 902 },
  { arquivo: "/projetos/projeto-14.png", w: 429, h: 807 },
  { arquivo: "/projetos/projeto-15.png", w: 429, h: 868 },
  { arquivo: "/projetos/projeto-16.png", w: 429, h: 868 },
  { arquivo: "/projetos/projeto-17.png", w: 429, h: 807 },
];

function Itens() {
  return (
    <>
      {projetos.map((projeto, i) => (
        <div
          key={i}
          className="relative h-64 w-36 shrink-0 overflow-hidden rounded-2xl sm:h-80 sm:w-44"
        >
          <Image
            src={projeto.arquivo}
            alt="Loja criada pela Stokys"
            width={projeto.w}
            height={projeto.h}
            loading="eager"
            className="h-full w-full object-cover object-top"
          />
        </div>
      ))}
    </>
  );
}

export function ProjetosMarquee() {
  return (
    <div className="mt-10 flex w-full overflow-hidden whitespace-nowrap">
      <div className="flex shrink-0 animate-marquee-slow items-center gap-4 pr-4">
        <Itens />
      </div>
      <div aria-hidden className="flex shrink-0 animate-marquee-slow items-center gap-4 pr-4">
        <Itens />
      </div>
    </div>
  );
}

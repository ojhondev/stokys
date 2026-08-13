import { LinkButton } from "@/components/ui/button";

// Bloco de estatística gigante, centralizado — mesmo padrão da perk.com ("One
// platform. 225,000 hours saved."): heading em 2 linhas (a segunda carrega o
// número), parágrafo curto, um único CTA. A Stokys ainda não tem esses números
// reais, então ficam marcados como placeholder — trocar quando existir.

export function StatCallout({
  linha1,
  linha2,
  descricao,
  ctaLabel,
  ctaHref,
  fundo = "off-white-canvas",
}: {
  linha1: string;
  linha2: string;
  descricao: string;
  ctaLabel: string;
  ctaHref: string;
  fundo?: "off-white-canvas" | "pure-white";
}) {
  const fundoClasses = {
    "off-white-canvas": "bg-off-white-canvas",
    "pure-white": "bg-pure-white",
  } as const;

  return (
    <section className={`${fundoClasses[fundo]} px-6 py-14 sm:px-10 lg:px-16`}>
      <div className="mx-auto flex w-full max-w-[720px] flex-col items-center text-center">
        <h2 className="text-heading-lg font-heading font-medium text-off-black-ink md:text-display">
          {linha1}
          <br />
          {linha2}
        </h2>
        <p className="mt-6 max-w-[480px] text-body text-graphite">{descricao}</p>
        <LinkButton href={ctaHref} className="mt-8">
          {ctaLabel}
        </LinkButton>
      </div>
    </section>
  );
}

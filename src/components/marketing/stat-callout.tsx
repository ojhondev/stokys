import { LinkButton } from "@/components/ui/button";

// Bloco de estatística gigante — mesmo padrão da perk.com ("200,000 hours saved",
// "$3.22M off the books", "100,000 tasks handled everyday"). A Stokys ainda não tem
// esses números reais, então o valor fica marcado como placeholder visível — trocar
// por um número real (lojas entregues, produtos cadastrados etc.) quando existir.

export function StatCallout({
  numero,
  heading,
  descricao,
  ctaLabel,
  ctaHref,
  fundo = "off-white-canvas",
}: {
  numero: string;
  heading: string;
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
    <section className={`${fundoClasses[fundo]} px-6 py-20`}>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-start">
        <p className="text-heading-lg font-medium text-off-black-ink md:text-display">
          {numero}
        </p>
        <h2 className="mt-4 max-w-[560px] text-heading font-medium text-off-black-ink">
          {heading}
        </h2>
        <p className="mt-4 max-w-[480px] text-body text-graphite">{descricao}</p>
        <LinkButton href={ctaHref} className="mt-8">
          {ctaLabel}
        </LinkButton>
      </div>
    </section>
  );
}

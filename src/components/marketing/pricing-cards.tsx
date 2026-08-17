import { planosConteudo } from "@/lib/planos-conteudo";
import { PlanoCard } from "@/components/planos/plano-card";

// Cards de preço — desktop segue o "Pick your plan" da perk.com (cards lado a
// lado), mobile empilha (mesmo grid responsivo, sem duplicar componente).
// Card em si vive em components/planos/plano-card.tsx, reusado pelo
// onboarding (plano-step.tsx) — mesmo visual e mesmo dropdown "Ver o que
// está incluso" (<details>/<summary>) nos dois lugares.

export function PricingCards() {
  return (
    <section id="planos" className="bg-pure-white px-6 py-14 sm:px-10 md:py-16 lg:px-16">
      <div className="mx-auto w-full max-w-[1800px]">
        <h2 className="text-center text-heading-lg font-heading font-bold text-off-black-ink md:text-display">
          Planos que cabem no bolso
        </h2>

        <div className="mt-14 grid items-start gap-6 sm:grid-cols-1 md:grid-cols-3">
          {planosConteudo.map((plano) => (
            <PlanoCard
              key={plano.slug}
              plano={plano}
              acao={{ tipo: "link", href: `/cadastro?tipo=cliente&plano=${plano.slug}` }}
            />
          ))}
        </div>

        <p className="mt-6 text-caption text-graphite">
          *Pagamento único por projeto — não é mensalidade.
        </p>
      </div>
    </section>
  );
}

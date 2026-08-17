import { LinkButton } from "@/components/ui/button";
import { ProjetosMarquee } from "@/components/marketing/projetos-marquee";

export function Hero() {
  return (
    <section className="bg-hero-canvas px-6 pb-14 pt-12 sm:px-10 md:pb-16 md:pt-16 lg:px-16">
      <div className="mx-auto flex w-full max-w-[900px] flex-col items-center text-center">
        <h1 className="text-heading-lg font-heading font-bold text-off-black-ink md:text-display">
          Loja pronta e profissional. Você só vende.
        </h1>

        <div className="mt-6 flex items-center gap-2 rounded-full bg-pure-white px-4 py-2">
          <span className="flex text-body text-off-black-ink" aria-hidden>
            ★★★★<span className="opacity-30">★</span>
          </span>
          <span className="text-body-sm font-medium text-off-black-ink">
            [+X avaliações de clientes]
          </span>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          <LinkButton href="/cadastro?tipo=cliente">Criar loja</LinkButton>
          <LinkButton href="#como-funciona" variant="ghost">
            Ver como funciona
          </LinkButton>
        </div>
      </div>

      <div className="-mx-6 mt-10 sm:-mx-10 lg:-mx-16">
        <ProjetosMarquee />
      </div>
    </section>
  );
}

import Image from "next/image";
import { LinkButton } from "@/components/ui/button";

// TODO: a imagem abaixo (public/hero-mockup.png) é um screenshot real do produto da
// Perk (competidora) — ver conversa com o usuário sobre trocar por um mockup próprio
// da Stokys antes de publicar em produção.

export function Hero() {
  return (
    <section className="bg-off-white-canvas px-6 pb-0 pt-12 sm:px-10 md:pt-16 lg:px-16">
      <div className="mx-auto flex w-full max-w-[900px] flex-col items-center text-center">
        <h1 className="text-heading-lg font-heading font-medium text-off-black-ink md:text-display">
          Comece um negócio com uma loja de dropshipping
        </h1>

        <div className="mt-6 flex items-center gap-2 rounded-full bg-pure-white px-4 py-2">
          <span className="text-body-sm text-electric-lime">★★★★★</span>
          <span className="text-body-sm font-medium text-off-black-ink">
            [+X avaliações de clientes]
          </span>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          <LinkButton href="/onboarding">Montar minha loja</LinkButton>
          <LinkButton href="#como-funciona" variant="ghost">
            Ver como funciona
          </LinkButton>
        </div>
      </div>

      <div className="mx-auto mt-10 w-full max-w-[960px]">
        <Image
          src="/hero-mockup.png"
          alt="Preview da plataforma Stokys"
          width={6197}
          height={1795}
          className="h-auto w-full"
          priority
        />
      </div>
    </section>
  );
}

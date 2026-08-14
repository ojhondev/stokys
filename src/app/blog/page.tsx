import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { PromoBar } from "@/components/marketing/promo-bar";

// Blog e Dicas — sem posts publicados ainda, então fica como estado de espera
// com os temas planejados, em vez de fabricar artigo com data/autor fake.

const temas = [
  {
    categoria: "Onboarding",
    titulo: "Como escolher entre Zen, Pro e Customizado",
    descricao: "O que muda na prática entre os 3 planos, item por item.",
  },
  {
    categoria: "Produtos",
    titulo: "Como mineirar produtos que realmente vendem",
    descricao: "Critérios pra escolher produto além do preço baixo.",
  },
  {
    categoria: "Tráfego",
    titulo: "Primeiros passos com tráfego pago",
    descricao: "O que preparar na loja antes de ligar os anúncios.",
  },
  {
    categoria: "Operação",
    titulo: "Atendimento que não vira gargalo",
    descricao: "Como estruturar suporte sem depender só de WhatsApp.",
  },
];

export default function BlogPage() {
  return (
    <>
      <SiteHeader />

      <main className="flex flex-1 flex-col bg-off-white-canvas px-6 py-14 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-[1800px]">
          <span className="text-caption font-medium uppercase text-graphite">Blog e dicas</span>
          <h1 className="mt-3 max-w-[560px] text-heading-lg font-heading font-bold text-off-black-ink">
            Conteúdo pra quem tá montando loja de verdade.
          </h1>
          <p className="mt-4 max-w-[480px] text-body-sm text-graphite">
            Ainda não publicamos nenhum artigo — esses são os temas que estamos preparando
            primeiro.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {temas.map((tema) => (
              <div
                key={tema.titulo}
                className="rounded-3xl bg-pure-white p-8 transition-transform duration-200 hover:scale-[1.02]"
              >
                <span className="text-caption font-bold uppercase text-graphite">
                  {tema.categoria}
                </span>
                <h3 className="mt-3 text-subheading font-heading font-bold text-off-black-ink">
                  {tema.titulo}
                </h3>
                <p className="mt-2 text-body-sm text-graphite">{tema.descricao}</p>
                <span className="mt-4 inline-block rounded-full bg-off-white-canvas px-3 py-1 text-caption font-medium uppercase text-graphite">
                  Em breve
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
      <div className="h-20" aria-hidden />
      <PromoBar />
    </>
  );
}

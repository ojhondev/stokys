import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { LinkButton } from "@/components/ui/button";
import { planosConteudo } from "@/lib/planos-conteudo";

const passos = [
  {
    numero: "01",
    titulo: "Escolha o plano",
    descricao:
      "Zen, Pro ou Customizado — compare o que está incluso em cada um e escolha na hora.",
  },
  {
    numero: "02",
    titulo: "Pague dentro da plataforma",
    descricao: "PIX, cartão de crédito ou boleto — sem sair da Stokys, sem link externo.",
  },
  {
    numero: "03",
    titulo: "Acompanhe a produção",
    descricao: "Status, mensagens com a equipe e preview da loja sendo montada, em tempo real.",
  },
  {
    numero: "04",
    titulo: "Receba pronta pra vender",
    descricao: "Loja publicada, produtos cadastrados, e um diretório de parceiros de tráfego.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="bg-off-white-canvas px-6 py-20 md:py-24">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col items-start">
            <span className="rounded-full bg-pure-white px-3 py-1 text-caption font-medium uppercase text-off-black-ink">
              Agência de dropshipping
            </span>
            <h1 className="mt-6 max-w-[720px] text-heading-lg font-medium text-off-black-ink md:text-display">
              Sua loja pronta, sem virar mais um projeto parado no WhatsApp.
            </h1>
            <p className="mt-6 max-w-[520px] text-body text-graphite">
              Escolha um plano, pague dentro da plataforma e acompanhe cada etapa da produção da
              sua loja de dropshipping — do onboarding até a entrega.
            </p>
            <div className="mt-10">
              <LinkButton href="/onboarding">Montar minha loja</LinkButton>
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section id="como-funciona" className="px-6 py-20 md:py-24">
          <div className="mx-auto w-full max-w-[1200px]">
            <span className="text-caption font-medium uppercase text-graphite">
              Como funciona
            </span>
            <h2 className="mt-3 max-w-[560px] text-heading font-medium text-off-black-ink">
              Do onboarding à loja publicada, tudo em um só lugar.
            </h2>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {passos.map((passo) => (
                <div
                  key={passo.numero}
                  className="rounded-3xl bg-off-white-canvas p-8"
                >
                  <span className="text-caption font-medium text-graphite">{passo.numero}</span>
                  <h3 className="mt-4 text-subheading font-medium text-off-black-ink">
                    {passo.titulo}
                  </h3>
                  <p className="mt-3 text-body-sm text-graphite">{passo.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Planos */}
        <section id="planos" className="bg-off-white-canvas px-6 py-20 md:py-24">
          <div className="mx-auto w-full max-w-[1200px]">
            <span className="text-caption font-medium uppercase text-graphite">Planos</span>
            <h2 className="mt-3 max-w-[560px] text-heading font-medium text-off-black-ink">
              Três formas de montar sua loja.
            </h2>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {planosConteudo.map((plano) => (
                <div
                  key={plano.slug}
                  className={`flex flex-col rounded-3xl p-10 ${
                    plano.destaque ? "bg-electric-lime" : "bg-pure-white"
                  }`}
                >
                  <h3 className="text-subheading font-medium text-off-black-ink">{plano.nome}</h3>
                  <p className="mt-2 text-body-sm text-off-black-ink/70">{plano.descricao}</p>

                  <ul className="mt-8 flex flex-1 flex-col gap-3">
                    {plano.itens.map((item) => (
                      <li key={item} className="text-body-sm text-off-black-ink">
                        {item}
                      </li>
                    ))}
                  </ul>

                  <LinkButton
                    href={`/onboarding?plano=${plano.slug}`}
                    variant={plano.destaque ? "ghost" : "primary"}
                    className="mt-10 self-start"
                  >
                    Escolher {plano.nome}
                  </LinkButton>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Parceiros */}
        <section id="parceiros" className="px-6 py-20 md:py-24">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col items-start rounded-3xl bg-deep-charcoal p-12 md:p-16">
            <span className="text-caption font-medium uppercase text-ash">Parceiros</span>
            <h2 className="mt-3 max-w-[560px] text-heading font-medium text-off-white-canvas">
              Loja pronta é só o começo — conecte com quem já sabe vender.
            </h2>
            <p className="mt-4 max-w-[480px] text-body-sm text-ash">
              Depois da entrega, você acessa nossa vitrine de agências de performance e tráfego
              pago parceiras, com contato direto pelo WhatsApp.
            </p>
            <LinkButton href="/parceiros" variant="ghost" className="mt-8 text-off-white-canvas">
              Ver parceiros
            </LinkButton>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

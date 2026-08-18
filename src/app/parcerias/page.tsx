import { LinkButton } from "@/components/ui/button";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { PromoBar } from "@/components/marketing/promo-bar";
import { linkWhatsapp } from "@/lib/whatsapp";

// Programa de indicação pra influenciadores — página própria (não é o mesmo
// "parceiro" do /cadastro?tipo=parceiro, que é a vitrine de prestadores de
// serviço dentro do dashboard do cliente). Sem sistema de comissão/tracking
// de indicação implementado ainda, então o CTA final vira contato direto via
// WhatsApp em vez de um cadastro — mesmo padrão de lead-gen já usado no resto
// do site (ver lib/whatsapp.ts).

const MENSAGEM_PARCERIA = "Olá! Tenho interesse em ser parceiro influenciador da Stokys.";

const vantagens = [
  {
    numero: "01",
    titulo: "Ganhe com cada indicação",
    descricao:
      "Transforme sua audiência em uma nova fonte de receita. Você recebe comissão pelos clientes que chegarem através da sua indicação.",
  },
  {
    numero: "02",
    titulo: "Entregue algo que sua audiência realmente precisa",
    descricao:
      "Em vez de apenas recomendar mais uma ferramenta, você oferece uma solução completa para quem quer começar a vender online com uma loja profissional.",
  },
  {
    numero: "03",
    titulo: "Fortaleça sua marca como referência",
    descricao:
      "Associe seu conteúdo a uma solução profissional e ajude sua comunidade a sair da ideia e colocar o próprio negócio no ar.",
  },
];

export default function ParceriasPage() {
  return (
    <>
      <SiteHeader />

      <main className="flex flex-1 flex-col bg-hero-canvas">
        <section className="px-6 pb-14 pt-14 sm:px-10 md:pt-20 lg:px-16">
          <div className="mx-auto flex w-full max-w-[900px] flex-col items-center text-center">
            <span className="text-caption font-medium uppercase text-graphite">
              Parceria com Influenciadores
            </span>
            <h1 className="mt-3 text-heading-lg font-heading font-bold text-off-black-ink md:text-display">
              Transforme sua audiência em uma nova fonte de renda
            </h1>
            <p className="mt-6 max-w-[640px] text-body text-graphite">
              Você já influencia pessoas. Agora, pode transformar essa influência em negócios.
            </p>
            <p className="mt-4 max-w-[640px] text-body text-graphite">
              Na Stokys, você indica uma forma simples e profissional para seus seguidores
              começarem a vender pela internet — e ainda ganha por cada cliente que chegar através
              da sua indicação.
            </p>
          </div>
        </section>

        <section className="bg-pure-white px-6 py-14 sm:px-10 md:py-16 lg:px-16">
          <div className="mx-auto w-full max-w-[900px] text-center">
            <h2 className="text-heading font-heading font-bold text-off-black-ink">
              Você indica. A Stokys cria. Seu público vende.
            </h2>
            <p className="mt-4 text-body text-graphite">
              Seus seguidores não precisam entender de programação, design ou tecnologia. A Stokys
              entrega uma loja profissional, pronta para vender, enquanto você fica focado no que
              realmente importa: criar conteúdo e construir sua comunidade.
            </p>
          </div>
        </section>

        <section id="parceiros" className="bg-hero-canvas px-6 py-14 sm:px-10 md:py-16 lg:px-16">
          <div className="mx-auto w-full max-w-[1800px]">
            <h2 className="max-w-[720px] text-heading-lg font-heading font-bold text-off-black-ink">
              3 vantagens de ser parceiro Stokys
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {vantagens.map((vantagem) => (
                <div
                  key={vantagem.numero}
                  className="flex flex-col rounded-3xl bg-pure-white p-8 transition-transform duration-200 hover:scale-[1.02]"
                >
                  <span className="text-caption font-medium text-graphite">{vantagem.numero}</span>
                  <h3 className="mt-3 text-subheading font-heading font-bold text-off-black-ink">
                    {vantagem.titulo}
                  </h3>
                  <p className="mt-2 text-body-sm text-graphite">{vantagem.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-pure-white px-6 py-14 sm:px-10 md:py-16 lg:px-16">
          <div className="mx-auto flex w-full max-w-[1800px] flex-col items-center text-center">
            <h2 className="max-w-[640px] text-heading-lg font-heading font-bold text-off-black-ink">
              Pronto para transformar influência em negócio?
            </h2>
            <p className="mt-4 max-w-[480px] text-body text-graphite">
              Junte-se à Stokys e comece a ganhar com as suas indicações.
            </p>
            <div className="mt-8">
              <LinkButton
                href={linkWhatsapp(MENSAGEM_PARCERIA)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Quero ser parceiro
              </LinkButton>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <div className="h-20" aria-hidden />
      <PromoBar />
    </>
  );
}

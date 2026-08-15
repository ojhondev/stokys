import { AnnouncementBar } from "@/components/marketing/announcement-bar";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Hero } from "@/components/marketing/hero";
import { TrustedBy } from "@/components/marketing/trusted-by";
import { StatCallout } from "@/components/marketing/stat-callout";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { ComparisonTable } from "@/components/marketing/comparison-table";
import { ValueGrid } from "@/components/marketing/value-grid";
import { FeaturesGrid } from "@/components/marketing/features-grid";
import { Personas } from "@/components/marketing/personas";
import { CaseStudies } from "@/components/marketing/case-studies";
import { NichesMarquee } from "@/components/marketing/niches-marquee";
import { Faq } from "@/components/marketing/faq";
import { ClosingCta } from "@/components/marketing/closing-cta";
import { PromoBar } from "@/components/marketing/promo-bar";
import { linkWhatsapp, MENSAGEM_WHATSAPP_GENERICA } from "@/lib/whatsapp";

// Ordem da página (pedido do usuário): Seção 1 > Como funciona > Loja
// profissional de verdade > Toda etapa sem você perguntar > Planos e preços
// > Resultados > FAQ > CTA final. As seções de apoio (marcas, nichos,
// diferenciais, personas) ficam encaixadas perto do bloco com que mais se
// relacionam, em vez de removidas.

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        <Hero />
        <TrustedBy />
        <NichesMarquee />

        <StatCallout
          linha1="Uma plataforma."
          contadorAte={600}
          contadorSufixo="lojas entregues até hoje."
          descricao="Onboarding, pagamento, produção e preview — sem trocar de ferramenta em nenhuma etapa."
          ctaLabel="Criar loja"
          ctaHref={linkWhatsapp(MENSAGEM_WHATSAPP_GENERICA)}
          fundo="pure-white"
        />

        <FeaturesGrid />
        <ValueGrid />

        <StatCallout
          linha1="Loja profissional"
          linha2="de verdade."
          descricao="Toda decisão do projeto fica registrada — orçamento, acessos, mensagens e pagamento, tudo num histórico só."
          ctaLabel="Começar agora"
          ctaHref={linkWhatsapp(MENSAGEM_WHATSAPP_GENERICA)}
          fundo="off-white-canvas"
        />

        <Personas />

        <div className="hidden md:block">
          <StatCallout
            linha1="Toda etapa,"
            linha2="sem você perguntar “como tá indo”."
            descricao="Status atualizado e preview disponível assim que a produção avança."
            ctaLabel="Ver como funciona"
            ctaHref="#como-funciona"
            fundo="off-white-canvas"
          />
        </div>

        <PricingCards />
        <ComparisonTable />
        <CaseStudies />
        <Faq />
        <ClosingCta />
      </main>

      <SiteFooter />
      <div className="h-20" aria-hidden />
      <PromoBar />
    </>
  );
}

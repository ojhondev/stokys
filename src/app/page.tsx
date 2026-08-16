import { AnnouncementBar } from "@/components/marketing/announcement-bar";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Hero } from "@/components/marketing/hero";
import { TrustedBy } from "@/components/marketing/trusted-by";
import { StatCallout } from "@/components/marketing/stat-callout";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { ComparisonTable } from "@/components/marketing/comparison-table";
import { FeaturesGrid } from "@/components/marketing/features-grid";
import { Personas } from "@/components/marketing/personas";
import { CaseStudies } from "@/components/marketing/case-studies";
import { Depoimentos } from "@/components/marketing/depoimentos";
import { NichesMarquee } from "@/components/marketing/niches-marquee";
import { Faq } from "@/components/marketing/faq";
import { ClosingCta } from "@/components/marketing/closing-cta";
import { PromoBar } from "@/components/marketing/promo-bar";

// Ordem da página (pedido do usuário): Seção 1 > Como funciona > Loja
// profissional de verdade > Depoimentos > Planos e preços > Resultados >
// FAQ > CTA final. ValueGrid foi absorvida pelo "Por dentro da plataforma"
// (mesma copy, uma seção só) e a StatCallout "Toda etapa..." virou a seção
// de Depoimentos, no mesmo lugar.

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
          ctaHref="/cadastro?tipo=cliente"
          fundo="pure-white"
        />

        <FeaturesGrid />

        <StatCallout
          linha1="Loja profissional"
          linha2="de verdade."
          descricao="Toda decisão do projeto fica registrada — orçamento, acessos, mensagens e pagamento, tudo num histórico só."
          ctaLabel="Começar agora"
          ctaHref="/cadastro?tipo=cliente"
          fundo="off-white-canvas"
        />

        <Personas />
        <Depoimentos />

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

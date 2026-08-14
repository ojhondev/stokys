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
import { ClosingCta } from "@/components/marketing/closing-cta";
import { PromoBar } from "@/components/marketing/promo-bar";

// Estrutura da página segue, seção a seção, o layout real de perk.com (hero 2-col,
// tira de logos, blocos de estatística gigante, abas, grid 4-col, grid de features,
// cards de persona, cases, recursos, banner de fechamento, rodapé escuro) — conteúdo
// adaptado pra Stokys, com placeholders explícitos onde a Perk usa dado real que a
// Stokys ainda não tem (depoimentos, cases, métricas).

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        <Hero />
        <TrustedBy />

        <StatCallout
          linha1="Uma plataforma."
          linha2="[—] lojas entregues até hoje."
          descricao="Onboarding, pagamento, produção e preview — sem trocar de ferramenta em nenhuma etapa."
          ctaLabel="Montar minha loja"
          ctaHref="/onboarding"
          fundo="pure-white"
        />

        <PricingCards />
        <ComparisonTable />

        <StatCallout
          linha1="Loja profissional"
          linha2="de verdade."
          descricao="Toda decisão do projeto fica registrada — orçamento, acessos, mensagens e pagamento, tudo num histórico só."
          ctaLabel="Começar agora"
          ctaHref="/onboarding"
          fundo="off-white-canvas"
        />

        <ValueGrid />

        <StatCallout
          linha1="Toda etapa,"
          linha2="sem você perguntar “como tá indo”."
          descricao="Status atualizado e preview disponível assim que a produção avança."
          ctaLabel="Ver como funciona"
          ctaHref="#como-funciona"
          fundo="off-white-canvas"
        />

        <FeaturesGrid />
        <Personas />
        <CaseStudies />
        <NichesMarquee />
        <ClosingCta />
      </main>

      <SiteFooter />
      <div className="h-20" aria-hidden />
      <PromoBar />
    </>
  );
}

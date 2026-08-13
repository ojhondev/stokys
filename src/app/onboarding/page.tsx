import Link from "next/link";
import { PlanoStep } from "./plano-step";
import type { PlanoConteudo } from "@/lib/planos-conteudo";

const slugsValidos: PlanoConteudo["slug"][] = ["zen", "pro", "customizado"];

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ plano?: string }>;
}) {
  const { plano } = await searchParams;
  const inicial = slugsValidos.find((slug) => slug === plano);

  return (
    <main className="flex flex-1 flex-col bg-pure-white px-6 py-14 sm:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-[1800px]">
        <Link href="/" className="text-body font-medium text-off-black-ink">
          Stokys
        </Link>

        <span className="mt-10 block text-caption font-medium uppercase text-graphite">
          Onboarding · Etapa 1 de 4
        </span>
        <h1 className="mt-3 max-w-[560px] text-heading font-heading font-medium text-off-black-ink">
          Qual plano combina com a sua loja?
        </h1>

        <div className="mt-10">
          <PlanoStep inicial={inicial} />
        </div>
      </div>
    </main>
  );
}

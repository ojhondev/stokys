import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { OnboardingWizard } from "./onboarding-wizard";
import type { DadosOnboarding } from "./types";

const slugsValidos: NonNullable<DadosOnboarding["plano"]>[] = ["zen", "pro", "customizado"];

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ plano?: string }>;
}) {
  const { plano } = await searchParams;
  const inicial = slugsValidos.find((slug) => slug === plano);

  const sessao = await getSession();
  if (!sessao) {
    const next = `/onboarding${inicial ? `?plano=${inicial}` : ""}`;
    redirect(`/cadastro?tipo=cliente&next=${encodeURIComponent(next)}`);
  }
  if (sessao.papel !== "cliente") {
    redirect("/dashboard");
  }

  return (
    <main className="flex flex-1 flex-col bg-pure-white px-6 py-14 sm:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-[900px]">
        <Link href="/" className="text-body font-medium text-off-black-ink">
          Stokys
        </Link>

        <div className="mt-10">
          <OnboardingWizard planoInicial={inicial} />
        </div>
      </div>
    </main>
  );
}

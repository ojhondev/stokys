import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { usuarios } from "@/lib/db/schema";
import { OnboardingWizard } from "./onboarding-wizard";
import type { DadosOnboarding } from "./types";

const slugsValidos: NonNullable<DadosOnboarding["plano"]>[] = ["zen", "pro", "customizado"];

// O wrapper de layout (container centralizado vs. split-screen full-bleed da
// Revisão) fica dentro do OnboardingWizard — ele sabe qual etapa está ativa,
// esta página só resolve sessão/plano inicial.
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

  const [usuario] = await getDb()
    .select({ nome: usuarios.nome, email: usuarios.email })
    .from(usuarios)
    .where(eq(usuarios.id, sessao.userId))
    .limit(1);

  return (
    <main className="flex flex-1 flex-col bg-pure-white">
      <OnboardingWizard
        planoInicial={inicial}
        nome={usuario?.nome ?? ""}
        email={usuario?.email ?? ""}
      />
    </main>
  );
}

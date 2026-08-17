import Image from "next/image";
import Link from "next/link";
import { CadastroForm } from "./cadastro-form";

const TIPOS = new Set(["cliente", "parceiro"]);

export default async function CadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; plano?: string; next?: string }>;
}) {
  const { tipo, plano, next } = await searchParams;

  if (!tipo || !TIPOS.has(tipo)) {
    return (
      <main className="flex flex-1 items-center justify-center bg-off-white-canvas px-6 py-14 sm:px-10 lg:px-16">
        <div className="w-full max-w-[480px] rounded-3xl bg-pure-white p-10">
          <div className="flex flex-col items-center text-center">
            <Link href="/">
              <Image
                src="/logo-stokys.png"
                alt="Stokys"
                width={125}
                height={28}
                className="h-7 w-auto"
              />
            </Link>
            <h1 className="mt-8 text-heading-lg font-heading font-bold text-off-black-ink">
              Criar conta grátis
            </h1>
            <p className="mt-2 text-body-sm text-graphite">Como você quer entrar?</p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href={`/cadastro?tipo=cliente${plano ? `&plano=${plano}` : ""}${next ? `&next=${next}` : ""}`}
              className="rounded-lg border border-ash bg-pure-white p-5 text-left transition-colors hover:border-off-black-ink"
            >
              <span className="block text-body font-semibold text-off-black-ink">
                Sou cliente
              </span>
              <span className="mt-1 block text-body-sm text-graphite">
                Quero abrir minha loja com a Stokys.
              </span>
            </Link>

            <Link
              href={`/cadastro?tipo=parceiro${next ? `&next=${next}` : ""}`}
              className="rounded-lg border border-ash bg-pure-white p-5 text-left transition-colors hover:border-off-black-ink"
            >
              <span className="block text-body font-semibold text-off-black-ink">
                Sou parceiro
              </span>
              <span className="mt-1 block text-body-sm text-graphite">
                Quero oferecer meus serviços na vitrine da Stokys.
              </span>
            </Link>
          </div>

          <p className="mt-8 text-center text-body-sm text-graphite">
            Já tem conta?{" "}
            <Link href="/login" className="font-medium text-off-black-ink underline">
              Entrar
            </Link>
          </p>
        </div>
      </main>
    );
  }

  // Sem `next` explícito, mas com plano escolhido na LP (pricing-cards), leva
  // esse plano pro onboarding em vez de perder a escolha (ver plano V1).
  const nextEfetivo =
    next ?? (tipo === "cliente" && plano ? `/onboarding?plano=${plano}` : undefined);

  return (
    <main className="flex flex-1 items-center justify-center bg-off-white-canvas px-6 py-14 sm:px-10 lg:px-16">
      <div className="w-full max-w-[440px] rounded-3xl bg-pure-white p-10">
        <div className="flex flex-col items-center text-center">
          <Link href="/">
            <Image src="/logo-stokys.png" alt="Stokys" width={125} height={28} className="h-7 w-auto" />
          </Link>
          <h1 className="mt-8 text-heading-lg font-heading font-bold text-off-black-ink">
            {tipo === "parceiro" ? "Cadastro de parceiro" : "Criar conta grátis"}
          </h1>
          <p className="mt-2 text-body-sm text-graphite">
            {tipo === "parceiro"
              ? "Depois de criar a conta, seu perfil passa por aprovação antes de aparecer na vitrine."
              : "Crie sua loja com a Stokys — confirme o e-mail e comece o onboarding em seguida."}
          </p>
        </div>

        <CadastroForm tipo={tipo as "cliente" | "parceiro"} next={nextEfetivo} />

        <p className="mt-6 text-center text-body-sm text-graphite">
          <Link href="/cadastro" className="underline">
            Trocar tipo de conta
          </Link>
        </p>
      </div>
    </main>
  );
}

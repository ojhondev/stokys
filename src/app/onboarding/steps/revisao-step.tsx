import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { planosConteudo, formatarPreco } from "@/lib/planos-conteudo";
import type { StepProps } from "../types";

const labelPlataforma = { shopify: "Shopify", nuvemshop: "Nuvemshop" } as const;
const labelTema = { spark: "Spark", quart: "Quart" } as const;
const labelMercado = { brasil: "Brasil", global: "Global", latam: "Latam" } as const;

// Pagamento não faz parte do onboarding — só acontece depois, dentro do dashboard,
// com o usuário logado (ver docs/PRD.md 4.3). "Criar minha loja" leva pro login;
// TODO (Fase 1): criar a conta/projeto de verdade aqui antes de redirecionar.

export function RevisaoStep({ dados, onVoltar }: StepProps) {
  const router = useRouter();
  const plano = planosConteudo.find((p) => p.slug === dados.plano);

  const linhas = [
    { label: "Plano", valor: plano?.nome },
    { label: "Plataforma", valor: dados.plataforma && labelPlataforma[dados.plataforma] },
    dados.plano === "customizado"
      ? { label: "Mercado", valor: dados.mercadoAlvo && labelMercado[dados.mercadoAlvo] }
      : { label: "Tema", valor: dados.tema && labelTema[dados.tema] },
    { label: "Nicho", valor: dados.nicho },
    { label: "Referências", valor: `${dados.referencias.length} lojas listadas` },
    { label: "Valor", valor: plano && formatarPreco(plano.precoCentavos) },
  ];

  return (
    <div>
      <h1 className="text-heading font-heading font-bold text-off-black-ink">
        Confira antes de criar sua loja
      </h1>
      <p className="mt-2 text-body-sm text-graphite">
        Falta só o pagamento — ele acontece no próximo passo, depois de você entrar na sua conta.
        Os acessos da plataforma são pedidos depois, no painel.
      </p>

      <div className="mt-8 flex flex-col gap-2 rounded-3xl bg-off-white-canvas p-6">
        {linhas.map((linha) => (
          <div
            key={linha.label}
            className="flex items-center justify-between border-b border-ash py-2 text-body-sm text-off-black-ink last:border-b-0"
          >
            <span className="text-graphite">{linha.label}</span>
            <span className="font-medium">{linha.valor}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" onClick={onVoltar} variant="ghost">
          Voltar
        </Button>
        <Button
          onClick={() => router.push("/login?next=/dashboard/pagamentos")}
          className="w-full sm:w-auto"
        >
          Criar minha loja
        </Button>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import type { Plataforma, StepProps } from "../types";

const plataformas: { valor: Plataforma; label: string }[] = [
  { valor: "shopify", label: "Shopify" },
  { valor: "nuvemshop", label: "Nuvemshop" },
];

export function PlataformaStep({ dados, setDados, onContinuar, onVoltar }: StepProps) {
  const podeContinuar = Boolean(
    dados.plataforma && dados.acessoUsuario.trim() && dados.acessoSenha.trim(),
  );

  return (
    <div>
      <h1 className="text-heading font-heading font-medium text-off-black-ink">
        Onde sua loja vai rodar?
      </h1>

      <div className="mt-8">
        <p className="text-caption font-medium uppercase text-graphite">Plataforma</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {plataformas.map((p) => {
            const ativo = dados.plataforma === p.valor;
            return (
              <button
                key={p.valor}
                type="button"
                onClick={() => setDados((d) => ({ ...d, plataforma: p.valor }))}
                className={`rounded-3xl p-6 text-left text-subheading font-heading font-medium text-off-black-ink transition-colors ${
                  ativo ? "bg-electric-lime" : "bg-off-white-canvas"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-caption text-graphite">
          Mesmo preço nas duas — a escolha só muda o processo técnico de implementação.
        </p>
      </div>

      <div className="mt-8">
        <p className="text-caption font-medium uppercase text-graphite">Acessos da plataforma</p>
        <div className="mt-3 flex flex-col gap-4 rounded-3xl bg-off-white-canvas p-6">
          <label className="flex flex-col gap-2">
            <span className="text-body-sm font-medium text-off-black-ink">
              Usuário / e-mail de acesso
            </span>
            <input
              type="text"
              value={dados.acessoUsuario}
              onChange={(e) => setDados((d) => ({ ...d, acessoUsuario: e.target.value }))}
              className="rounded-lg border border-ash bg-pure-white px-4 py-3 text-body text-off-black-ink"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-body-sm font-medium text-off-black-ink">Senha</span>
            <input
              type="password"
              value={dados.acessoSenha}
              onChange={(e) => setDados((d) => ({ ...d, acessoSenha: e.target.value }))}
              className="rounded-lg border border-ash bg-pure-white px-4 py-3 text-body text-off-black-ink"
            />
          </label>
          <p className="text-caption text-graphite">
            Recomendamos desativar a autenticação de dois fatores durante a implementação, pra não
            travar a produção — pode reativar assim que a loja for entregue. Os acessos ficam
            criptografados e são revogados após a entrega.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" onClick={onVoltar} variant="ghost">
          Voltar
        </Button>
        <Button disabled={!podeContinuar} onClick={onContinuar} className="w-full sm:w-auto">
          Continuar
        </Button>
      </div>
    </div>
  );
}

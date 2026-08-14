import { Button } from "@/components/ui/button";
import type { MercadoAlvo, StepProps } from "../types";

const mercados: { valor: MercadoAlvo; label: string; descricao: string }[] = [
  { valor: "brasil", label: "Brasil", descricao: "Idioma e pagamento nacionais." },
  { valor: "global", label: "Global", descricao: "Loja em inglês, pagamento internacional." },
  { valor: "latam", label: "Latam", descricao: "Espanhol, pagamento regional." },
];

const paleta = ["#14140f", "#beff50", "#30302a", "#f5f5eb", "#6e6e64", "#d2d2c8"];

export function PersonalizacaoStep({ dados, setDados, onContinuar, onVoltar }: StepProps) {
  function alternarCor(cor: string) {
    setDados((d) => ({
      ...d,
      paletaCores: d.paletaCores.includes(cor)
        ? d.paletaCores.filter((c) => c !== cor)
        : [...d.paletaCores, cor],
    }));
  }

  const podeContinuar = Boolean(dados.mercadoAlvo);

  return (
    <div>
      <h1 className="text-heading font-heading font-bold text-off-black-ink">
        Como a sua loja Customizada vai se apresentar?
      </h1>
      <p className="mt-2 max-w-[520px] text-body-sm text-graphite">
        O mercado escolhido define o template Shopify, o idioma e o método de pagamento final da
        loja publicada.
      </p>

      <div className="mt-8">
        <p className="text-caption font-medium uppercase text-graphite">Mercado-alvo</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          {mercados.map((m) => {
            const ativo = dados.mercadoAlvo === m.valor;
            return (
              <button
                key={m.valor}
                type="button"
                onClick={() => setDados((d) => ({ ...d, mercadoAlvo: m.valor }))}
                className={`rounded-3xl p-6 text-left transition-colors ${
                  ativo ? "bg-electric-lime" : "bg-off-white-canvas"
                }`}
              >
                <p className="text-subheading font-heading font-bold text-off-black-ink">
                  {m.label}
                </p>
                <p className="mt-1 text-body-sm text-off-black-ink/70">{m.descricao}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <p className="text-caption font-medium uppercase text-graphite">Logotipo</p>
        <label className="mt-3 flex cursor-pointer items-center justify-between rounded-3xl bg-off-white-canvas p-6">
          <span className="text-body-sm text-off-black-ink">
            {dados.logoNome ?? "Nenhum arquivo selecionado"}
          </span>
          <span className="rounded-full bg-pure-white px-4 py-2 text-body-sm font-medium text-off-black-ink">
            Escolher arquivo
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              setDados((d) => ({ ...d, logoNome: e.target.files?.[0]?.name ?? null }))
            }
          />
        </label>
      </div>

      <div className="mt-8">
        <p className="text-caption font-medium uppercase text-graphite">Paleta de cores</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {paleta.map((cor) => {
            const ativo = dados.paletaCores.includes(cor);
            return (
              <button
                key={cor}
                type="button"
                onClick={() => alternarCor(cor)}
                aria-label={cor}
                style={{ backgroundColor: cor }}
                className={`h-12 w-12 rounded-full transition-all ${
                  ativo ? "ring-2 ring-off-black-ink ring-offset-2" : ""
                }`}
              />
            );
          })}
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

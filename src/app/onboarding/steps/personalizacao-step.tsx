import { Button } from "@/components/ui/button";
import type { MercadoAlvo, StepProps } from "../types";

const mercados: { valor: MercadoAlvo; label: string; descricao: string }[] = [
  { valor: "brasil", label: "Brasil", descricao: "Idioma e pagamento nacionais." },
  { valor: "global", label: "Global", descricao: "Loja em inglês, pagamento internacional." },
  { valor: "latam", label: "Latam", descricao: "Espanhol, pagamento regional." },
];

const opcoesIdentidade: { valor: boolean; label: string }[] = [
  { valor: true, label: "Sim, já tenho" },
  { valor: false, label: "Não, preciso criar" },
];

export function PersonalizacaoStep({ dados, setDados, onContinuar, onVoltar }: StepProps) {
  function definirCor(indice: 0 | 1, cor: string) {
    setDados((d) => {
      const paleta = [...d.paletaCores];
      paleta[indice] = cor;
      return { ...d, paletaCores: paleta };
    });
  }

  const podeContinuar = Boolean(dados.mercadoAlvo) && dados.possuiIdentidadeVisual !== null;

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
        <p className="text-caption font-medium uppercase text-graphite">Identidade visual</p>
        <p className="mt-1 text-body-sm text-graphite">
          Você já tem logo, cores e fontes definidos pra sua marca?
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          {opcoesIdentidade.map((opcao) => {
            const ativo = dados.possuiIdentidadeVisual === opcao.valor;
            return (
              <button
                key={String(opcao.valor)}
                type="button"
                onClick={() => setDados((d) => ({ ...d, possuiIdentidadeVisual: opcao.valor }))}
                className={`rounded-3xl px-6 py-4 text-body-sm font-bold transition-colors ${
                  ativo ? "bg-electric-lime text-off-black-ink" : "bg-off-white-canvas text-off-black-ink"
                }`}
              >
                {opcao.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <p className="text-caption font-medium uppercase text-graphite">Paleta de cores</p>
        <p className="mt-1 text-body-sm text-graphite">Escolha as 2 cores principais da sua marca.</p>
        <div className="mt-3 flex gap-4">
          {[0, 1].map((indice) => (
            <label
              key={indice}
              className="relative h-14 w-14 cursor-pointer rounded-full ring-2 ring-ash ring-offset-2"
              style={{ backgroundColor: dados.paletaCores[indice] ?? "#ffffff" }}
            >
              <input
                type="color"
                value={dados.paletaCores[indice] ?? "#ffffff"}
                onChange={(e) => definirCor(indice as 0 | 1, e.target.value)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </label>
          ))}
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

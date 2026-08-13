// Tira de "confiado por" — mesma posição/fundo cinza da faixa de logos da perk.com.
// Sem clientes reais cadastrados ainda, então os marcadores ficam genéricos — trocar
// por logos reais assim que houver lojas entregues (PRD seção 9, Fase 1+).

const marcadores = ["LOJA 01", "LOJA 02", "LOJA 03", "LOJA 04", "LOJA 05"];

export function TrustedBy() {
  return (
    <section className="bg-ash px-6 py-10">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-8 md:flex-row md:justify-between">
        <p className="text-caption font-medium uppercase text-off-black-ink/70">
          [logos de clientes reais aqui]
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {marcadores.map((marca) => (
            <span
              key={marca}
              className="text-body-sm font-medium tracking-widest text-off-black-ink/50"
            >
              {marca}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

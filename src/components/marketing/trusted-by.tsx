// Tira de "confiado por" — mesma posição/fundo cinza da faixa de logos da perk.com.
// Sem clientes reais cadastrados ainda, então as marcas abaixo são fictícias (pedido
// explícito do usuário) — trocar por logos reais assim que houver lojas entregues.

const marcas = ["Nortex", "Velvra", "Órbita", "Kaimã Co.", "Ludus"];

export function TrustedBy() {
  return (
    <section className="bg-ash px-6 py-8 sm:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col items-center gap-8 md:flex-row md:justify-between">
        <p className="text-caption font-medium uppercase text-off-black-ink/70">
          Confiado por lojistas em todo o Brasil
        </p>
        <div className="flex flex-wrap items-center justify-center gap-10">
          {marcas.map((marca) => (
            <span
              key={marca}
              className="text-subheading font-medium tracking-tight text-off-black-ink/60"
            >
              {marca}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// Tira de "confiado por" — mesma posição/fundo cinza da faixa de logos da perk.com.
// Marcas fictícias (pedido explícito do usuário, nomes que ele mandou) — as imagens
// originais enviadas no chat não puderam ser salvas como arquivo (sem link/anexo
// acessível), então ficam como wordmark de texto pequeno por enquanto. Trocar pelos
// arquivos reais se o usuário enviar por link, ou por logos reais quando houver
// lojas entregues.

const marcas = ["VANASKI", "useSezo", "ZEVIME", "GRIVANY", "posthure", "Hauzzia", "CAZZARI"];

export function TrustedBy() {
  return (
    <section className="bg-ash px-6 py-3 sm:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col items-center gap-3 md:flex-row md:justify-between">
        <p className="text-eyebrow font-medium uppercase text-off-black-ink/70">
          Confiado por dropshippers em todo o Brasil
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {marcas.map((marca) => (
            <span
              key={marca}
              className="text-caption font-bold tracking-tight text-off-black-ink/50"
            >
              {marca}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

import { and, desc, eq, lte } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { produtosVencedores } from "@/lib/db/schema";

export default async function VencedorDaSemanaPage() {
  const hoje = new Date().toISOString().slice(0, 10);

  const [vencedor] = await getDb()
    .select()
    .from(produtosVencedores)
    .where(and(eq(produtosVencedores.publicado, true), lte(produtosVencedores.semanaInicio, hoje)))
    .orderBy(desc(produtosVencedores.semanaInicio))
    .limit(1);

  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">
        Produto Vencedor da Semana
      </span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
        {vencedor ? vencedor.nome : "Ainda sem curadoria essa semana"}
      </h1>

      {!vencedor && (
        <p className="mt-2 max-w-[480px] text-body-sm text-graphite">
          Toda semana a produção seleciona um produto em alta pra você considerar na sua loja. Volte
          em breve.
        </p>
      )}

      {vencedor && (
        <div className="mt-6 overflow-hidden rounded-3xl bg-pure-white">
          {vencedor.imagemUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- curadoria manual, URL externa arbitrária.
            <img
              src={vencedor.imagemUrl}
              alt={vencedor.nome}
              className="aspect-video w-full object-cover"
            />
          )}
          <div className="flex flex-col gap-4 p-6">
            {vencedor.nicho && (
              <span className="w-fit rounded-full bg-electric-lime px-3 py-1 text-caption font-bold text-off-black-ink">
                {vencedor.nicho}
              </span>
            )}
            <div>
              <p className="text-caption font-medium uppercase text-graphite">
                Por que está vendendo
              </p>
              <p className="mt-1 text-body-sm text-off-black-ink">{vencedor.porqueVence}</p>
            </div>
            {vencedor.linkFornecedor && (
              <a
                href={vencedor.linkFornecedor}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit text-body-sm font-medium text-off-black-ink underline"
              >
                Ver fornecedor
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const cobrancas = [{ metodo: "PIX", valor: "A definir", status: "Pago", quando: "12/08/2026" }];

export default function PagamentosPage() {
  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Pagamentos</span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
        Histórico de cobranças
      </h1>

      <div className="mt-8 overflow-hidden rounded-3xl bg-pure-white">
        {cobrancas.map((c, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-ash p-6 last:border-b-0"
          >
            <div>
              <p className="text-body-sm font-medium text-off-black-ink">{c.metodo}</p>
              <p className="text-caption text-graphite">{c.quando}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-body-sm text-off-black-ink">{c.valor}</span>
              <span className="rounded-full bg-electric-lime px-3 py-1 text-caption font-medium text-off-black-ink">
                {c.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

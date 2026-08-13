// Painel interno (admin / produção) — ver docs/PRD.md, seção 4.5.
// TODO (Fase 1): gatear por sessão (src/lib/auth.ts -> getSession(), papel
// "admin" ou "producao") via middleware assim que houver usuários reais no banco.

const modulos = [
  { titulo: "Esteira de projetos", descricao: "Kanban de todos os projetos em produção." },
  { titulo: "Planos", descricao: "CRUD de escopo e preço de Zen, Pro e Customizado." },
  { titulo: "Financeiro", descricao: "Cobranças geradas, status de pagamento, conciliação." },
  { titulo: "Parceiros", descricao: "Cadastro da vitrine de agências de tráfego pago." },
];

export default function AdminPage() {
  return (
    <main className="flex flex-1 flex-col bg-pure-white px-6 py-16">
      <div className="mx-auto w-full max-w-[1200px]">
        <span className="text-caption font-medium uppercase text-graphite">Painel interno</span>
        <h1 className="mt-3 text-heading font-heading font-medium text-off-black-ink">Stokys — Operação</h1>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {modulos.map((modulo) => (
            <div key={modulo.titulo} className="rounded-3xl bg-off-white-canvas p-8">
              <h2 className="text-subheading font-heading font-medium text-off-black-ink">{modulo.titulo}</h2>
              <p className="mt-2 text-body-sm text-graphite">{modulo.descricao}</p>
              <p className="mt-4 text-caption font-medium uppercase text-stone">Em construção</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

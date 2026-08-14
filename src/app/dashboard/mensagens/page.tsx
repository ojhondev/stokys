const mensagens = [
  {
    autor: "Produção Stokys",
    texto: "Banners aprovados, seguindo pro cadastro dos produtos restantes.",
    quando: "Hoje",
  },
  {
    autor: "Produção Stokys",
    texto: "Recebemos os acessos da plataforma, começando a implementação.",
    quando: "Ontem",
  },
];

export default function MensagensPage() {
  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Mensagens</span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
        Conversa com a produção
      </h1>

      <div className="mt-8 flex flex-col gap-4">
        {mensagens.map((m, i) => (
          <div key={i} className="rounded-3xl bg-pure-white p-6">
            <div className="flex items-center justify-between">
              <p className="text-caption font-medium uppercase text-graphite">{m.autor}</p>
              <p className="text-caption text-graphite">{m.quando}</p>
            </div>
            <p className="mt-2 text-body-sm text-off-black-ink">{m.texto}</p>
          </div>
        ))}
      </div>

      <form className="mt-6 flex items-center gap-3 rounded-full bg-pure-white p-2">
        <input
          type="text"
          placeholder="Escreva uma mensagem…"
          className="flex-1 bg-transparent px-4 py-2 text-body text-off-black-ink outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-electric-lime px-5 py-2.5 text-body-sm font-medium text-off-black-ink"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

const columns = [
  {
    title: "Produto",
    links: [
      { href: "#planos", label: "Planos" },
      { href: "#como-funciona", label: "Como funciona" },
      { href: "/onboarding", label: "Montar minha loja" },
    ],
  },
  {
    title: "Parceiros",
    links: [{ href: "/parceiros", label: "Agências de tráfego pago" }],
  },
  {
    title: "Stokys",
    links: [{ href: "/login", label: "Acessar minha conta" }],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-off-black-ink px-6 py-20">
      <div className="mx-auto grid w-full max-w-[1200px] gap-16 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <p className="text-heading font-medium text-off-white-canvas">Stokys</p>
          <p className="mt-4 max-w-[280px] text-body-sm text-ash">
            Sua loja de dropshipping, do onboarding à entrega — sem planilha, sem WhatsApp
            perdido.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <p className="text-caption font-medium uppercase text-ash">{column.title}</p>
            <ul className="mt-4 flex flex-col gap-3">
              {column.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-body-sm text-off-white-canvas">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 w-full max-w-[1200px] border-t border-white/10 pt-8">
        <p className="text-caption font-medium uppercase text-ash">[Fundada em — · cidade]</p>
      </div>
    </footer>
  );
}

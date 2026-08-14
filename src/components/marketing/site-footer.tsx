import Link from "next/link";

// Rodapé — mesma estrutura da perk.com (linha de ajuda + redes, grid de links,
// faixa com texto gigante em marquee), em lima cheio, conforme referência do
// usuário. Ícones/rótulos que não existem pra Stokys (app, idioma) foram
// removidos em vez de fingidos.

const redes = [
  { label: "Instagram", href: "#" },
  { label: "WhatsApp", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "TikTok", href: "#" },
];

const colunas = [
  {
    titulo: "Produto",
    links: [
      { href: "#planos", label: "Planos" },
      { href: "#como-funciona", label: "Como funciona" },
      { href: "/onboarding", label: "Montar minha loja" },
    ],
  },
  {
    titulo: "Parceiros",
    links: [{ href: "/parceiros", label: "Vitrine de parceiros" }],
  },
  {
    titulo: "Conta",
    links: [
      { href: "/login", label: "Entrar" },
      { href: "/dashboard", label: "Meu painel" },
    ],
  },
  {
    titulo: "Stokys",
    links: [{ href: "#", label: "Fale conosco" }],
  },
];

export function SiteFooter() {
  return (
    <footer className="overflow-hidden bg-electric-lime">
      <div className="px-6 pt-10 sm:px-10 lg:px-16">
        <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-6 border-b border-off-black-ink/15 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <p className="text-subheading font-heading font-bold leading-tight text-off-black-ink">
            Como podemos
            <br />
            ajudar?
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#" className="text-body-sm font-medium text-off-black-ink">
              Fale conosco
            </a>
            <a href="#" className="text-body-sm font-medium text-off-black-ink">
              Central de ajuda
            </a>
          </div>

          <div className="flex items-center gap-3">
            {redes.map((rede) => (
              <a
                key={rede.label}
                href={rede.href}
                aria-label={rede.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-off-black-ink text-caption font-medium text-electric-lime"
              >
                {rede.label[0]}
              </a>
            ))}
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-[1800px] gap-10 py-12 sm:grid-cols-4">
          {colunas.map((coluna) => (
            <div key={coluna.titulo}>
              <p className="text-caption font-medium uppercase text-off-black-ink/60">
                {coluna.titulo}
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {coluna.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-body-sm font-medium text-off-black-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex whitespace-nowrap py-6">
        <div className="flex shrink-0 animate-marquee items-center gap-12 pr-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="text-display font-heading font-bold leading-none text-off-black-ink"
            >
              Democratizando o dropshipping.
            </span>
          ))}
        </div>
        <div aria-hidden className="flex shrink-0 animate-marquee items-center gap-12 pr-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="text-display font-heading font-bold leading-none text-off-black-ink"
            >
              Democratizando o dropshipping.
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

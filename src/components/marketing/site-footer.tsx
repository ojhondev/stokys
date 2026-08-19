import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import { linkWhatsapp, MENSAGEM_WHATSAPP_GENERICA } from "@/lib/whatsapp";

// Rodapé — mesma estrutura da perk.com (linha de ajuda + redes, grid de links,
// faixa com texto gigante em marquee), em lima cheio, conforme referência do
// usuário. Ícones/rótulos que não existem pra Stokys (app, idioma) foram
// removidos em vez de fingidos.

function IconeInstagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function IconeYoutube() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="1" y="4" width="22" height="16" rx="5" stroke="currentColor" strokeWidth="2" />
      <path d="M10 8.5v7l6-3.5-6-3.5Z" fill="currentColor" />
    </svg>
  );
}

const redes: { label: string; href: string; Icon?: () => ReactElement }[] = [
  { label: "Instagram", href: "https://www.instagram.com/stokys.tech", Icon: IconeInstagram },
  { label: "YouTube", href: "https://www.youtube.com/@comunidadesemestoque", Icon: IconeYoutube },
  { label: "WhatsApp", href: "#" },
  { label: "LinkedIn", href: "#" },
];

const colunas = [
  {
    titulo: "Produto",
    links: [
      { href: "/#planos", label: "Planos" },
      { href: "/#como-funciona", label: "Como funciona" },
      { href: "/temas", label: "Temas" },
      { href: linkWhatsapp(MENSAGEM_WHATSAPP_GENERICA), label: "Criar loja", externo: true },
    ],
  },
  {
    titulo: "Parceiros",
    links: [
      { href: "/parcerias", label: "Parceria com influenciadores" },
      { href: "/parceiros", label: "Vitrine de parceiros" },
    ],
  },
  {
    titulo: "Conta",
    links: [
      {
        href: linkWhatsapp("Olá! Preciso acessar minha conta Stokys."),
        label: "Entrar",
        externo: true,
      },
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
        <div className="mx-auto w-full max-w-[1800px]">
          <Image src="/logo-stokys.png" alt="Stokys" width={125} height={28} className="h-7 w-auto" />
        </div>

        <div className="mx-auto mt-8 flex w-full max-w-[1800px] flex-col gap-6 border-b border-off-black-ink/15 pb-8 sm:flex-row sm:items-start sm:justify-between">
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
                {...(rede.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-off-black-ink text-caption font-medium text-electric-lime"
              >
                {rede.Icon ? <rede.Icon /> : rede.label[0]}
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
                    <Link
                      href={link.href}
                      className="text-body-sm font-medium text-off-black-ink"
                      {...("externo" in link && link.externo
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
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

import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

const base = "inline-flex items-center justify-center text-body font-bold transition-opacity";

const variants = {
  // Único botão preenchido do sistema — ver docs/DESIGN.md, "Primary Action Button".
  primary: `${base} rounded-3xl bg-electric-lime pt-4 pb-4 pl-4 pr-3 text-off-black-ink hover:opacity-90`,
  ghost: `${base} rounded-full text-off-black-ink hover:opacity-70`,
  outline: `${base} rounded-full border border-off-black-ink pt-4 pb-4 pl-4 pr-3 text-off-black-ink hover:opacity-70`,
  dark: `${base} rounded-3xl bg-off-black-ink pt-4 pb-4 pl-4 pr-3 text-electric-lime hover:opacity-90`,
  // Igual a "outline", mas em branco — pra usar sobre fundo escuro (ver depoimentos.tsx).
  "outline-light": `${base} rounded-full border border-pure-white pt-4 pb-4 pl-4 pr-3 text-pure-white hover:opacity-70`,
  // Pílula branca preenchida — pra usar sobre fundos coloridos/degradês (ver faixa-youtube.tsx).
  white: `${base} rounded-3xl bg-pure-white pt-4 pb-4 pl-4 pr-3 text-off-black-ink hover:opacity-90`,
} as const;

type Variant = keyof typeof variants;

function cx(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

type ButtonAsLink = { href: string; variant?: Variant } & Omit<
  ComponentPropsWithoutRef<typeof Link>,
  "href"
>;

export function LinkButton({ href, variant = "primary", className, ...props }: ButtonAsLink) {
  return <Link href={href} className={cx(variants[variant], className)} {...props} />;
}

type ButtonAsButton = { variant?: Variant } & ComponentPropsWithoutRef<"button">;

export function Button({ variant = "primary", className, ...props }: ButtonAsButton) {
  return <button className={cx(variants[variant], className)} {...props} />;
}

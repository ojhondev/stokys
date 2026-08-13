# Stokys — Plataforma de Captação e Execução de Projetos de Loja

Plataforma da agência Stokys: landing page + dashboard do cliente, com onboarding
(configurador de projeto de loja de dropshipping), cobrança dentro da própria
plataforma (PIX, cartão de crédito, boleto), acompanhamento de produção, mensageria
interna e diretório de parceiros de tráfego pago.

- Visão de produto e arquitetura: [docs/PRD.md](docs/PRD.md)
- Design system (base): [docs/DESIGN.md](docs/DESIGN.md) — inspirado no [Perk](https://www.perk.com/)

## Stack

Next.js (App Router) + TypeScript + Tailwind v4 + Neon (Postgres) + Drizzle ORM.

## Rodando localmente

```bash
npm install
npm run dev
```

Copie `.env.local.example` para `.env.local` e preencha as variáveis antes de conectar
a um banco Neon real — sem isso, as páginas estáticas (LP, onboarding) funcionam
normalmente, mas nada que dependa de `src/lib/db` funciona ainda.

## Status

Fase 0 (fundação) em andamento: schema do banco, esqueleto de autenticação por sessão
própria, LP e onboarding (seleção de plano) já navegáveis. Painel admin, dashboard do
cliente, pagamento via Asaas e mensageria ainda são placeholders — ver
[docs/PRD.md](docs/PRD.md), seção 9 (Roadmap).

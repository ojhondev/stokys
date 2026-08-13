# Stokys — Plataforma de Captação e Execução de Projetos de Loja

Plataforma da agência Stokys: landing page + dashboard do cliente, com onboarding
(configurador de projeto de loja de dropshipping), cobrança dentro da própria
plataforma (PIX, cartão de crédito, boleto), acompanhamento de produção, mensageria
interna e diretório de parceiros de tráfego pago.

- Produção: https://stokys.vercel.app
- Visão de produto e arquitetura: [docs/PRD.md](docs/PRD.md)
- Design system (base): [docs/DESIGN.md](docs/DESIGN.md) — inspirado no [Perk](https://www.perk.com/)

## Stack

Next.js (App Router) + TypeScript + Tailwind v4 + Neon (Postgres) + Drizzle ORM +
Vercel. Banco provisionado via integração Neon do Vercel Marketplace (projeto
`neon-pink-zebra`, exclusivo deste app).

## Rodando localmente

```bash
npm install
npm run dev
```

`.env.local` já vem preenchido neste ambiente (Neon + segredos gerados). Em uma máquina
nova, copie `.env.local.example` para `.env.local` e preencha as variáveis — sem isso,
as páginas estáticas (LP, onboarding) funcionam normalmente, mas nada que dependa de
`src/lib/db` funciona.

## Deploy

Deploy é manual por enquanto: `vercel deploy --prod` a partir desta pasta. O app do
GitHub da Vercel ainda não está autorizado para o repositório `ojhondev/stokys`
(`vercel git connect` falha até isso ser aprovado no GitHub) — depois de autorizado,
todo push em `main` passa a fazer deploy automático.

## Status

Fase 0 (fundação) em andamento: schema do banco, esqueleto de autenticação por sessão
própria, LP e onboarding (seleção de plano) já navegáveis. Painel admin, dashboard do
cliente, pagamento via Asaas e mensageria ainda são placeholders — ver
[docs/PRD.md](docs/PRD.md), seção 9 (Roadmap).

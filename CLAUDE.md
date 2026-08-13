# Stokys

Adote a metodologia padrão de `C:\Users\55149\dev.md` para este projeto (pipeline,
stack padrão, convenções). Ajustar a stack específica conforme o PRD, mas manter a
ordem das etapas e as convenções, a menos que o usuário diga o contrário.

- Visão de produto: [docs/PRD.md](docs/PRD.md)
- Design system: [docs/DESIGN.md](docs/DESIGN.md) — seguir exatamente estes tokens
  (cores, tipografia, raios, espaçamento) na LP e no dashboard. Não introduzir uma
  segunda cor de destaque além do lima `#beff50`, nem sombras em cards.

## Git: commit e push automáticos

Toda alteração de código feita neste projeto (nesta ou em sessões futuras) deve ser
commitada e enviada para o GitHub (`origin/main`, https://github.com/ojhondev/stokys)
automaticamente, sem esperar autorização explícita a cada vez — isso já foi autorizado
pelo usuário em 2026-08-13.

Fluxo padrão ao concluir uma tarefa que altere código:
1. Rodar typecheck/build normalmente (`npm run build`, `npm run lint`).
2. `git add -A`
3. `git commit -m "<mensagem descrevendo a mudança>"`
4. `git push origin main`

## Infra

- Vercel: projeto `stokys` (time `jhonatan-ribeiros-projects-308743bf`), produção em
  https://stokys.vercel.app. **`git push` ainda NÃO faz deploy automático** — o GitHub
  App da Vercel não está autorizado para `ojhondev/stokys` ainda (só o usuário resolve
  isso, é uma tela de permissão no GitHub). Até lá, rodar `vercel deploy --prod` manualmente
  depois do push quando quiser atualizar o site no ar.
- Banco: Neon, projeto `neon-pink-zebra`, provisionado via integração do Vercel
  Marketplace (não dá pra usar `neonctl projects create` direto — o time é
  Neon-org-managed pela Vercel). `DATABASE_URL` e variáveis relacionadas já estão nos
  3 ambientes do projeto Vercel (`vercel env ls`) e em `.env.local` local.
- Servidor de dev roda na porta 3002 (ver entrada `"stokys"` em
  `A:\Velo\.claude\launch.json` — o Claude Code lê launch configs da pasta raiz do
  harness, não da pasta de cada projeto).

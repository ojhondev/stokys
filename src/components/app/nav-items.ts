// Navegação do app do cliente — ver docs/PRD.md, seção 4.4, e o plano de
// Fase 2 (módulos Briefing/Timeline/Tarefas/Solicitações/Revisões/Histórico
// somados ao escopo original). "Informações da loja" não é item de nav — foi
// fundido em Configurações (ver dashboard/configuracoes/page.tsx).
export const clienteNavItems = [
  { href: "/dashboard", label: "Visão geral", icone: "visaoGeral" },
  { href: "/dashboard/briefing", label: "Briefing", icone: "briefing" },
  { href: "/dashboard/timeline", label: "Timeline", icone: "timeline" },
  { href: "/dashboard/tarefas", label: "Tarefas", icone: "tarefas" },
  { href: "/dashboard/solicitacoes", label: "Solicitações", icone: "solicitacoes" },
  { href: "/dashboard/revisoes", label: "Revisões", icone: "revisoes" },
  { href: "/dashboard/pagamentos", label: "Pagamentos", icone: "pagamentos" },
  { href: "/dashboard/comunidade", label: "Comunidade", icone: "comunidade" },
  { href: "/dashboard/parceiros", label: "Tráfego Pago", icone: "parceiros" },
  { href: "/dashboard/historico", label: "Histórico", icone: "historico" },
  { href: "/dashboard/configuracoes", label: "Configurações", icone: "configuracoes" },
] as const;

// Com 11 itens, a barra de abas do mobile não cabe a lista inteira (ver
// app-shell.tsx) — mostra só os mais usados no dia a dia + um botão "Menu"
// que abre a lista completa num drawer.
export const clienteNavMobilePrimario = [
  "/dashboard",
  "/dashboard/timeline",
  "/dashboard/tarefas",
  "/dashboard/solicitacoes",
] as const;

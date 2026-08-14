// Navegação do app do cliente — ver docs/PRD.md, seção 4.4 (Dashboard do cliente).
export const clienteNavItems = [
  { href: "/dashboard", label: "Visão geral", icone: "visaoGeral" },
  { href: "/dashboard/preview", label: "Preview", icone: "preview" },
  { href: "/dashboard/mensagens", label: "Mensagens", icone: "mensagens" },
  { href: "/dashboard/pagamentos", label: "Pagamentos", icone: "pagamentos" },
  { href: "/dashboard/configuracoes", label: "Configurações", icone: "configuracoes" },
  { href: "/dashboard/perfil", label: "Perfil", icone: "perfil" },
] as const;

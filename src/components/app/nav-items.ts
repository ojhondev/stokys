// Navegação do app do cliente — ver docs/PRD.md, seção 4.4 e o plano V1
// (módulos de Produto Vencedor, Comunidade e Tráfego Pago somados ao escopo
// original de pagamento/mensagens/acessos de plataforma).
export const clienteNavItems = [
  { href: "/dashboard/pagamentos", label: "Pagamentos", icone: "pagamentos" },
  { href: "/dashboard/vencedor-da-semana", label: "Vencedor da Semana", icone: "vencedor" },
  { href: "/dashboard/comunidade", label: "Comunidade", icone: "comunidade" },
  { href: "/dashboard/parceiros", label: "Tráfego Pago", icone: "parceiros" },
  { href: "/dashboard/mensagens", label: "Mensagens", icone: "mensagens" },
  { href: "/dashboard/configuracoes", label: "Configurações", icone: "configuracoes" },
] as const;

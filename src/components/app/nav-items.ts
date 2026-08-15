// Navegação do app do cliente — ver docs/PRD.md, seção 4.4. Escopo reduzido de
// propósito (pedido do usuário): o cliente só interage com pagamento,
// mensagens com a equipe e os acessos de plataforma (input pra produção
// rodar). Preview e Perfil saem daqui até uma fase futura precisar deles.
export const clienteNavItems = [
  { href: "/dashboard/pagamentos", label: "Pagamentos", icone: "pagamentos" },
  { href: "/dashboard/mensagens", label: "Mensagens", icone: "mensagens" },
  { href: "/dashboard/configuracoes", label: "Configurações", icone: "configuracoes" },
] as const;

import type { statusProjetoEnum } from "@/lib/db/schema";

export type StatusProjeto = (typeof statusProjetoEnum.enumValues)[number];

// Ordem oficial das etapas — usado pelo stepper de Visão geral e pela
// trilha do módulo Timeline. Mesma lista que já existia solta em
// dashboard/page.tsx (fonte única agora, pra Timeline não divergir).
export const etapasProjeto: { chave: StatusProjeto; label: string }[] = [
  { chave: "onboarding", label: "Onboarding" },
  { chave: "aguardando_pagamento", label: "Pagamento" },
  { chave: "em_producao", label: "Produção" },
  { chave: "preview_disponivel", label: "Preview" },
  { chave: "entregue", label: "Entregue" },
];

export const labelStatusProjeto: Record<StatusProjeto, string> = {
  onboarding: "Onboarding",
  aguardando_pagamento: "Aguardando pagamento",
  em_producao: "Em produção",
  preview_disponivel: "Preview disponível",
  entregue: "Entregue",
};

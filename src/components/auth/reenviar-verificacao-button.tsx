"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { reenviarVerificacao, type VerificacaoState } from "@/lib/actions/verificacao";

const estadoInicial: VerificacaoState = {};

export function ReenviarVerificacaoButton({
  className = "mt-6 flex flex-col items-center gap-3",
}: {
  className?: string;
}) {
  const [estado, formAction, pendente] = useActionState(
    async (_prevState: VerificacaoState) => reenviarVerificacao(),
    estadoInicial,
  );

  return (
    <form action={formAction} className={className}>
      <Button type="submit" variant="outline" disabled={pendente}>
        {pendente ? "Enviando…" : "Reenviar e-mail"}
      </Button>
      {estado.enviado && (
        <p className="text-body-sm font-medium text-off-black-ink">E-mail reenviado.</p>
      )}
      {estado.erro && <p className="text-body-sm font-medium text-off-black-ink">{estado.erro}</p>}
    </form>
  );
}

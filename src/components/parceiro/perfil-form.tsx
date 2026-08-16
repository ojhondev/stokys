"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { atualizarPerfilParceiro, type PerfilParceiroState } from "@/lib/actions/parceiro";

const estadoInicial: PerfilParceiroState = {};

export function PerfilParceiroForm({
  parceiro,
}: {
  parceiro: { nome: string; especialidade: string; descricao: string | null; linkWhatsapp: string };
}) {
  const [estado, formAction, pendente] = useActionState(atualizarPerfilParceiro, estadoInicial);

  return (
    <form action={formAction} className="mt-4 flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="text-caption font-medium uppercase text-graphite">Nome / agência</span>
        <input
          type="text"
          name="nome"
          defaultValue={parceiro.nome}
          required
          className="rounded-lg border border-ash bg-pure-white px-4 py-3 text-body text-off-black-ink"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-caption font-medium uppercase text-graphite">Especialidade</span>
        <input
          type="text"
          name="especialidade"
          defaultValue={parceiro.especialidade}
          placeholder="Ex.: Tráfego pago para dropshipping"
          required
          className="rounded-lg border border-ash bg-pure-white px-4 py-3 text-body text-off-black-ink"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-caption font-medium uppercase text-graphite">Descrição</span>
        <textarea
          name="descricao"
          defaultValue={parceiro.descricao ?? ""}
          rows={4}
          className="rounded-lg border border-ash bg-pure-white px-4 py-3 text-body text-off-black-ink"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-caption font-medium uppercase text-graphite">Link do WhatsApp</span>
        <input
          type="text"
          name="linkWhatsapp"
          defaultValue={parceiro.linkWhatsapp}
          placeholder="https://wa.me/55..."
          required
          className="rounded-lg border border-ash bg-pure-white px-4 py-3 text-body text-off-black-ink"
        />
      </label>

      {estado.erro && <p className="text-body-sm font-medium text-off-black-ink">{estado.erro}</p>}
      {estado.salvo && (
        <p className="text-body-sm font-medium text-off-black-ink">Perfil atualizado.</p>
      )}

      <Button type="submit" disabled={pendente} className="mt-2 w-full sm:w-auto">
        {pendente ? "Salvando…" : "Salvar perfil"}
      </Button>
    </form>
  );
}

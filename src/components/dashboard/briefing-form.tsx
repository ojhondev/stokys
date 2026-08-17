"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { atualizarBriefing } from "@/lib/actions/briefing";

export function BriefingForm({
  identidadeDriveUrl,
  publico,
  posicionamento,
}: {
  identidadeDriveUrl: string;
  publico: string;
  posicionamento: string;
}) {
  const router = useRouter();
  const [drive, setDrive] = useState(identidadeDriveUrl);
  const [pub, setPub] = useState(publico);
  const [posicao, setPosicao] = useState(posicionamento);
  const [erro, setErro] = useState<string | null>(null);
  const [salvo, setSalvo] = useState(false);
  const [pendente, iniciarTransicao] = useTransition();

  function salvar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setSalvo(false);
    iniciarTransicao(async () => {
      const resultado = await atualizarBriefing({
        identidadeDriveUrl: drive,
        publico: pub,
        posicionamento: posicao,
      });
      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }
      setSalvo(true);
      router.refresh();
    });
  }

  return (
    <form onSubmit={salvar} className="mt-4 flex flex-col gap-4 rounded-3xl bg-pure-white p-6">
      <label className="flex flex-col gap-2">
        <span className="text-body-sm font-medium text-off-black-ink">
          Identidade da marca — link do Google Drive
        </span>
        <p className="text-caption text-graphite">
          Deixe logotipo, paleta de cores e qualquer material de marca numa pasta do Google Drive
          e cole o link de compartilhamento aqui.
        </p>
        <input
          type="url"
          value={drive}
          onChange={(e) => setDrive(e.target.value)}
          placeholder="https://drive.google.com/..."
          className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-body-sm font-medium text-off-black-ink">Público</span>
        <textarea
          value={pub}
          onChange={(e) => setPub(e.target.value)}
          rows={3}
          placeholder="Quem compra de você? Idade, interesses, onde estão..."
          className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-body-sm font-medium text-off-black-ink">Posicionamento</span>
        <textarea
          value={posicao}
          onChange={(e) => setPosicao(e.target.value)}
          rows={3}
          placeholder="Como você quer ser percebido no mercado? O que te diferencia?"
          className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
        />
      </label>

      {erro && <p className="text-body-sm font-medium text-off-black-ink">{erro}</p>}

      <button
        type="submit"
        disabled={pendente}
        className="mt-2 w-fit rounded-3xl bg-electric-lime pt-4 pb-4 pl-4 pr-3 text-body font-bold text-off-black-ink disabled:opacity-60"
      >
        {pendente ? "Salvando…" : "Salvar briefing"}
      </button>

      {salvo && <p className="text-body-sm font-medium text-off-black-ink">Briefing salvo.</p>}
    </form>
  );
}

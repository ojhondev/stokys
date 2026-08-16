"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { criarVencedor } from "@/lib/actions/vencedor-da-semana";

export function CriarVencedorForm() {
  const router = useRouter();
  const [semanaInicio, setSemanaInicio] = useState("");
  const [nome, setNome] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [nicho, setNicho] = useState("");
  const [porqueVence, setPorqueVence] = useState("");
  const [linkFornecedor, setLinkFornecedor] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();

  function criar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await criarVencedor({
        semanaInicio,
        nome,
        imagemUrl,
        nicho,
        porqueVence,
        linkFornecedor,
      });
      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }
      setSemanaInicio("");
      setNome("");
      setImagemUrl("");
      setNicho("");
      setPorqueVence("");
      setLinkFornecedor("");
      router.refresh();
    });
  }

  return (
    <form onSubmit={criar} className="mt-6 flex flex-col gap-4 rounded-3xl bg-pure-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-body-sm font-medium text-off-black-ink">Início da semana</span>
          <input
            type="date"
            value={semanaInicio}
            onChange={(e) => setSemanaInicio(e.target.value)}
            className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-body-sm font-medium text-off-black-ink">Nome do produto</span>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-body-sm font-medium text-off-black-ink">Nicho</span>
          <input
            type="text"
            value={nicho}
            onChange={(e) => setNicho(e.target.value)}
            className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-body-sm font-medium text-off-black-ink">URL da imagem</span>
          <input
            type="text"
            value={imagemUrl}
            onChange={(e) => setImagemUrl(e.target.value)}
            className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
          />
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <span className="text-body-sm font-medium text-off-black-ink">Por que está vendendo</span>
        <textarea
          value={porqueVence}
          onChange={(e) => setPorqueVence(e.target.value)}
          rows={3}
          className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-body-sm font-medium text-off-black-ink">Link do fornecedor</span>
        <input
          type="text"
          value={linkFornecedor}
          onChange={(e) => setLinkFornecedor(e.target.value)}
          className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
        />
      </label>

      {erro && <p className="text-body-sm font-medium text-off-black-ink">{erro}</p>}

      <Button type="submit" disabled={pendente} className="w-fit">
        {pendente ? "Criando…" : "Criar"}
      </Button>
    </form>
  );
}

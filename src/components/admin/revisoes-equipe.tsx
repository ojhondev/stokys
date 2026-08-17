"use client";

import { useRef, useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { criarRevisao } from "@/lib/actions/revisoes";
import { uploadArquivoRevisao } from "@/lib/actions/upload";
import { RevisaoCard } from "@/components/dashboard/revisao-card";

type Comentario = { id: string; texto: string; autorNome: string; criadoEm: Date };
type Revisao = {
  id: string;
  titulo: string;
  linkOuArquivoUrl: string;
  status: "pendente" | "aprovado" | "mudancas_solicitadas";
  criadoEm: Date;
  comentarios: Comentario[];
};

export function RevisoesEquipe({ projetoId, revisoes }: { projetoId: string; revisoes: Revisao[] }) {
  const router = useRouter();
  const inputArquivoRef = useRef<HTMLInputElement>(null);
  const [titulo, setTitulo] = useState("");
  const [link, setLink] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();

  function selecionarArquivo(e: ChangeEvent<HTMLInputElement>) {
    setArquivo(e.target.files?.[0] ?? null);
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    iniciarTransicao(async () => {
      let url = link.trim();

      if (arquivo) {
        const resultadoUpload = await uploadArquivoRevisao(arquivo);
        if (resultadoUpload.erro) {
          setErro(resultadoUpload.erro);
          return;
        }
        url = resultadoUpload.url!;
      }

      const resultado = await criarRevisao(projetoId, titulo, url);
      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }
      setTitulo("");
      setLink("");
      setArquivo(null);
      if (inputArquivoRef.current) inputArquivoRef.current.value = "";
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-pure-white p-6">
      <p className="text-caption font-medium uppercase text-graphite">Revisões</p>

      <div className="flex flex-col gap-4">
        {revisoes.length === 0 && <p className="text-body-sm text-graphite">Nenhuma versão enviada ainda.</p>}
        {revisoes.map((r) => (
          <RevisaoCard
            key={r.id}
            revisaoId={r.id}
            titulo={r.titulo}
            linkOuArquivoUrl={r.linkOuArquivoUrl}
            status={r.status}
            criadoEm={r.criadoEm}
            comentarios={r.comentarios}
            podeAprovar={false}
          />
        ))}
      </div>

      <form onSubmit={enviar} className="flex flex-col gap-3 border-t border-ash pt-4">
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título da versão (ex.: Preview v1)"
          className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
        />
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Link (ou envie um arquivo abaixo)"
          disabled={!!arquivo}
          className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink disabled:opacity-60"
        />
        <input
          ref={inputArquivoRef}
          type="file"
          onChange={selecionarArquivo}
          accept="image/png,image/jpeg,image/webp,image/gif,application/pdf,.doc,.docx"
          className="text-body-sm text-graphite"
        />
        {erro && <p className="text-body-sm font-medium text-off-black-ink">{erro}</p>}
        <button
          type="submit"
          disabled={pendente}
          className="w-fit rounded-3xl bg-electric-lime pt-4 pb-4 pl-4 pr-3 text-body font-bold text-off-black-ink disabled:opacity-60"
        >
          {pendente ? "Enviando…" : "Enviar versão"}
        </button>
      </form>
    </div>
  );
}

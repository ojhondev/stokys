"use client";

import { useRef, useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { enviarMensagem } from "@/lib/actions/mensagens";
import { uploadAnexoMensagem } from "@/lib/actions/upload";

export function MensagemForm({ projetoIdParaEquipe }: { projetoIdParaEquipe?: string }) {
  const router = useRouter();
  const inputArquivoRef = useRef<HTMLInputElement>(null);
  const [texto, setTexto] = useState("");
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
      let anexoUrl: string | undefined;

      if (arquivo) {
        const resultadoUpload = await uploadAnexoMensagem(arquivo);
        if (resultadoUpload.erro) {
          setErro(resultadoUpload.erro);
          return;
        }
        anexoUrl = resultadoUpload.url;
      }

      const resultado = await enviarMensagem(texto, projetoIdParaEquipe, anexoUrl);
      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }
      setTexto("");
      setArquivo(null);
      if (inputArquivoRef.current) inputArquivoRef.current.value = "";
      router.refresh();
    });
  }

  return (
    <div>
      <form onSubmit={enviar} className="mt-6 flex flex-col gap-2">
        {arquivo && (
          <p className="px-2 text-caption text-graphite">
            Anexo: {arquivo.name}{" "}
            <button
              type="button"
              onClick={() => {
                setArquivo(null);
                if (inputArquivoRef.current) inputArquivoRef.current.value = "";
              }}
              className="font-medium text-off-black-ink underline"
            >
              remover
            </button>
          </p>
        )}
        <div className="flex items-center gap-3 rounded-full bg-pure-white p-2">
          <label className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-graphite hover:bg-off-white-canvas">
            <input
              ref={inputArquivoRef}
              type="file"
              onChange={selecionarArquivo}
              accept="image/png,image/jpeg,image/webp,image/gif,application/pdf,.doc,.docx"
              className="hidden"
            />
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M8 12.5V8a4 4 0 0 1 8 0v6a2.5 2.5 0 0 1-5 0V9"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </label>
          <input
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escreva uma mensagem…"
            className="flex-1 bg-transparent px-2 py-2 text-body text-off-black-ink outline-none"
          />
          <button
            type="submit"
            disabled={pendente}
            className="rounded-full bg-electric-lime px-5 py-2.5 text-body-sm font-medium text-off-black-ink disabled:opacity-60"
          >
            {pendente ? "Enviando…" : "Enviar"}
          </button>
        </div>
      </form>
      {erro && <p className="mt-2 text-body-sm font-medium text-off-black-ink">{erro}</p>}
    </div>
  );
}

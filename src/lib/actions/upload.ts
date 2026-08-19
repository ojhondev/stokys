"use server";

import { getSession, type Papel } from "@/lib/auth";
import { uploadArquivo } from "@/lib/storage/blob";

const TIPOS_PERMITIDOS = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const TAMANHO_MAXIMO_BYTES = 10 * 1024 * 1024; // 10MB

export type UploadState = { url?: string; erro?: string };

const PAPEIS_EQUIPE: Papel[] = ["master", "admin", "producao"];

export async function uploadArquivoRevisao(arquivo: File): Promise<UploadState> {
  const sessao = await getSession();
  if (!sessao || !PAPEIS_EQUIPE.includes(sessao.papel)) {
    return { erro: "Sessão inválida." };
  }

  if (arquivo.size === 0) return { erro: "Arquivo vazio." };
  if (arquivo.size > TAMANHO_MAXIMO_BYTES) return { erro: "Arquivo maior que 10MB." };
  if (!TIPOS_PERMITIDOS.includes(arquivo.type)) {
    return { erro: "Tipo de arquivo não aceito — envie imagem, PDF ou documento." };
  }

  const { url } = await uploadArquivo(arquivo, "revisoes");
  return { url };
}

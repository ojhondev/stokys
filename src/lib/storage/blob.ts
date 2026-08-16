import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";

// Seam isolado do provedor de armazenamento (Vercel Blob) — mesmo padrão de
// lib/email/enviar.ts e lib/payments/asaas.ts. Sem BLOB_READ_WRITE_TOKEN no
// ambiente, salva em public/uploads (dev local) em vez de chamar a API.
// Trocar isso por Blob de verdade é a única mudança necessária.

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

function nomeArquivoSeguro(nomeOriginal: string): string {
  const ext = path.extname(nomeOriginal).slice(0, 10);
  return `${randomBytes(16).toString("hex")}${ext}`;
}

export async function uploadArquivo(
  arquivo: File,
  pastaPrefixo: string,
): Promise<{ url: string }> {
  const nomeArquivo = nomeArquivoSeguro(arquivo.name);
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    const pasta = path.join(UPLOADS_DIR, pastaPrefixo);
    await mkdir(pasta, { recursive: true });
    const buffer = Buffer.from(await arquivo.arrayBuffer());
    await writeFile(path.join(pasta, nomeArquivo), buffer);
    console.log(`[upload mock] salvo em public/uploads/${pastaPrefixo}/${nomeArquivo}`);
    return { url: `/uploads/${pastaPrefixo}/${nomeArquivo}` };
  }

  const resultado = await put(`${pastaPrefixo}/${nomeArquivo}`, arquivo, { access: "public", token });
  return { url: resultado.url };
}

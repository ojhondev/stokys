import "server-only";
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";

// Criptografa os acessos de plataforma (Shopify/Nuvemshop) coletados no
// onboarding antes de gravar em `acessos_plataforma.segredo_criptografado`.
// Ver docs/PRD.md, seção 4.2.1 e seção 8 (Segurança) — nunca texto puro em repouso.

function deriveKey(): Buffer {
  const secret = process.env.CREDENTIALS_ENCRYPTION_KEY;
  if (!secret) {
    throw new Error(
      "CREDENTIALS_ENCRYPTION_KEY não definida — copie .env.local.example para .env.local",
    );
  }
  return scryptSync(secret, "stokys-acessos-plataforma", 32);
}

export function encryptSecret(plaintext: string): string {
  const key = deriveKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv, authTag, encrypted].map((buf) => buf.toString("base64")).join(".");
}

export function decryptSecret(stored: string): string {
  const [ivB64, authTagB64, encryptedB64] = stored.split(".");
  if (!ivB64 || !authTagB64 || !encryptedB64) {
    throw new Error("Formato inválido de segredo criptografado");
  }
  const key = deriveKey();
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(authTagB64, "base64"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedB64, "base64")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

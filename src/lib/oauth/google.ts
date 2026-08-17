import "server-only";
import { randomBytes, createHash } from "node:crypto";

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

export const GOOGLE_STATE_COOKIE = "stokys_google_oauth";
export const GOOGLE_STATE_TTL_SECONDS = 10 * 60; // 10 minutos

export type GoogleOAuthState = {
  state: string;
  verifier: string;
  tipo: "cliente" | "parceiro";
  next: string;
  exp: number; // epoch seconds
};

// As credenciais só existem depois que alguém cria um app OAuth de verdade
// no Google Cloud Console (passo manual, só o usuário pode fazer — ver
// .env.local.example). Sem isso, o botão precisa avisar em vez de quebrar.
export function googleOAuthConfigurado(): boolean {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

function requireEnv(nome: string): string {
  const valor = process.env[nome];
  if (!valor) {
    throw new Error(`${nome} não definida — copie .env.local.example para .env.local`);
  }
  return valor;
}

function base64url(input: Buffer): string {
  return input.toString("base64url");
}

async function hmacAssinatura(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(requireEnv("SESSION_SECRET")),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return base64url(Buffer.from(signature));
}

// Cookie httpOnly de curta duração — carrega state/PKCE/escolha
// cliente-ou-parceiro assinados, pra sobreviver o round-trip até o Google
// sem depender de sessão ou banco (ver plano V1, "Cuidados obrigatórios").
export async function assinarEstadoOAuth(payload: GoogleOAuthState): Promise<string> {
  const body = base64url(Buffer.from(JSON.stringify(payload)));
  const signature = await hmacAssinatura(body);
  return `${body}.${signature}`;
}

export async function verificarEstadoOAuth(token: string): Promise<GoogleOAuthState | null> {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const esperado = await hmacAssinatura(body);
  if (esperado !== signature) return null;

  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as GoogleOAuthState;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

export function gerarPkce(): { verifier: string; challenge: string } {
  const verifier = base64url(randomBytes(32));
  const challenge = base64url(createHash("sha256").update(verifier).digest());
  return { verifier, challenge };
}

export function gerarState(): string {
  return base64url(randomBytes(16));
}

export function montarUrlAutorizacao(state: string, codeChallenge: string): string {
  const params = new URLSearchParams({
    client_id: requireEnv("GOOGLE_CLIENT_ID"),
    redirect_uri: requireEnv("GOOGLE_REDIRECT_URI"),
    response_type: "code",
    scope: "openid email profile",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  });
  return `${AUTH_URL}?${params.toString()}`;
}

export type GoogleUserInfo = {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture?: string;
};

export async function trocarCodigoPorUsuario(
  code: string,
  codeVerifier: string,
): Promise<GoogleUserInfo> {
  const tokenResposta = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: requireEnv("GOOGLE_CLIENT_ID"),
      client_secret: requireEnv("GOOGLE_CLIENT_SECRET"),
      redirect_uri: requireEnv("GOOGLE_REDIRECT_URI"),
      grant_type: "authorization_code",
      code,
      code_verifier: codeVerifier,
    }),
  });
  if (!tokenResposta.ok) {
    throw new Error(`Falha ao trocar código do Google: ${await tokenResposta.text()}`);
  }
  const { access_token: accessToken } = (await tokenResposta.json()) as { access_token: string };

  const userinfoResposta = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!userinfoResposta.ok) {
    throw new Error(`Falha ao buscar perfil do Google: ${await userinfoResposta.text()}`);
  }
  return (await userinfoResposta.json()) as GoogleUserInfo;
}

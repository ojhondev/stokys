import { NextResponse, type NextRequest } from "next/server";
import {
  GOOGLE_STATE_COOKIE,
  GOOGLE_STATE_TTL_SECONDS,
  assinarEstadoOAuth,
  gerarPkce,
  gerarState,
  montarUrlAutorizacao,
} from "@/lib/oauth/google";

export async function GET(request: NextRequest) {
  const tipoParam = request.nextUrl.searchParams.get("tipo");
  const tipo = tipoParam === "parceiro" ? "parceiro" : "cliente";
  const nextParam = request.nextUrl.searchParams.get("next") ?? "";
  const next = nextParam.startsWith("/") ? nextParam : "";

  const state = gerarState();
  const { verifier, challenge } = gerarPkce();
  const exp = Math.floor(Date.now() / 1000) + GOOGLE_STATE_TTL_SECONDS;

  const cookieValor = await assinarEstadoOAuth({ state, verifier, tipo, next, exp });

  const resposta = NextResponse.redirect(montarUrlAutorizacao(state, challenge));
  resposta.cookies.set(GOOGLE_STATE_COOKIE, cookieValor, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: GOOGLE_STATE_TTL_SECONDS,
  });
  return resposta;
}

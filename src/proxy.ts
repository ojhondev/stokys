import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken, type Papel } from "@/lib/auth";

// Next 16 renomeou middleware.ts -> proxy.ts (roda em Node.js por padrão —
// setar `runtime` no config, como era feito com middleware, agora dá erro).
// Ver node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md.
export const config = {
  matcher: ["/dashboard/:path*", "/parceiro/:path*", "/admin/:path*"],
};

const PAPEIS_EQUIPE: Papel[] = ["master", "admin", "producao"];

// Cada papel tem sua própria área — quem cai fora dela é redirecionado pra
// área correta, não só bloqueado (ver plano V1, "proxy.ts — separa área de
// cliente e parceiro").
function destinoPadrao(papel: Papel): string {
  if (papel === "cliente") return "/dashboard";
  if (papel === "parceiro") return "/parceiro";
  return "/admin";
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const sessao = token ? await verifySessionToken(token) : null;

  if (!sessao) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !PAPEIS_EQUIPE.includes(sessao.papel)) {
    return NextResponse.redirect(new URL(destinoPadrao(sessao.papel), request.url));
  }
  if (pathname.startsWith("/dashboard") && sessao.papel !== "cliente") {
    return NextResponse.redirect(new URL(destinoPadrao(sessao.papel), request.url));
  }
  if (pathname.startsWith("/parceiro") && sessao.papel !== "parceiro") {
    return NextResponse.redirect(new URL(destinoPadrao(sessao.papel), request.url));
  }

  return NextResponse.next();
}

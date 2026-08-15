import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken, type Papel } from "@/lib/auth";

// Next 16 renomeou middleware.ts -> proxy.ts (roda em Node.js por padrão —
// setar `runtime` no config, como era feito com middleware, agora dá erro).
// Ver node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md.
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};

const PAPEIS_EQUIPE: Papel[] = ["master", "admin", "producao"];

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const sessao = token ? await verifySessionToken(token) : null;

  if (!sessao) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (request.nextUrl.pathname.startsWith("/admin") && !PAPEIS_EQUIPE.includes(sessao.papel)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

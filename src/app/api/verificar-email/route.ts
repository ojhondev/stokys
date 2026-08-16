import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { usuarios } from "@/lib/db/schema";
import { consumirToken } from "@/lib/verificacao";

// GET porque é um link clicado a partir de um e-mail (navegação), não uma
// Server Action.
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/verificar-email?erro=invalido", request.url));
  }

  const resultado = await consumirToken(token, "verificacao_email");
  if ("erro" in resultado) {
    return NextResponse.redirect(new URL(`/verificar-email?erro=${resultado.erro}`, request.url));
  }

  await getDb()
    .update(usuarios)
    .set({ emailVerificado: true })
    .where(eq(usuarios.id, resultado.usuarioId));

  return NextResponse.redirect(new URL("/dashboard?verificado=1", request.url));
}

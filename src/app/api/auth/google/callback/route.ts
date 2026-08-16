import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { usuarios, parceiros } from "@/lib/db/schema";
import { createSession } from "@/lib/auth";
import { GOOGLE_STATE_COOKIE, trocarCodigoPorUsuario, verificarEstadoOAuth } from "@/lib/oauth/google";

export async function GET(request: NextRequest) {
  const erroGoogle = (motivo: string) =>
    NextResponse.redirect(new URL(`/login?erro=${motivo}`, request.url));

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  if (request.nextUrl.searchParams.get("error") || !code || !state) {
    return erroGoogle("google");
  }

  const cookieValor = request.cookies.get(GOOGLE_STATE_COOKIE)?.value;
  if (!cookieValor) return erroGoogle("google_expirado");

  const estado = await verificarEstadoOAuth(cookieValor);
  // state adulterado ou cookie de outra tentativa — rejeita.
  if (!estado || estado.state !== state) return erroGoogle("google");

  let perfil;
  try {
    perfil = await trocarCodigoPorUsuario(code, estado.verifier);
  } catch {
    return erroGoogle("google");
  }

  const db = getDb();
  const [porGoogleSub] = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.googleSub, perfil.sub))
    .limit(1);

  let usuarioId: string;
  let papel: "cliente" | "parceiro";
  let contaNova = false;

  if (porGoogleSub) {
    usuarioId = porGoogleSub.id;
    papel = porGoogleSub.papel as "cliente" | "parceiro";
  } else {
    const [porEmail] = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, perfil.email.toLowerCase()))
      .limit(1);

    if (porEmail) {
      // Só vincula automaticamente a uma conta de senha existente se os dois
      // lados já confirmaram o e-mail — senão dá pra sequestrar conta alheia
      // criando um Google com o e-mail de outra pessoa (ver plano V1).
      if (porEmail.senhaHash && (!porEmail.emailVerificado || !perfil.email_verified)) {
        return erroGoogle("google_email_nao_verificado");
      }
      await db
        .update(usuarios)
        .set({ googleSub: perfil.sub, avatarUrl: perfil.picture, emailVerificado: true })
        .where(eq(usuarios.id, porEmail.id));
      usuarioId = porEmail.id;
      papel = porEmail.papel as "cliente" | "parceiro";
    } else {
      const [criado] = await db
        .insert(usuarios)
        .values({
          papel: estado.tipo,
          nome: perfil.name,
          email: perfil.email.toLowerCase(),
          googleSub: perfil.sub,
          avatarUrl: perfil.picture,
          emailVerificado: true,
        })
        .returning({ id: usuarios.id });
      usuarioId = criado.id;
      papel = estado.tipo;
      contaNova = true;

      if (estado.tipo === "parceiro") {
        await db.insert(parceiros).values({
          usuarioId,
          nome: perfil.name,
          especialidade: "",
          linkWhatsapp: "",
          ativo: false,
        });
      }
    }
  }

  await createSession(usuarioId, papel);

  function destinoPadrao(): string {
    return papel === "cliente" ? "/dashboard" : "/parceiro";
  }

  const destino = contaNova && papel === "cliente" ? "/onboarding" : estado.next || destinoPadrao();

  const resposta = NextResponse.redirect(new URL(destino, request.url));
  resposta.cookies.delete(GOOGLE_STATE_COOKIE);
  return resposta;
}

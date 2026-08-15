import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { usuarios, planos } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth";
import { planosConteudo } from "@/lib/planos-conteudo";

// Bootstrap do primeiro usuário master + catálogo de planos — sem fluxo de
// autopromoção no app (ver plano em C:\Users\55149\.claude\plans). Idempotente
// pro master: responde 409 assim que existir um, então é seguro deixar esse
// endpoint no código. Planos são upsert (onConflictDoNothing por nome), então
// rodar de novo não duplica nem sobrescreve preço já ajustado manualmente.
export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token || token !== process.env.SEED_MASTER_TOKEN) {
    return NextResponse.json({ erro: "Token inválido." }, { status: 401 });
  }

  const db = getDb();

  await db
    .insert(planos)
    .values(
      planosConteudo.map((p) => ({
        nome: p.slug,
        precoCentavos: p.precoCentavos,
        escopo: { itens: p.itens, descricao: p.descricao },
      })),
    )
    .onConflictDoNothing({ target: planos.nome });

  const [existente] = await db
    .select({ id: usuarios.id })
    .from(usuarios)
    .where(eq(usuarios.papel, "master"))
    .limit(1);
  if (existente) {
    return NextResponse.json({ erro: "Já existe um usuário master (planos verificados/seedados)." }, { status: 409 });
  }

  const nome = process.env.MASTER_NOME;
  const email = process.env.MASTER_EMAIL;
  const senha = process.env.MASTER_SENHA_INICIAL;
  if (!nome || !email || !senha) {
    return NextResponse.json(
      { erro: "MASTER_NOME/MASTER_EMAIL/MASTER_SENHA_INICIAL não definidos no ambiente." },
      { status: 500 },
    );
  }

  const senhaHash = await hashPassword(senha);
  await db.insert(usuarios).values({
    papel: "master",
    nome,
    email: email.toLowerCase(),
    senhaHash,
  });

  return NextResponse.json({ ok: true });
}

"use server";

import { revalidatePath } from "next/cache";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { cobrancas, projetos, projetoItens, usuarios } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { getProjetoDoCliente } from "@/lib/queries/projetos";
import { criarCobrancaAsaas, type MetodoCobranca } from "@/lib/payments/asaas";

export type PagamentoState = { erro?: string };

export async function criarCobranca(metodo: MetodoCobranca): Promise<PagamentoState> {
  const sessao = await getSession();
  if (!sessao || sessao.papel !== "cliente") {
    return { erro: "Sessão inválida — faça login novamente." };
  }

  const db = getDb();
  const registro = await getProjetoDoCliente(sessao.userId);
  if (!registro) {
    return { erro: "Nenhum projeto encontrado pra essa conta." };
  }
  const { projeto } = registro;

  const [usuario] = await db
    .select({ nome: usuarios.nome, email: usuarios.email, emailVerificado: usuarios.emailVerificado })
    .from(usuarios)
    .where(eq(usuarios.id, sessao.userId))
    .limit(1);
  if (!usuario) {
    return { erro: "Sessão inválida — faça login novamente." };
  }
  // emailVerificado nunca vai pro cookie de sessão (ver src/lib/auth.ts) —
  // por isso é lido do banco aqui, no único ponto que precisa travar por causa disso.
  if (!usuario.emailVerificado) {
    return { erro: "Confirme seu e-mail antes de pagar — veja o aviso no topo do painel." };
  }

  // Cobrança soma tudo que ainda não foi cobrado — plano base + upsells
  // adicionados (ver schema.ts, projeto_itens).
  const itensAbertos = await db
    .select({ id: projetoItens.id, valorCentavos: projetoItens.valorCentavos })
    .from(projetoItens)
    .where(and(eq(projetoItens.projetoId, projeto.id), isNull(projetoItens.cobrancaId)));

  const valorTotalCentavos = itensAbertos.reduce((soma, item) => soma + item.valorCentavos, 0);
  if (itensAbertos.length === 0 || valorTotalCentavos <= 0) {
    return { erro: "Nenhum item em aberto pra cobrar." };
  }

  const resultadoAsaas = await criarCobrancaAsaas({
    valorCentavos: valorTotalCentavos,
    metodo,
    clienteNome: usuario.nome,
    clienteEmail: usuario.email,
    projetoId: projeto.id,
  });

  const [cobranca] = await db
    .insert(cobrancas)
    .values({
      projetoId: projeto.id,
      metodo,
      status: "pendente",
      valorCentavos: valorTotalCentavos,
      asaasId: resultadoAsaas.asaasId,
      linkOuQrCode: resultadoAsaas.linkOuQrCode,
    })
    .returning({ id: cobrancas.id });

  await db
    .update(projetoItens)
    .set({ cobrancaId: cobranca.id })
    .where(
      inArray(
        projetoItens.id,
        itensAbertos.map((item) => item.id),
      ),
    );

  revalidatePath("/dashboard/pagamentos");
  return {};
}

// Marca uma cobrança como paga e libera a produção. Isolada assim porque um
// futuro webhook real da Asaas (Fase 3) vai chamar exatamente esta mesma
// função em vez do botão "Simular pagamento".
export async function marcarCobrancaPaga(cobrancaId: string): Promise<PagamentoState> {
  const sessao = await getSession();
  if (!sessao || sessao.papel !== "cliente") {
    return { erro: "Sessão inválida — faça login novamente." };
  }

  const db = getDb();
  const [cobranca] = await db.select().from(cobrancas).where(eq(cobrancas.id, cobrancaId)).limit(1);
  if (!cobranca) {
    return { erro: "Cobrança não encontrada." };
  }

  const [projeto] = await db.select().from(projetos).where(eq(projetos.id, cobranca.projetoId)).limit(1);
  if (!projeto || projeto.clienteId !== sessao.userId) {
    return { erro: "Cobrança não pertence a essa conta." };
  }

  await db
    .update(cobrancas)
    .set({ status: "pago", pagoEm: new Date() })
    .where(eq(cobrancas.id, cobrancaId));

  await db
    .update(projetos)
    .set({ status: "em_producao", atualizadoEm: new Date() })
    .where(eq(projetos.id, projeto.id));

  revalidatePath("/dashboard/pagamentos");
  revalidatePath("/dashboard");
  return {};
}

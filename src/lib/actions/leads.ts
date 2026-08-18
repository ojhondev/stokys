"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";

export type LeadState = { erro?: string; enviado?: boolean };

export async function criarLead(nome: string, whatsapp: string, email: string): Promise<LeadState> {
  const nomeLimpo = nome.trim();
  const whatsappLimpo = whatsapp.trim();
  const emailLimpo = email.trim();

  if (!nomeLimpo || !whatsappLimpo || !emailLimpo) {
    return { erro: "Preencha nome, WhatsApp e e-mail." };
  }

  await getDb().insert(leads).values({ nome: nomeLimpo, whatsapp: whatsappLimpo, email: emailLimpo });

  return { enviado: true };
}

export async function marcarLeadContatado(leadId: string, contatado: boolean): Promise<LeadState> {
  const sessao = await getSession();
  if (!sessao || !["master", "admin"].includes(sessao.papel)) return { erro: "Sessão inválida." };

  await getDb().update(leads).set({ contatado }).where(eq(leads.id, leadId));

  revalidatePath("/admin/leads");
  return {};
}

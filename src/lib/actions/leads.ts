"use server";

import { getDb } from "@/lib/db";
import { leads } from "@/lib/db/schema";

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

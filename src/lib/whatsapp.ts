// Link de contato via WhatsApp — número único da agência. Usado no lugar do
// fluxo de onboarding em todo CTA "Criar loja" da LP (pedido do usuário,
// 2026-08-15): o onboarding real ainda não está pronto pro público.

const WHATSAPP_NUMERO = "5514998570045";

export const MENSAGEM_WHATSAPP_GENERICA = "Olá! Quero criar minha loja com a Stokys.";

export function linkWhatsapp(mensagem: string): string {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}

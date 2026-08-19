// Máscara (00) 00000-0000 — trunca em 11 dígitos (DDD + celular) pra não
// deixar digitar além do que um número de telefone brasileiro comporta.
// Usado nos formulários de captura de WhatsApp (onboarding e popup de vídeo).
export function formatarWhatsapp(valor: string): string {
  const digitos = valor.replace(/\D/g, "").slice(0, 11);
  const ddd = digitos.slice(0, 2);
  const restante = digitos.slice(2);
  const separador = restante.length > 4 ? restante.length - 4 : restante.length;
  const parte1 = restante.slice(0, separador);
  const parte2 = restante.slice(separador);

  if (!digitos) return "";
  if (digitos.length <= 2) return `(${ddd}`;
  if (!parte1) return `(${ddd}) `;
  if (!parte2) return `(${ddd}) ${parte1}`;
  return `(${ddd}) ${parte1}-${parte2}`;
}

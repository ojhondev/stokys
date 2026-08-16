function baseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function templateVerificacaoEmail(nome: string, token: string): string {
  const link = `${baseUrl()}/api/verificar-email?token=${token}`;
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
      <h1 style="color: #14140f; font-size: 20px;">Confirme seu e-mail</h1>
      <p style="color: #6e6e64; font-size: 14px; line-height: 1.5;">
        Oi, ${nome}! Clique no botão abaixo pra confirmar seu e-mail e liberar
        o pagamento da sua loja na Stokys.
      </p>
      <a
        href="${link}"
        style="display: inline-block; margin-top: 16px; padding: 14px 22px; background: #beff50; color: #14140f; font-weight: bold; text-decoration: none; border-radius: 999px;"
      >
        Confirmar e-mail
      </a>
      <p style="color: #919183; font-size: 12px; margin-top: 24px;">
        Se você não criou uma conta na Stokys, pode ignorar este e-mail.
      </p>
    </div>
  `;
}

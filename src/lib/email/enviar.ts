import "server-only";

// Seam isolado do provedor de e-mail (Resend) — mesmo padrão de
// src/lib/payments/asaas.ts: sem RESEND_API_KEY no ambiente, loga no console
// e retorna sucesso, pra dev nunca gastar cota real (100/dia grátis no plano
// gratuito). Trocar isso por uma chamada real é a única mudança necessária.

export async function enviarEmail(input: {
  para: string;
  assunto: string;
  html: string;
}): Promise<{ ok: boolean; erro?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const remetente = process.env.EMAIL_REMETENTE ?? "Stokys <onboarding@resend.dev>";

  if (!apiKey) {
    // Loga o link/token embutido no HTML também — sem isso não dá pra testar
    // o fluxo de verificação em dev (o e-mail nunca sai de verdade).
    const link = input.html.match(/href="([^"]+)"/)?.[1];
    console.log(
      `[email mock] para=${input.para} assunto="${input.assunto}"${link ? ` link=${link}` : ""}`,
    );
    return { ok: true };
  }

  const resposta = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: remetente,
      to: input.para,
      subject: input.assunto,
      html: input.html,
    }),
  });

  if (!resposta.ok) {
    const texto = await resposta.text();
    console.error("Falha ao enviar e-mail via Resend:", texto);
    return { ok: false, erro: texto };
  }

  return { ok: true };
}

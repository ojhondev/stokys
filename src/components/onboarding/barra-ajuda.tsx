import { LinkButton } from "@/components/ui/button";
import { linkWhatsapp } from "@/lib/whatsapp";

// Faixa fixa durante todo o onboarding — pedido do usuário: cliente
// travado numa etapa precisa de uma saída rápida pro suporte, com contexto
// (nome/e-mail) já preenchido na mensagem pra quem responde saber quem é.

export function BarraAjuda({ nome, email }: { nome: string; email: string }) {
  const mensagem = `Olá! Preciso de ajuda no onboarding da minha loja. Nome: ${nome} — E-mail: ${email}`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ash bg-pure-white px-6 py-3 sm:px-10 lg:px-16">
      <div className="mx-auto flex w-full max-w-[900px] items-center justify-between gap-4">
        <p className="text-body-sm font-medium text-off-black-ink">
          Precisa de ajuda pra preencher? Fale com nosso suporte.
        </p>
        <LinkButton
          href={linkWhatsapp(mensagem)}
          target="_blank"
          rel="noopener noreferrer"
          variant="dark"
          className="shrink-0 whitespace-nowrap"
        >
          Falar no WhatsApp
        </LinkButton>
      </div>
    </div>
  );
}

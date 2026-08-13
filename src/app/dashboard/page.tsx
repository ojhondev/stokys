// Dashboard do cliente — ver docs/PRD.md, seção 4.4.
// TODO (Fase 1): gatear por sessão (src/lib/auth.ts -> getSession(), papel "cliente")
// via middleware assim que houver usuários reais no banco.

export default function DashboardPage() {
  return (
    <main className="flex flex-1 flex-col bg-off-white-canvas px-6 py-16">
      <div className="mx-auto w-full max-w-[1200px]">
        <span className="text-caption font-medium uppercase text-graphite">Seu projeto</span>
        <h1 className="mt-3 text-heading font-medium text-off-black-ink">
          Ainda não há um projeto vinculado a esta conta.
        </h1>
        <p className="mt-4 max-w-[480px] text-body-sm text-graphite">
          Status, mensagens com a equipe e o preview da sua loja aparecem aqui assim que o
          onboarding for concluído e o pagamento confirmado.
        </p>
      </div>
    </main>
  );
}

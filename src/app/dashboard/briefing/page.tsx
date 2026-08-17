import { getSession } from "@/lib/auth";
import { getProjetoDoCliente } from "@/lib/queries/projetos";
import { labelPlataforma, labelTema } from "@/lib/labels-projeto";
import { BriefingForm } from "@/components/dashboard/briefing-form";

// Módulo Briefing — mistura dados já coletados no onboarding (só leitura)
// com campos que o cliente edita depois (identidade/público/posicionamento).
// "Produtos" reusa o que já existe implicitamente no plano — não duplica.

export default async function BriefingPage() {
  const sessao = await getSession();
  if (!sessao) return null;

  const registro = await getProjetoDoCliente(sessao.userId);
  if (!registro) {
    return (
      <div>
        <span className="text-caption font-medium uppercase text-graphite">Briefing</span>
        <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
          Nenhum projeto encontrado
        </h1>
      </div>
    );
  }

  const { projeto, plano } = registro;

  const linhas = [
    {
      label: "Plataforma",
      valor:
        projeto.plataforma === "outra" ? projeto.plataformaOutraNome : labelPlataforma[projeto.plataforma],
    },
    plano.nome === "customizado"
      ? { label: "Mercado", valor: "Customizado" }
      : { label: "Tema", valor: projeto.tema ? labelTema[projeto.tema] : "—" },
    { label: "Nicho", valor: projeto.nicho },
    { label: "Objetivo do cliente", valor: projeto.objetivoCliente || "—" },
  ];

  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Briefing</span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
        Informações do seu projeto
      </h1>
      <p className="mt-2 max-w-[560px] text-body-sm text-graphite">
        A primeira parte veio do seu onboarding. Complete o resto abaixo pra ajudar a produção a
        acertar na identidade da sua loja.
      </p>

      <div className="mt-6 flex flex-col gap-2 rounded-3xl bg-pure-white p-6 text-body-sm">
        {linhas.map((linha) => (
          <div
            key={linha.label}
            className="flex items-center justify-between gap-4 border-b border-ash py-2 text-off-black-ink last:border-b-0"
          >
            <span className="text-graphite">{linha.label}</span>
            <span className="text-right font-medium">{linha.valor}</span>
          </div>
        ))}
      </div>

      <div>
        <p className="mt-2 text-caption font-medium uppercase text-graphite">Referências</p>
        <ul className="mt-2 flex flex-col gap-1 rounded-3xl bg-pure-white p-6">
          {projeto.referencias.map((ref, i) => (
            <li key={i} className="text-body-sm text-off-black-ink">
              {ref}
            </li>
          ))}
        </ul>
      </div>

      <BriefingForm
        identidadeDriveUrl={projeto.identidadeDriveUrl ?? ""}
        publico={projeto.publico ?? ""}
        posicionamento={projeto.posicionamento ?? ""}
      />
    </div>
  );
}

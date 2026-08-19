"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { excluirLead } from "@/lib/actions/leads";
import { LeadToggle } from "@/components/admin/lead-toggle";
import { labelPlataforma, labelTema, labelMercado } from "@/lib/labels-projeto";
import { labelStatusProjeto } from "@/lib/status-projeto";
import { formatarPreco, nomeExibicaoPlano } from "@/lib/planos-conteudo";
import type { PlanoConteudo } from "@/lib/planos-conteudo";

type Lead = {
  id: string;
  nome: string;
  whatsapp: string;
  email: string;
  contatado: boolean;
  criadoEm: Date;
  projetoId: string | null;
  planoNome: PlanoConteudo["slug"] | null;
  precoCentavos: number | null;
  plataforma: "shopify" | "nuvemshop" | "tray" | "bagy" | "outra" | null;
  plataformaOutraNome: string | null;
  tema: "spark" | "quant" | null;
  nicho: string | null;
  referencias: string[] | null;
  objetivoCliente: string | null;
  statusProjeto: keyof typeof labelStatusProjeto | null;
  mercadoAlvo: "brasil" | "global" | "latam" | null;
  possuiIdentidadeVisual: boolean | null;
  paletaCores: string[] | null;
};

function linkWhatsappLead(whatsapp: string, nome: string): string {
  const numero = whatsapp.replace(/\D/g, "");
  const mensagem = `Olá, ${nome}! Vi que você se interessou pela Stokys, vamos conversar?`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [selecionado, setSelecionado] = useState<Lead | null>(null);
  const [excluindoId, setExcluindoId] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();

  function excluir(lead: Lead) {
    if (!confirm(`Excluir o lead de ${lead.nome}? Essa ação não pode ser desfeita.`)) return;
    setExcluindoId(lead.id);
    iniciarTransicao(async () => {
      await excluirLead(lead.id);
      if (selecionado?.id === lead.id) setSelecionado(null);
      setExcluindoId(null);
      router.refresh();
    });
  }

  return (
    <>
      {leads.length === 0 && (
        <p className="mt-6 text-body-sm text-graphite">Nenhum lead por aqui ainda.</p>
      )}

      <div className="mt-8 overflow-x-auto rounded-3xl bg-pure-white">
        {leads.length > 0 && (
          <table className="w-full min-w-[820px] border-collapse text-body-sm">
            <thead>
              <tr className="border-b border-ash text-left text-caption font-medium uppercase text-graphite">
                <th className="px-6 py-4">Nome</th>
                <th className="px-4 py-4">WhatsApp</th>
                <th className="px-4 py-4">E-mail</th>
                <th className="px-4 py-4">Onboarding</th>
                <th className="px-4 py-4">Recebido em</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4"></th>
                <th className="px-4 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-ash last:border-b-0">
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => setSelecionado(lead)}
                      className="font-bold text-off-black-ink underline underline-offset-4"
                    >
                      {lead.nome}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-off-black-ink">{lead.whatsapp}</td>
                  <td className="px-4 py-4 text-off-black-ink">{lead.email}</td>
                  <td className="px-4 py-4">
                    {lead.projetoId ? (
                      <span className="rounded-full bg-electric-lime px-3 py-1 text-caption font-medium text-off-black-ink">
                        Completo
                      </span>
                    ) : (
                      <span className="rounded-full bg-off-white-canvas px-3 py-1 text-caption font-medium text-graphite">
                        Só contato
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-graphite">
                    {lead.criadoEm.toLocaleString("pt-BR")}
                  </td>
                  <td className="px-4 py-4">
                    <LeadToggle leadId={lead.id} contatado={lead.contatado} />
                  </td>
                  <td className="px-4 py-4">
                    <a
                      href={linkWhatsappLead(lead.whatsapp, lead.nome)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-off-black-ink underline underline-offset-4"
                    >
                      Chamar no WhatsApp
                    </a>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => excluir(lead)}
                      disabled={pendente && excluindoId === lead.id}
                      className="font-medium text-off-black-ink/60 hover:text-off-black-ink disabled:opacity-50"
                    >
                      {pendente && excluindoId === lead.id ? "Excluindo…" : "Excluir"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selecionado && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Fechar ficha do lead"
            onClick={() => setSelecionado(null)}
            className="absolute inset-0 bg-off-black-ink/40"
          />
          <div className="relative flex h-full w-full max-w-[440px] flex-col overflow-y-auto bg-pure-white p-8">
            <div className="flex items-center justify-between">
              <span className="text-caption font-medium uppercase text-graphite">Ficha do lead</span>
              <button
                type="button"
                onClick={() => setSelecionado(null)}
                aria-label="Fechar"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-off-white-canvas text-off-black-ink"
              >
                ✕
              </button>
            </div>

            <h2 className="mt-4 text-heading font-heading font-bold text-off-black-ink">
              {selecionado.nome}
            </h2>

            <div className="mt-6 flex flex-col gap-2 rounded-3xl bg-off-white-canvas p-6 text-body-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-graphite">WhatsApp</span>
                <span className="font-medium text-off-black-ink">{selecionado.whatsapp}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-graphite">E-mail</span>
                <span className="font-medium text-off-black-ink">{selecionado.email}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-graphite">Recebido em</span>
                <span className="font-medium text-off-black-ink">
                  {selecionado.criadoEm.toLocaleString("pt-BR")}
                </span>
              </div>
            </div>

            {!selecionado.projetoId && (
              <p className="mt-6 text-body-sm text-graphite">
                Esse lead ainda não completou o onboarding — só temos o contato acima.
              </p>
            )}

            {selecionado.projetoId && (
              <div className="mt-6 flex flex-col gap-2 rounded-3xl bg-off-white-canvas p-6 text-body-sm">
                <p className="mb-2 text-caption font-medium uppercase text-graphite">
                  Respostas do onboarding
                </p>
                <div className="flex items-center justify-between gap-4 border-b border-ash py-2">
                  <span className="text-graphite">Plano</span>
                  <span className="font-medium text-off-black-ink">
                    {selecionado.planoNome ? nomeExibicaoPlano(selecionado.planoNome) : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-ash py-2">
                  <span className="text-graphite">Valor</span>
                  <span className="font-medium text-off-black-ink">
                    {selecionado.precoCentavos != null ? formatarPreco(selecionado.precoCentavos) : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-ash py-2">
                  <span className="text-graphite">Status</span>
                  <span className="font-medium text-off-black-ink">
                    {selecionado.statusProjeto ? labelStatusProjeto[selecionado.statusProjeto] : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-ash py-2">
                  <span className="text-graphite">Plataforma</span>
                  <span className="font-medium text-off-black-ink">
                    {selecionado.plataforma === "outra"
                      ? selecionado.plataformaOutraNome
                      : selecionado.plataforma
                        ? labelPlataforma[selecionado.plataforma]
                        : "—"}
                  </span>
                </div>
                {selecionado.planoNome === "customizado" ? (
                  <div className="flex items-center justify-between gap-4 border-b border-ash py-2">
                    <span className="text-graphite">Mercado</span>
                    <span className="font-medium text-off-black-ink">
                      {selecionado.mercadoAlvo ? labelMercado[selecionado.mercadoAlvo] : "—"}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4 border-b border-ash py-2">
                    <span className="text-graphite">Tema</span>
                    <span className="font-medium text-off-black-ink">
                      {selecionado.tema ? labelTema[selecionado.tema] : "—"}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between gap-4 border-b border-ash py-2">
                  <span className="text-graphite">Nicho</span>
                  <span className="font-medium text-off-black-ink">{selecionado.nicho || "—"}</span>
                </div>
                {selecionado.planoNome === "customizado" && (
                  <>
                    <div className="flex items-center justify-between gap-4 border-b border-ash py-2">
                      <span className="text-graphite">Identidade visual</span>
                      <span className="font-medium text-off-black-ink">
                        {selecionado.possuiIdentidadeVisual === null
                          ? "—"
                          : selecionado.possuiIdentidadeVisual
                            ? "Já tem"
                            : "Precisa criar"}
                      </span>
                    </div>
                    {selecionado.paletaCores && selecionado.paletaCores.length > 0 && (
                      <div className="flex items-center justify-between gap-4 border-b border-ash py-2">
                        <span className="text-graphite">Paleta</span>
                        <span className="flex items-center gap-2">
                          {selecionado.paletaCores.map((cor) => (
                            <span
                              key={cor}
                              className="h-5 w-5 rounded-full ring-1 ring-ash"
                              style={{ backgroundColor: cor }}
                              title={cor}
                            />
                          ))}
                        </span>
                      </div>
                    )}
                  </>
                )}
                {selecionado.referencias && selecionado.referencias.length > 0 && (
                  <div className="border-b border-ash py-2">
                    <span className="text-graphite">Referências</span>
                    <ul className="mt-1 flex flex-col gap-0.5">
                      {selecionado.referencias.map((ref, i) => (
                        <li key={i} className="font-medium text-off-black-ink">
                          {ref}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {selecionado.objetivoCliente && (
                  <div className="py-2">
                    <span className="text-graphite">Objetivo</span>
                    <p className="mt-1 font-medium text-off-black-ink">{selecionado.objetivoCliente}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

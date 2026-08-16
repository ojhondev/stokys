"use client";

import { useState } from "react";
import { LinkButton } from "@/components/ui/button";
import { linkWhatsapp } from "@/lib/whatsapp";

// Faixa de depoimentos expansível — mesmo padrão de "12,000+ real businesses"
// da perk.com: um card em destaque + tiras estreitas que expandem ao clicar.
// Sem depoimento real de cliente ainda, então o conteúdo fica marcado como
// placeholder explícito (igual ao "Em breve" do Blog) em vez de inventar
// nome/citação — só a interação (clicar expande) já fica pronta pro real.

const cards = [1, 2, 3, 4, 5];

export function Depoimentos() {
  const [ativo, setAtivo] = useState(0);

  return (
    <section className="bg-pure-white px-6 py-14 sm:px-10 md:py-16 lg:px-16">
      <div className="mx-auto w-full max-w-[1800px]">
        <h2 className="text-center text-heading-lg font-heading font-bold text-off-black-ink">
          Histórias reais de quem já vende com a Stokys
        </h2>

        <div className="mt-12 flex h-[360px] gap-3 sm:h-[420px]">
          {cards.map((id, i) => {
            const expandido = i === ativo;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setAtivo(i)}
                aria-expanded={expandido}
                aria-label={`Ver depoimento ${id}`}
                style={{ flexBasis: expandido ? "60%" : "10%" }}
                className="group relative shrink-0 grow overflow-hidden rounded-3xl bg-deep-charcoal text-left transition-[flex-basis] duration-500 ease-out"
              >
                <span className="absolute left-4 top-4 rounded-full bg-pure-white/10 px-3 py-1 text-caption font-bold uppercase text-pure-white sm:left-6 sm:top-6">
                  Cliente {id}
                </span>

                {!expandido && (
                  <span className="absolute inset-x-0 bottom-6 text-center text-caption font-medium uppercase text-pure-white/50 [writing-mode:vertical-lr] sm:bottom-8">
                    Em breve
                  </span>
                )}

                {expandido && (
                  <div className="absolute inset-x-4 bottom-4 flex flex-col items-start gap-4 sm:inset-x-6 sm:bottom-6">
                    <p className="max-w-[420px] text-subheading font-heading font-bold text-pure-white">
                      Depoimento em breve.
                    </p>
                    <LinkButton
                      href={linkWhatsapp("Olá! Quero saber mais sobre os cases da Stokys.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline-light"
                    >
                      Quero ser o próximo →
                    </LinkButton>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

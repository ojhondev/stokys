"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import Image from "next/image";
import { criarLead } from "@/lib/actions/leads";
import { linkWhatsapp } from "@/lib/whatsapp";

// Pop-up de vídeo com captura de lead — abre sozinho na primeira visita
// (localStorage guarda que já foi visto, pra não repetir a cada navegação).
// Depois de fechado, vira um mini player flutuante no canto inferior esquerdo
// (desktop e mobile, mobile menor pra não atrapalhar a navegação) que reabre
// o pop-up ao clicar. No mobile o vídeo é 1:2 (estilo story) empilhado com o
// formulário embaixo, em vez do split lado a lado do desktop. Também escuta
// o evento "stokys:abrir-video" pra permitir reabrir de outros lugares.

const CHAVE_VISTO = "stokys-video-popup-visto";
const MENSAGEM_WHATSAPP = "Olá! Vi o vídeo da Stokys e quero saber mais.";

export function VideoPopup() {
  const [aberto, setAberto] = useState(false);
  const [mostrarFlutuante, setMostrarFlutuante] = useState(false);

  useEffect(() => {
    const jaVisto = localStorage.getItem(CHAVE_VISTO);
    const timer = setTimeout(
      () => (jaVisto ? setMostrarFlutuante(true) : setAberto(true)),
      jaVisto ? 0 : 1200,
    );
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    function abrirViaEvento() {
      setAberto(true);
    }
    window.addEventListener("stokys:abrir-video", abrirViaEvento);
    return () => window.removeEventListener("stokys:abrir-video", abrirViaEvento);
  }, []);

  function fechar() {
    setAberto(false);
    setMostrarFlutuante(true);
    localStorage.setItem(CHAVE_VISTO, "1");
  }

  function abrir() {
    setAberto(true);
  }

  return (
    <>
      {aberto && <VideoModal onFechar={fechar} />}

      {mostrarFlutuante && !aberto && (
        <button
          type="button"
          onClick={abrir}
          className="fixed bottom-20 left-3 z-40 flex flex-col items-center gap-1.5 rounded-2xl bg-pure-white p-2 shadow-lg transition-transform duration-200 hover:scale-[1.03] md:bottom-auto md:left-4 md:top-1/2 md:-translate-y-1/2 md:gap-2 md:rounded-3xl md:p-3"
        >
          <span className="relative block h-14 w-9 overflow-hidden rounded-xl md:h-24 md:w-16 md:rounded-2xl">
            <video
              src="/video-stokys.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          </span>
          <span className="max-w-[70px] text-center text-[10px] font-bold leading-tight text-off-black-ink md:max-w-[90px] md:text-caption">
            Entenda o que é a Stokys
          </span>
        </button>
      )}
    </>
  );
}

function VideoModal({ onFechar }: { onFechar: () => void }) {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);
  const [pendente, iniciarTransicao] = useTransition();

  function enviar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    iniciarTransicao(async () => {
      const resultado = await criarLead(nome, whatsapp, email);
      if (resultado.erro) {
        setErro(resultado.erro);
        return;
      }
      setEnviado(true);
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-off-black-ink/60 sm:p-6">
      <button
        type="button"
        aria-label="Fechar pop-up de vídeo"
        onClick={onFechar}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative flex h-full w-full flex-col overflow-y-auto bg-hero-canvas sm:h-auto sm:max-h-[92vh] sm:max-w-[1000px] sm:flex-row sm:overflow-hidden sm:rounded-3xl">
        <button
          type="button"
          onClick={onFechar}
          aria-label="Fechar"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-pure-white text-off-black-ink shadow-sm"
        >
          ✕
        </button>

        <div className="relative aspect-[1/2] w-full shrink-0 bg-off-black-ink sm:aspect-auto sm:h-auto sm:w-[42%]">
          <video
            src="/video-stokys.mp4"
            autoPlay
            muted
            loop
            playsInline
            controls
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col justify-center px-6 py-8 sm:px-12 sm:py-10">
          <Image
            src="/logo-stokys.png"
            alt="Stokys"
            width={125}
            height={28}
            className="h-5 w-auto self-center"
          />

          <h2 className="mt-6 text-heading font-heading font-bold leading-tight text-off-black-ink sm:text-heading-lg">
            Crie sua loja com a Stokys hoje
          </h2>
          <p className="mt-3 text-body-sm text-graphite sm:text-body">
            Ficou alguma dúvida ou prefere conversar com nosso time?
          </p>

          {enviado ? (
            <div className="mt-8 flex flex-col gap-4 rounded-3xl bg-pure-white p-6">
              <p className="text-body-sm font-medium text-off-black-ink">
                Recebemos seus dados — nosso time entra em contato em breve. Se preferir, já pode
                falar com a gente agora mesmo.
              </p>
              <a
                href={linkWhatsapp(MENSAGEM_WHATSAPP)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit rounded-3xl bg-off-black-ink pt-4 pb-4 pl-4 pr-3 text-body font-bold text-electric-lime"
              >
                Falar agora no WhatsApp
              </a>
            </div>
          ) : (
            <form onSubmit={enviar} className="mt-8 flex flex-col gap-3">
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                className="rounded-xl bg-pure-white px-5 py-4 text-body text-off-black-ink placeholder:text-graphite"
              />
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="WhatsApp"
                className="rounded-xl bg-pure-white px-5 py-4 text-body text-off-black-ink placeholder:text-graphite"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                className="rounded-xl bg-pure-white px-5 py-4 text-body text-off-black-ink placeholder:text-graphite"
              />

              {erro && <p className="text-body-sm font-medium text-off-black-ink">{erro}</p>}

              <button
                type="submit"
                disabled={pendente}
                className="mt-1 rounded-xl bg-off-black-ink py-4 text-body font-bold text-pure-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {pendente ? "Enviando…" : "Enviar"}
              </button>

              <p className="mt-1 text-center text-caption text-graphite">
                Ao preencher você autoriza que a Stokys utilize seus dados para contatos
                comerciais.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

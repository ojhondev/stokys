"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import Image from "next/image";
import { criarLead } from "@/lib/actions/leads";
import { linkWhatsapp } from "@/lib/whatsapp";

// Pop-up de vídeo com captura de lead — abre sozinho na primeira visita
// (localStorage guarda que já foi visto, pra não repetir a cada navegação).
// Depois de fechado, vira um mini player flutuante no canto inferior esquerdo
// (desktop e mobile, mobile menor pra não atrapalhar a navegação) que reabre
// o pop-up ao clicar. No mobile é um cartão pequeno e centralizado (não tela
// cheia), fundo desfocado (blur) em vez de escurecido, vídeo com altura fixa
// e controles em texto ("Fechar"/"Ouvir com áudio") sobre o próprio vídeo —
// tudo cabe na tela sem precisar rolar. No desktop continua o split lado a
// lado. Também escuta o evento "stokys:abrir-video" pra reabrir de outros
// lugares (ver promo-bar.tsx e faixa-youtube.tsx, se algum dia usarem isso).

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [comAudio, setComAudio] = useState(false);
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);
  const [pendente, iniciarTransicao] = useTransition();

  function alternarAudio() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setComAudio(!video.muted);
  }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-pure-white/20 p-4 backdrop-blur-md sm:bg-off-black-ink/60 sm:p-6 sm:backdrop-blur-none">
      <button
        type="button"
        aria-label="Fechar pop-up de vídeo"
        onClick={onFechar}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative flex max-h-[88vh] w-full max-w-[380px] flex-col overflow-hidden rounded-3xl bg-hero-canvas shadow-2xl sm:h-auto sm:max-h-[92vh] sm:max-w-[1000px] sm:flex-row">
        <button
          type="button"
          onClick={onFechar}
          aria-label="Fechar"
          className="absolute right-4 top-4 z-10 hidden h-9 w-9 items-center justify-center rounded-full bg-pure-white text-off-black-ink shadow-sm sm:flex"
        >
          ✕
        </button>

        <div className="relative h-[34vh] w-full shrink-0 bg-off-black-ink sm:h-auto sm:w-[42%]">
          <video
            ref={videoRef}
            src="/video-stokys.mp4"
            autoPlay
            muted
            loop
            playsInline
            controls
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-off-black-ink/60 to-transparent p-3 sm:hidden">
            <button
              type="button"
              onClick={onFechar}
              className="pointer-events-auto text-body-sm font-bold text-pure-white"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={alternarAudio}
              className="pointer-events-auto text-body-sm font-bold text-pure-white"
            >
              {comAudio ? "Silenciar" : "Ouvir com áudio"}
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center overflow-y-auto px-5 py-4 sm:px-12 sm:py-10">
          <Image
            src="/logo-stokys.png"
            alt="Stokys"
            width={125}
            height={28}
            className="h-4 w-auto self-center sm:h-5"
          />

          <h2 className="mt-3 text-subheading font-heading font-bold leading-tight text-off-black-ink sm:mt-6 sm:text-heading-lg">
            Crie sua loja com a Stokys hoje
          </h2>
          <p className="mt-2 text-caption text-graphite sm:mt-3 sm:text-body">
            Ficou alguma dúvida ou prefere conversar com nosso time?
          </p>

          {enviado ? (
            <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-pure-white p-4 sm:mt-8 sm:gap-4 sm:rounded-3xl sm:p-6">
              <p className="text-caption font-medium text-off-black-ink sm:text-body-sm">
                Recebemos seus dados — nosso time entra em contato em breve. Se preferir, já pode
                falar com a gente agora mesmo.
              </p>
              <a
                href={linkWhatsapp(MENSAGEM_WHATSAPP)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit rounded-3xl bg-off-black-ink pb-3 pl-4 pr-3 pt-3 text-caption font-bold text-electric-lime sm:pb-4 sm:pt-4 sm:text-body"
              >
                Falar agora no WhatsApp
              </a>
            </div>
          ) : (
            <form onSubmit={enviar} className="mt-3 flex flex-col gap-2 sm:mt-8 sm:gap-3">
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                className="rounded-xl bg-pure-white px-4 py-2.5 text-body-sm text-off-black-ink placeholder:text-graphite sm:px-5 sm:py-4 sm:text-body"
              />
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="WhatsApp"
                className="rounded-xl bg-pure-white px-4 py-2.5 text-body-sm text-off-black-ink placeholder:text-graphite sm:px-5 sm:py-4 sm:text-body"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                className="rounded-xl bg-pure-white px-4 py-2.5 text-body-sm text-off-black-ink placeholder:text-graphite sm:px-5 sm:py-4 sm:text-body"
              />

              {erro && <p className="text-caption font-medium text-off-black-ink sm:text-body-sm">{erro}</p>}

              <button
                type="submit"
                disabled={pendente}
                className="mt-1 rounded-xl bg-off-black-ink py-2.5 text-body-sm font-bold text-pure-white transition-opacity hover:opacity-90 disabled:opacity-60 sm:py-4 sm:text-body"
              >
                {pendente ? "Enviando…" : "Enviar"}
              </button>

              <p className="mt-1 text-center text-[10px] leading-tight text-graphite sm:text-caption">
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

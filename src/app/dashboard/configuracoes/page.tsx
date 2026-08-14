"use client";

import { useState } from "react";

// Acessos da plataforma (Shopify/Nuvemshop) — movidos do onboarding pra cá a
// pedido do usuário: só são pedidos depois que o projeto já existe, dentro do
// painel. Ver docs/PRD.md, seção 4.2.1 (nota de segurança sobre 2FA e
// criptografia) — aqui é só o formulário; TODO (Fase 1): salvar via Server
// Action usando src/lib/credentials.ts (encryptSecret) assim que o Neon e a
// sessão do cliente estiverem conectados de ponta a ponta.

export default function ConfiguracoesPage() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [salvo, setSalvo] = useState(false);

  return (
    <div>
      <span className="text-caption font-medium uppercase text-graphite">Configurações</span>
      <h1 className="mt-1 text-heading font-heading font-bold text-off-black-ink">
        Acessos da plataforma
      </h1>
      <p className="mt-2 max-w-[520px] text-body-sm text-graphite">
        A produção precisa desses acessos pra implementar sua loja. Ficam criptografados e são
        revogados assim que a loja é entregue.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSalvo(true);
        }}
        className="mt-8 flex flex-col gap-4 rounded-3xl bg-pure-white p-6"
      >
        <label className="flex flex-col gap-2">
          <span className="text-body-sm font-medium text-off-black-ink">
            Usuário / e-mail de acesso
          </span>
          <input
            type="text"
            value={usuario}
            onChange={(e) => {
              setUsuario(e.target.value);
              setSalvo(false);
            }}
            className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-body-sm font-medium text-off-black-ink">Senha</span>
          <input
            type="password"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              setSalvo(false);
            }}
            className="rounded-lg border border-ash bg-off-white-canvas px-4 py-3 text-body text-off-black-ink"
          />
        </label>

        <p className="text-caption text-graphite">
          Recomendamos desativar a autenticação de dois fatores durante a implementação, pra não
          travar a produção — pode reativar assim que a loja for entregue.
        </p>

        <button
          type="submit"
          className="mt-2 w-fit rounded-3xl bg-electric-lime pt-4 pb-4 pl-4 pr-3 text-body font-medium text-off-black-ink"
        >
          Salvar acessos
        </button>

        {salvo && (
          <p className="text-body-sm font-medium text-off-black-ink">
            Acessos salvos (mock) — a produção foi avisada.
          </p>
        )}
      </form>
    </div>
  );
}

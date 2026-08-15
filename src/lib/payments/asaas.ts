import "server-only";
import { randomBytes } from "node:crypto";

// Seam isolado da Asaas (ver docs/PRD.md 4.3) — hoje mockado (sem SDK/credencial
// confirmada), mas no formato de retorno que a integração real vai produzir.
// Trocar o corpo desta função por uma chamada real à API da Asaas é a ÚNICA
// mudança necessária pra sair do modo mockado — nada mais no app depende disso.

export type MetodoCobranca = "pix" | "cartao" | "boleto";

export type CobrancaAsaas = {
  asaasId: string;
  linkOuQrCode: string;
  status: "pendente";
};

export async function criarCobrancaAsaas(input: {
  valorCentavos: number;
  metodo: MetodoCobranca;
  clienteNome: string;
  clienteEmail: string;
  projetoId: string;
}): Promise<CobrancaAsaas> {
  const asaasId = `mock_${randomBytes(8).toString("hex")}`;

  const linkOuQrCode =
    input.metodo === "pix"
      ? "00020126580014BR.GOV.BCB.PIX...stokys-mock...5204000053039865802BR"
      : input.metodo === "boleto"
        ? "34191.79001 01043.510047 91020.150008 1 96380000000000"
        : `https://mock.asaas.com/checkout/${asaasId}`;

  return { asaasId, linkOuQrCode, status: "pendente" };
}

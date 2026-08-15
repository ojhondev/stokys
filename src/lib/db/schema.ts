import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// Ver docs/PRD.md, seção 5 (Modelo de dados) e seção 3 (Planos).

// Hierarquia da equipe Stokys: master (dono, único que gerencia contas de
// equipe) > admin (gestor operacional, vê/opera todos os projetos) > producao
// (só os projetos atribuídos via projetos.responsavelId). cliente e parceiro
// são papéis externos; lead fica reservado (sem uso ainda nesta fase).
export const papelUsuarioEnum = pgEnum("papel_usuario", [
  "lead",
  "cliente",
  "producao",
  "admin",
  "master",
  "parceiro",
]);

export const nomePlanoEnum = pgEnum("nome_plano", ["zen", "pro", "customizado"]);

export const plataformaEnum = pgEnum("plataforma", ["shopify", "nuvemshop"]);

// Só relevante para planos Zen/Pro — Customizado usa personalizacoes.mercadoAlvo
// pra definir o template em vez de um tema pronto (ver docs/PRD.md seção 3).
export const temaEnum = pgEnum("tema", ["spark", "quart"]);

export const mercadoAlvoEnum = pgEnum("mercado_alvo", ["brasil", "global", "latam"]);

export const statusProjetoEnum = pgEnum("status_projeto", [
  "onboarding",
  "aguardando_pagamento",
  "em_producao",
  "preview_disponivel",
  "entregue",
]);

export const metodoCobrancaEnum = pgEnum("metodo_cobranca", ["pix", "cartao", "boleto"]);

export const statusCobrancaEnum = pgEnum("status_cobranca", [
  "pendente",
  "pago",
  "expirado",
  "estornado",
]);

export const usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  papel: papelUsuarioEnum("papel").notNull(),
  nome: text("nome").notNull(),
  email: text("email").notNull().unique(),
  senhaHash: text("senha_hash"),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
});

// Escopo e preço de cada plano ficam aqui, editáveis pelo admin — não hardcoded
// no código (ver docs/PRD.md seção 3, valores de preço ainda em aberto).
export const planos = pgTable("planos", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: nomePlanoEnum("nome").notNull().unique(),
  precoCentavos: integer("preco_centavos"),
  escopo: jsonb("escopo").notNull(),
  ativo: boolean("ativo").notNull().default(true),
});

export const projetos = pgTable("projetos", {
  id: uuid("id").primaryKey().defaultRandom(),
  clienteId: uuid("cliente_id")
    .notNull()
    .references(() => usuarios.id),
  planoId: uuid("plano_id")
    .notNull()
    .references(() => planos.id),
  // Cópia do preço no momento da compra — não é uma referência viva a `planos.precoCentavos`
  // (mudar o preço do plano depois não afeta projetos já fechados).
  precoNoMomentoDaCompraCentavos: integer("preco_no_momento_da_compra_centavos").notNull(),
  plataforma: plataformaEnum("plataforma").notNull(),
  status: statusProjetoEnum("status").notNull().default("onboarding"),
  tema: temaEnum("tema"),
  nicho: text("nicho").notNull(),
  referencias: jsonb("referencias").$type<string[]>().notNull(),
  // Membro da produção responsável — define o que um usuário papel "producao" enxerga.
  responsavelId: uuid("responsavel_id").references(() => usuarios.id),
  mentoriaViscaleAgendadaEm: timestamp("mentoria_viscale_agendada_em", {
    withTimezone: true,
  }),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
  atualizadoEm: timestamp("atualizado_em", { withTimezone: true }).notNull().defaultNow(),
});

// Acessos da plataforma (Shopify/Nuvemshop) coletados no onboarding — ver
// docs/PRD.md seção 4.2.1: tratado como segredo, nunca texto puro em repouso.
export const acessosPlataforma = pgTable("acessos_plataforma", {
  id: uuid("id").primaryKey().defaultRandom(),
  projetoId: uuid("projeto_id")
    .notNull()
    .unique()
    .references(() => projetos.id),
  usuarioAcesso: text("usuario_acesso").notNull(),
  segredoCriptografado: text("segredo_criptografado").notNull(),
  observacoes: text("observacoes"),
  revogadoEm: timestamp("revogado_em", { withTimezone: true }),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
});

// Só preenchido para projetos do plano Customizado.
export const personalizacoes = pgTable("personalizacoes", {
  id: uuid("id").primaryKey().defaultRandom(),
  projetoId: uuid("projeto_id")
    .notNull()
    .unique()
    .references(() => projetos.id),
  mercadoAlvo: mercadoAlvoEnum("mercado_alvo").notNull(),
  logoUrl: text("logo_url"),
  paletaCores: jsonb("paleta_cores").$type<string[]>(),
});

export const cobrancas = pgTable("cobrancas", {
  id: uuid("id").primaryKey().defaultRandom(),
  projetoId: uuid("projeto_id")
    .notNull()
    .references(() => projetos.id),
  metodo: metodoCobrancaEnum("metodo").notNull(),
  status: statusCobrancaEnum("status").notNull().default("pendente"),
  valorCentavos: integer("valor_centavos").notNull(),
  asaasId: text("asaas_id"),
  linkOuQrCode: text("link_ou_qr_code"),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
  pagoEm: timestamp("pago_em", { withTimezone: true }),
});

export const snapshots = pgTable("snapshots", {
  id: uuid("id").primaryKey().defaultRandom(),
  projetoId: uuid("projeto_id")
    .notNull()
    .references(() => projetos.id),
  url: text("url").notNull(),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
});

export const mensagens = pgTable("mensagens", {
  id: uuid("id").primaryKey().defaultRandom(),
  projetoId: uuid("projeto_id")
    .notNull()
    .references(() => projetos.id),
  autorId: uuid("autor_id")
    .notNull()
    .references(() => usuarios.id),
  texto: text("texto").notNull(),
  anexoUrl: text("anexo_url"),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
});

// Vitrine pública de parceiros — sem vínculo com Projeto (ver PRD seção 4.6).
export const parceiros = pgTable("parceiros", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: text("nome").notNull(),
  especialidade: text("especialidade").notNull(),
  fotoUrl: text("foto_url"),
  linkWhatsapp: text("link_whatsapp").notNull(),
  ativo: boolean("ativo").notNull().default(true),
});

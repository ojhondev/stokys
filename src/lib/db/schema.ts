import {
  boolean,
  date,
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

export const plataformaEnum = pgEnum("plataforma", [
  "shopify",
  "nuvemshop",
  "tray",
  "bagy",
  "outra",
]);

// Só relevante para planos Zen/Pro — Customizado usa personalizacoes.mercadoAlvo
// pra definir o template em vez de um tema pronto (ver docs/PRD.md seção 3).
export const temaEnum = pgEnum("tema", ["spark", "quant"]);

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

export const tipoTokenEnum = pgEnum("tipo_token", ["verificacao_email", "reset_senha"]);

export const tipoItemProjetoEnum = pgEnum("tipo_item_projeto", ["plano_base", "upsell"]);

export const responsavelTarefaEnum = pgEnum("responsavel_tarefa", ["cliente", "stokys"]);

export const tipoSolicitacaoEnum = pgEnum("tipo_solicitacao", [
  "alteracao",
  "informacao",
  "conteudo",
]);

export const statusSolicitacaoEnum = pgEnum("status_solicitacao", [
  "aberta",
  "em_andamento",
  "concluida",
]);

export const statusRevisaoEnum = pgEnum("status_revisao", [
  "pendente",
  "aprovado",
  "mudancas_solicitadas",
]);

export const usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  papel: papelUsuarioEnum("papel").notNull(),
  nome: text("nome").notNull(),
  // Só preenchido por clientes (coletado no cadastro) — usado pra exibir
  // "sua loja" pelo nome em vez de só o nome do plano dentro do app.
  nomeDaLoja: text("nome_da_loja"),
  email: text("email").notNull().unique(),
  senhaHash: text("senha_hash"),
  // Verificação por e-mail — nunca vai pro cookie de sessão (ver src/lib/auth.ts),
  // é lido do banco nas telas/ações que importam (dashboard, pagamento).
  emailVerificado: boolean("email_verificado").notNull().default(false),
  // Id estável do Google (sub do id_token) — login social vincula por aqui,
  // não só por e-mail (ver src/lib/oauth/google.ts).
  googleSub: text("google_sub").unique(),
  avatarUrl: text("avatar_url"),
  ultimoEnvioVerificacaoEm: timestamp("ultimo_envio_verificacao_em", { withTimezone: true }),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
});

// Token de verificação de e-mail / reset de senha — guarda só o hash SHA-256
// (ver src/lib/verificacao.ts), nunca o token em texto puro.
export const tokensVerificacao = pgTable("tokens_verificacao", {
  id: uuid("id").primaryKey().defaultRandom(),
  usuarioId: uuid("usuario_id")
    .notNull()
    .references(() => usuarios.id),
  tipo: tipoTokenEnum("tipo").notNull(),
  tokenHash: text("token_hash").notNull().unique(),
  expiraEm: timestamp("expira_em", { withTimezone: true }).notNull(),
  usadoEm: timestamp("usado_em", { withTimezone: true }),
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
  // Só preenchido quando plataforma = "outra" — nome livre digitado pelo cliente.
  plataformaOutraNome: text("plataforma_outra_nome"),
  status: statusProjetoEnum("status").notNull().default("onboarding"),
  tema: temaEnum("tema"),
  nicho: text("nicho").notNull(),
  referencias: jsonb("referencias").$type<string[]>().notNull(),
  // O que o cliente quer pro projeto, com base nas referências que ele listou.
  objetivoCliente: text("objetivo_cliente"),
  // Membro da produção responsável — define o que um usuário papel "producao" enxerga.
  responsavelId: uuid("responsavel_id").references(() => usuarios.id),
  mentoriaViscaleAgendadaEm: timestamp("mentoria_viscale_agendada_em", {
    withTimezone: true,
  }),
  // Visão geral — setados pela equipe, não pelo cliente (ver admin/projetos/[id]).
  prazoEstimadoDias: integer("prazo_estimado_dias"),
  proximaAcao: text("proxima_acao"),
  // Briefing — editados pelo cliente depois do onboarding (dashboard/briefing).
  identidadeDriveUrl: text("identidade_drive_url"),
  publico: text("publico"),
  posicionamento: text("posicionamento"),
  // Informações da loja — editado pelo cliente em dashboard/configuracoes.
  dominio: text("dominio"),
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

// Vitrine de parceiros, agora dentro do dashboard autenticado — sem vínculo
// com Projeto, só vitrine + WhatsApp (ver PRD seção 4.6 e 10.6: sem rastreio
// de lead dentro da plataforma). usuarioId é nullable pra não quebrar linhas
// cadastradas manualmente pelo admin antes do cadastro de parceiro existir.
export const parceiros = pgTable("parceiros", {
  id: uuid("id").primaryKey().defaultRandom(),
  usuarioId: uuid("usuario_id")
    .unique()
    .references(() => usuarios.id),
  nome: text("nome").notNull(),
  especialidade: text("especialidade").notNull(),
  descricao: text("descricao"),
  fotoUrl: text("foto_url"),
  linkWhatsapp: text("link_whatsapp").notNull(),
  ativo: boolean("ativo").notNull().default(true),
  aprovadoEm: timestamp("aprovado_em", { withTimezone: true }),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
});

// Upsells administráveis pelo admin/master — mesmo padrão de `planos` (não
// hardcoded no código). Ver docs do plano V1, "Pagamentos com upsells".
export const catalogoUpsells = pgTable("catalogo_upsells", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: text("nome").notNull(),
  descricao: text("descricao"),
  valorCentavos: integer("valor_centavos").notNull(),
  ativo: boolean("ativo").notNull().default(true),
  ordem: integer("ordem").notNull().default(0),
});

// Itens de um projeto (plano base + upsells comprados). Saldo em aberto =
// soma dos itens com cobrancaId nulo. O plano base também vira uma linha
// aqui na criação do projeto, pra upsell e plano base seguirem o mesmo
// caminho de código em vez de um caso especial.
export const projetoItens = pgTable("projeto_itens", {
  id: uuid("id").primaryKey().defaultRandom(),
  projetoId: uuid("projeto_id")
    .notNull()
    .references(() => projetos.id),
  tipo: tipoItemProjetoEnum("tipo").notNull(),
  catalogoUpsellId: uuid("catalogo_upsell_id").references(() => catalogoUpsells.id),
  descricao: text("descricao").notNull(),
  // Cópia do valor no momento — mesma regra do precoNoMomentoDaCompraCentavos.
  valorCentavos: integer("valor_centavos").notNull(),
  cobrancaId: uuid("cobranca_id").references(() => cobrancas.id),
  criadoPorId: uuid("criado_por_id")
    .notNull()
    .references(() => usuarios.id),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
});

// Módulo Tarefas — pendências do cliente e da Stokys, cada uma marcada como
// concluída só pelo lado a quem ela pertence.
export const tarefas = pgTable("tarefas", {
  id: uuid("id").primaryKey().defaultRandom(),
  projetoId: uuid("projeto_id")
    .notNull()
    .references(() => projetos.id),
  titulo: text("titulo").notNull(),
  responsavel: responsavelTarefaEnum("responsavel").notNull(),
  concluida: boolean("concluida").notNull().default(false),
  criadoPorId: uuid("criado_por_id")
    .notNull()
    .references(() => usuarios.id),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
});

// Módulo Solicitações — separado do chat livre (mensagens) porque precisa de
// tipo+status próprios pra virar uma lista rastreável.
export const solicitacoes = pgTable("solicitacoes", {
  id: uuid("id").primaryKey().defaultRandom(),
  projetoId: uuid("projeto_id")
    .notNull()
    .references(() => projetos.id),
  tipo: tipoSolicitacaoEnum("tipo").notNull(),
  texto: text("texto").notNull(),
  status: statusSolicitacaoEnum("status").notNull().default("aberta"),
  criadoPorId: uuid("criado_por_id")
    .notNull()
    .references(() => usuarios.id),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
});

// Módulo Revisões — versões entregues pela equipe, aprovadas ou com mudança
// pedida pelo cliente. Reusa o mesmo seam de upload das mensagens.
export const revisoes = pgTable("revisoes", {
  id: uuid("id").primaryKey().defaultRandom(),
  projetoId: uuid("projeto_id")
    .notNull()
    .references(() => projetos.id),
  titulo: text("titulo").notNull(),
  linkOuArquivoUrl: text("link_ou_arquivo_url").notNull(),
  status: statusRevisaoEnum("status").notNull().default("pendente"),
  criadoPorId: uuid("criado_por_id")
    .notNull()
    .references(() => usuarios.id),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
});

export const revisaoComentarios = pgTable("revisao_comentarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  revisaoId: uuid("revisao_id")
    .notNull()
    .references(() => revisoes.id),
  autorId: uuid("autor_id")
    .notNull()
    .references(() => usuarios.id),
  texto: text("texto").notNull(),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
});

// Módulo Histórico — log cronológico simples, só leitura. Populado por
// registrarEvento() a partir de mudança de status, tarefa, solicitação e revisão.
export const eventos = pgTable("eventos", {
  id: uuid("id").primaryKey().defaultRandom(),
  projetoId: uuid("projeto_id")
    .notNull()
    .references(() => projetos.id),
  descricao: text("descricao").notNull(),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
});

// Leads do pop-up de vídeo da LP (ver components/marketing/video-popup.tsx)
// — captura simples de contato, sem fluxo de aprovação/conta associada.
export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: text("nome").notNull(),
  whatsapp: text("whatsapp").notNull(),
  email: text("email").notNull(),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
});

// Curadoria semanal do admin/master — mostrado no dashboard do cliente.
export const produtosVencedores = pgTable("produtos_vencedores", {
  id: uuid("id").primaryKey().defaultRandom(),
  semanaInicio: date("semana_inicio").notNull().unique(),
  nome: text("nome").notNull(),
  imagemUrl: text("imagem_url"),
  nicho: text("nicho"),
  porqueVence: text("porque_vence").notNull(),
  linkFornecedor: text("link_fornecedor"),
  publicado: boolean("publicado").notNull().default(false),
  criadoPorId: uuid("criado_por_id")
    .notNull()
    .references(() => usuarios.id),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
});

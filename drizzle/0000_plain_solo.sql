CREATE TYPE "public"."mercado_alvo" AS ENUM('brasil', 'global', 'latam');--> statement-breakpoint
CREATE TYPE "public"."metodo_cobranca" AS ENUM('pix', 'cartao', 'boleto');--> statement-breakpoint
CREATE TYPE "public"."nome_plano" AS ENUM('zen', 'pro', 'customizado');--> statement-breakpoint
CREATE TYPE "public"."papel_usuario" AS ENUM('lead', 'cliente', 'producao', 'admin', 'parceiro');--> statement-breakpoint
CREATE TYPE "public"."plataforma" AS ENUM('shopify', 'nuvemshop');--> statement-breakpoint
CREATE TYPE "public"."status_cobranca" AS ENUM('pendente', 'pago', 'expirado', 'estornado');--> statement-breakpoint
CREATE TYPE "public"."status_projeto" AS ENUM('onboarding', 'aguardando_pagamento', 'em_producao', 'preview_disponivel', 'entregue');--> statement-breakpoint
CREATE TABLE "acessos_plataforma" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"projeto_id" uuid NOT NULL,
	"usuario_acesso" text NOT NULL,
	"segredo_criptografado" text NOT NULL,
	"observacoes" text,
	"revogado_em" timestamp with time zone,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "acessos_plataforma_projeto_id_unique" UNIQUE("projeto_id")
);
--> statement-breakpoint
CREATE TABLE "cobrancas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"projeto_id" uuid NOT NULL,
	"metodo" "metodo_cobranca" NOT NULL,
	"status" "status_cobranca" DEFAULT 'pendente' NOT NULL,
	"valor_centavos" integer NOT NULL,
	"asaas_id" text,
	"link_ou_qr_code" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"pago_em" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "mensagens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"projeto_id" uuid NOT NULL,
	"autor_id" uuid NOT NULL,
	"texto" text NOT NULL,
	"anexo_url" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parceiros" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"especialidade" text NOT NULL,
	"foto_url" text,
	"link_whatsapp" text NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personalizacoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"projeto_id" uuid NOT NULL,
	"mercado_alvo" "mercado_alvo" NOT NULL,
	"logo_url" text,
	"paleta_cores" jsonb,
	CONSTRAINT "personalizacoes_projeto_id_unique" UNIQUE("projeto_id")
);
--> statement-breakpoint
CREATE TABLE "planos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" "nome_plano" NOT NULL,
	"preco_centavos" integer,
	"escopo" jsonb NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	CONSTRAINT "planos_nome_unique" UNIQUE("nome")
);
--> statement-breakpoint
CREATE TABLE "projetos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cliente_id" uuid NOT NULL,
	"plano_id" uuid NOT NULL,
	"preco_no_momento_da_compra_centavos" integer NOT NULL,
	"plataforma" "plataforma" NOT NULL,
	"status" "status_projeto" DEFAULT 'onboarding' NOT NULL,
	"mentoria_viscale_agendada_em" timestamp with time zone,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"projeto_id" uuid NOT NULL,
	"url" text NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"papel" "papel_usuario" NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"senha_hash" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "usuarios_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "acessos_plataforma" ADD CONSTRAINT "acessos_plataforma_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cobrancas" ADD CONSTRAINT "cobrancas_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_autor_id_usuarios_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personalizacoes" ADD CONSTRAINT "personalizacoes_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projetos" ADD CONSTRAINT "projetos_cliente_id_usuarios_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projetos" ADD CONSTRAINT "projetos_plano_id_planos_id_fk" FOREIGN KEY ("plano_id") REFERENCES "public"."planos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "snapshots" ADD CONSTRAINT "snapshots_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE no action ON UPDATE no action;
CREATE TYPE "public"."tipo_item_projeto" AS ENUM('plano_base', 'upsell');--> statement-breakpoint
CREATE TYPE "public"."tipo_token" AS ENUM('verificacao_email', 'reset_senha');--> statement-breakpoint
CREATE TABLE "catalogo_upsells" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"descricao" text,
	"valor_centavos" integer NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"ordem" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "produtos_vencedores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"semana_inicio" date NOT NULL,
	"nome" text NOT NULL,
	"imagem_url" text,
	"nicho" text,
	"porque_vence" text NOT NULL,
	"link_fornecedor" text,
	"publicado" boolean DEFAULT false NOT NULL,
	"criado_por_id" uuid NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "produtos_vencedores_semana_inicio_unique" UNIQUE("semana_inicio")
);
--> statement-breakpoint
CREATE TABLE "projeto_itens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"projeto_id" uuid NOT NULL,
	"tipo" "tipo_item_projeto" NOT NULL,
	"catalogo_upsell_id" uuid,
	"descricao" text NOT NULL,
	"valor_centavos" integer NOT NULL,
	"cobranca_id" uuid,
	"criado_por_id" uuid NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tokens_verificacao" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid NOT NULL,
	"tipo" "tipo_token" NOT NULL,
	"token_hash" text NOT NULL,
	"expira_em" timestamp with time zone NOT NULL,
	"usado_em" timestamp with time zone,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tokens_verificacao_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
ALTER TABLE "parceiros" ADD COLUMN "usuario_id" uuid;--> statement-breakpoint
ALTER TABLE "parceiros" ADD COLUMN "descricao" text;--> statement-breakpoint
ALTER TABLE "parceiros" ADD COLUMN "aprovado_em" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "parceiros" ADD COLUMN "criado_em" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN "email_verificado" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN "google_sub" text;--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN "ultimo_envio_verificacao_em" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "produtos_vencedores" ADD CONSTRAINT "produtos_vencedores_criado_por_id_usuarios_id_fk" FOREIGN KEY ("criado_por_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projeto_itens" ADD CONSTRAINT "projeto_itens_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projeto_itens" ADD CONSTRAINT "projeto_itens_catalogo_upsell_id_catalogo_upsells_id_fk" FOREIGN KEY ("catalogo_upsell_id") REFERENCES "public"."catalogo_upsells"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projeto_itens" ADD CONSTRAINT "projeto_itens_cobranca_id_cobrancas_id_fk" FOREIGN KEY ("cobranca_id") REFERENCES "public"."cobrancas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projeto_itens" ADD CONSTRAINT "projeto_itens_criado_por_id_usuarios_id_fk" FOREIGN KEY ("criado_por_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tokens_verificacao" ADD CONSTRAINT "tokens_verificacao_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parceiros" ADD CONSTRAINT "parceiros_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parceiros" ADD CONSTRAINT "parceiros_usuario_id_unique" UNIQUE("usuario_id");--> statement-breakpoint
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_google_sub_unique" UNIQUE("google_sub");
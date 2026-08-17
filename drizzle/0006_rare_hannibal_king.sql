CREATE TYPE "public"."responsavel_tarefa" AS ENUM('cliente', 'stokys');--> statement-breakpoint
CREATE TYPE "public"."status_revisao" AS ENUM('pendente', 'aprovado', 'mudancas_solicitadas');--> statement-breakpoint
CREATE TYPE "public"."status_solicitacao" AS ENUM('aberta', 'em_andamento', 'concluida');--> statement-breakpoint
CREATE TYPE "public"."tipo_solicitacao" AS ENUM('alteracao', 'informacao', 'conteudo');--> statement-breakpoint
CREATE TABLE "eventos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"projeto_id" uuid NOT NULL,
	"descricao" text NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revisao_comentarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"revisao_id" uuid NOT NULL,
	"autor_id" uuid NOT NULL,
	"texto" text NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revisoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"projeto_id" uuid NOT NULL,
	"titulo" text NOT NULL,
	"link_ou_arquivo_url" text NOT NULL,
	"status" "status_revisao" DEFAULT 'pendente' NOT NULL,
	"criado_por_id" uuid NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "solicitacoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"projeto_id" uuid NOT NULL,
	"tipo" "tipo_solicitacao" NOT NULL,
	"texto" text NOT NULL,
	"status" "status_solicitacao" DEFAULT 'aberta' NOT NULL,
	"criado_por_id" uuid NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tarefas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"projeto_id" uuid NOT NULL,
	"titulo" text NOT NULL,
	"responsavel" "responsavel_tarefa" NOT NULL,
	"concluida" boolean DEFAULT false NOT NULL,
	"criado_por_id" uuid NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "projetos" ADD COLUMN "prazo_estimado_dias" integer;--> statement-breakpoint
ALTER TABLE "projetos" ADD COLUMN "proxima_acao" text;--> statement-breakpoint
ALTER TABLE "projetos" ADD COLUMN "identidade_drive_url" text;--> statement-breakpoint
ALTER TABLE "projetos" ADD COLUMN "publico" text;--> statement-breakpoint
ALTER TABLE "projetos" ADD COLUMN "posicionamento" text;--> statement-breakpoint
ALTER TABLE "projetos" ADD COLUMN "dominio" text;--> statement-breakpoint
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revisao_comentarios" ADD CONSTRAINT "revisao_comentarios_revisao_id_revisoes_id_fk" FOREIGN KEY ("revisao_id") REFERENCES "public"."revisoes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revisao_comentarios" ADD CONSTRAINT "revisao_comentarios_autor_id_usuarios_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revisoes" ADD CONSTRAINT "revisoes_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revisoes" ADD CONSTRAINT "revisoes_criado_por_id_usuarios_id_fk" FOREIGN KEY ("criado_por_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solicitacoes" ADD CONSTRAINT "solicitacoes_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solicitacoes" ADD CONSTRAINT "solicitacoes_criado_por_id_usuarios_id_fk" FOREIGN KEY ("criado_por_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_criado_por_id_usuarios_id_fk" FOREIGN KEY ("criado_por_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;
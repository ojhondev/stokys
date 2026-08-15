CREATE TYPE "public"."tema" AS ENUM('spark', 'quart');--> statement-breakpoint
ALTER TYPE "public"."papel_usuario" ADD VALUE 'master' BEFORE 'parceiro';--> statement-breakpoint
ALTER TABLE "projetos" ADD COLUMN "tema" "tema";--> statement-breakpoint
ALTER TABLE "projetos" ADD COLUMN "nicho" text NOT NULL;--> statement-breakpoint
ALTER TABLE "projetos" ADD COLUMN "referencias" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "projetos" ADD COLUMN "responsavel_id" uuid;--> statement-breakpoint
ALTER TABLE "projetos" ADD CONSTRAINT "projetos_responsavel_id_usuarios_id_fk" FOREIGN KEY ("responsavel_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;
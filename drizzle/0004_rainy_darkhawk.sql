ALTER TYPE "public"."plataforma" ADD VALUE 'tray';--> statement-breakpoint
ALTER TYPE "public"."plataforma" ADD VALUE 'bagy';--> statement-breakpoint
ALTER TYPE "public"."plataforma" ADD VALUE 'outra';--> statement-breakpoint
ALTER TABLE "projetos" ADD COLUMN "plataforma_outra_nome" text;
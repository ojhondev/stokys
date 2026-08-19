ALTER TABLE "leads" ADD COLUMN "projeto_id" uuid;--> statement-breakpoint
ALTER TABLE "projetos" ADD COLUMN "arquivado" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE set null ON UPDATE no action;
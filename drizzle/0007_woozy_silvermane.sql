CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"whatsapp" text NOT NULL,
	"email" text NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);

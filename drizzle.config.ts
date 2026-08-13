import { defineConfig } from "drizzle-kit";

// drizzle-kit (fora do Next.js) não carrega .env.local sozinho.
process.loadEnvFile?.(".env.local");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definida — copie .env.local.example para .env.local");
}

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});

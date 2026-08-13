import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Conexão criada sob demanda (não no import do módulo) para não quebrar o
// build antes do Neon estar provisionado — ver .env.local.example.
let cached: NeonHttpDatabase<typeof schema> | null = null;

export function getDb(): NeonHttpDatabase<typeof schema> {
  if (cached) return cached;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL não definida — copie .env.local.example para .env.local");
  }

  cached = drizzle(neon(url), { schema });
  return cached;
}

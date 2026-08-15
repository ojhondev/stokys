import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Worktrees criados por agentes isolados (ver Agent tool, isolation: "worktree")
    // ficam aninhados dentro do projeto — nunca lintar o build deles.
    ".claude/worktrees/**",
  ]),
]);

export default eslintConfig;

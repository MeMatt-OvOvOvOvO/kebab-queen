import path from "path";
import { defineConfig } from "prisma/config";

const url = process.env.TURSO_DATABASE_URL
  ? process.env.TURSO_DATABASE_URL
  : `file:${path.resolve("prisma/dev.db")}`;

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url,
  },
  migrations: {
    seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
  },
});

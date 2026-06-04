import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

function createPrismaClient() {
  // Produkcja (Vercel): używaj Turso
  // Development: lokalny SQLite
  const url =
    process.env.TURSO_DATABASE_URL ??
    `file://${path.resolve(process.cwd(), "prisma/dev.db")}`;

  const authToken = process.env.TURSO_AUTH_TOKEN; // undefined dla SQLite (ok)

  const adapter = new PrismaLibSql({ url, authToken });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

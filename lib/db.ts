import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

function createPrismaClient() {
  // libsql wymaga file:/// dla ścieżek absolutnych
  const dbPath = path.resolve(process.cwd(), "prisma/dev.db");
  const url = `file://${dbPath}`; // file:// + /absolutna/sciezka = file:///absolutna/sciezka
  const adapter = new PrismaLibSql({ url });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

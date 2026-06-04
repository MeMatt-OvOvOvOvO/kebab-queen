/**
 * Skrypt dodający historię transakcji do konta demo (123456789).
 * Uruchomienie: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed-demo.ts
 */
import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const dbPath = path.resolve(process.cwd(), "prisma/dev.db");
const adapter = new PrismaLibSql({ url: `file://${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.findUnique({
    where: { phone: "123456789" },
    include: { loyaltyAccount: true },
  });

  if (!user) {
    console.error("❌ Nie znaleziono konta demo (telefon: 123456789)");
    process.exit(1);
  }

  console.log(`Demo user: ${user.id}`);

  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000);

  const txData = [
    { points: 50,  type: "EARN",     description: "Kebab klasyczny",                createdAt: daysAgo(30) },
    { points: 40,  type: "EARN",     description: "Frytki z serem",                 createdAt: daysAgo(27) },
    { points: 50,  type: "EARN",     description: "Kebab klasyczny",                createdAt: daysAgo(25) },
    { points: 200, type: "REDEEM",   description: "Wymiana: Frytki z serem",        createdAt: daysAgo(22) },
    { points: 45,  type: "EARN",     description: "Kebab ostry",                    createdAt: daysAgo(20) },
    { points: 50,  type: "EARN",     description: "Kebab klasyczny",                createdAt: daysAgo(18) },
    { points: 40,  type: "EARN",     description: "Kebab wege",                     createdAt: daysAgo(15) },
    { points: 20,  type: "REFERRAL", description: "Zaproszenie: 555666777",         createdAt: daysAgo(14) },
    { points: 50,  type: "EARN",     description: "Kebab klasyczny",                createdAt: daysAgo(11) },
    { points: 45,  type: "EARN",     description: "Doner box",                      createdAt: daysAgo(9)  },
    { points: 100, type: "EARN",     description: "Kebab klasyczny (Happy Hours ×2)", createdAt: daysAgo(6) },
    { points: 50,  type: "EARN",     description: "Kebab klasyczny",                createdAt: daysAgo(4)  },
  ];

  // Usuń stare demo transakcje żeby nie duplikować
  await prisma.transaction.deleteMany({
    where: { userId: user.id },
  });

  // Dodaj nowe
  await prisma.transaction.createMany({
    data: txData.map((tx) => ({ ...tx, userId: user.id })),
  });

  // Przelicz saldo
  const earn = txData
    .filter((t) => t.type === "EARN" || t.type === "REFERRAL")
    .reduce((s, t) => s + t.points, 0);
  const redeem = txData
    .filter((t) => t.type === "REDEEM")
    .reduce((s, t) => s + t.points, 0);
  const balance = earn - redeem;

  const tier =
    balance >= 2100 ? 7 :
    balance >= 1500 ? 6 :
    balance >= 1000 ? 5 :
    balance >= 600  ? 4 :
    balance >= 300  ? 3 :
    balance >= 100  ? 2 : 1;

  await prisma.loyaltyAccount.update({
    where: { userId: user.id },
    data: { balance, tier },
  });

  console.log(`✅ Gotowe! Saldo: ${balance} KM, Tier: ${tier}, Transakcji: ${txData.length}`);
  console.log(`   "To co zwykle?" pokaże: Kebab klasyczny (5x)`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

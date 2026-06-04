import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

// GET /api/user/usual — najczęściej zamawiany produkt z historii transakcji
export async function GET() {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.userId, type: "EARN" },
    select: { description: true },
  });

  if (!transactions.length) return NextResponse.json({ usual: null });

  // Zlicz opisy i znajdź najczęstszy
  const counts = transactions.reduce<Record<string, number>>((acc, tx) => {
    const key = tx.description.split(" (")[0].trim(); // usuń suffix "(Happy Hours)"
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const usual = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  return NextResponse.json({ usual });
}

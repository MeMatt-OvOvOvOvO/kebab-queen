import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { loyaltyAccount: true },
  });

  if (!user)
    return NextResponse.json(
      { error: "Nie znaleziono użytkownika" },
      { status: 404 },
    );

  return NextResponse.json({
    id: user.id,
    phone: user.phone,
    name: user.name,
    referralCode: user.referralCode,
    createdAt: user.createdAt,
    loyalty: user.loyaltyAccount
      ? { balance: user.loyaltyAccount.balance, tier: user.loyaltyAccount.tier }
      : { balance: 0, tier: 1 },
  });
}

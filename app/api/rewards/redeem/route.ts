import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });

  const body = await request.json();
  const { rewardId } = body;
  if (!rewardId)
    return NextResponse.json({ error: "Wymagane rewardId" }, { status: 400 });

  const [reward, account] = await Promise.all([
    prisma.reward.findUnique({ where: { id: rewardId } }),
    prisma.loyaltyAccount.findUnique({ where: { userId: session.userId } }),
  ]);

  if (!reward || !reward.isAvailable) {
    return NextResponse.json({ error: "Nagroda niedostępna" }, { status: 404 });
  }
  if (!account || account.balance < reward.pointsCost) {
    return NextResponse.json({ error: "Za mało Kul Mocy" }, { status: 400 });
  }

  const [tx] = await prisma.$transaction([
    prisma.transaction.create({
      data: {
        userId: session.userId,
        points: -reward.pointsCost,
        type: "REDEEM",
        description: `Nagroda: ${reward.name}`,
      },
    }),
    prisma.loyaltyAccount.update({
      where: { userId: session.userId },
      data: { balance: { decrement: reward.pointsCost } },
    }),
  ]);

  return NextResponse.json({
    transaction: tx,
    reward: reward.name,
    spent: reward.pointsCost,
  });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getActiveMultiplier } from "@/lib/happy-hours";

// POST /api/transactions — używane przez panel admina do ręcznego dodawania punktów
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, points, description } = body;

  if (!userId || typeof points !== "number" || points <= 0) {
    return NextResponse.json(
      { error: "Wymagane: userId, points (> 0)" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { loyaltyAccount: true },
  });
  if (!user)
    return NextResponse.json(
      { error: "Nie znaleziono użytkownika" },
      { status: 404 },
    );

  const { multiplier, label } = await getActiveMultiplier();
  const earned = Math.round(points * multiplier);
  const desc = label
    ? `${description ?? "Zakup"} (${label})`
    : (description ?? "Zakup");

  const [tx] = await prisma.$transaction([
    prisma.transaction.create({
      data: { userId, points: earned, type: "EARN", description: desc },
    }),
    prisma.loyaltyAccount.update({
      where: { userId },
      data: { balance: { increment: earned } },
    }),
  ]);

  return NextResponse.json({ transaction: tx, multiplier, earned });
}

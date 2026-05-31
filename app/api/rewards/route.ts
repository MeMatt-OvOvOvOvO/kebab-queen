import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const rewards = await prisma.reward.findMany({
    where: { isAvailable: true },
    orderBy: { pointsCost: "asc" },
  });
  return NextResponse.json(rewards);
}

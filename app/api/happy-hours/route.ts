import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getActiveMultiplier } from "@/lib/happy-hours";

export async function GET() {
  const [all, active] = await Promise.all([
    prisma.happyHour.findMany({
      where: { isActive: true },
      orderBy: { dayOfWeek: "asc" },
    }),
    getActiveMultiplier(),
  ]);

  return NextResponse.json({
    active: active.multiplier > 1 ? active : null,
    schedule: all,
  });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getActiveMultiplier } from "@/lib/happy-hours";

export async function GET() {
  const all = await prisma.happyHour.findMany({
    where: { isActive: true },
    orderBy: { dayOfWeek: "asc" },
  });

  const active = await getActiveMultiplier();

  // Znajdź aktywny wpis żeby wyciągnąć czas końca
  let activeEntry: (typeof all)[0] | undefined;
  if (active.multiplier > 1) {
    const now = new Date();
    const day = now.getDay();
    const totalMin = now.getHours() * 60 + now.getMinutes();
    activeEntry = all.find((hh: (typeof all)[0]) => {
      const applies = hh.dayOfWeek === -1 || hh.dayOfWeek === day;
      if (!applies) return false;
      const start = hh.startHour * 60 + hh.startMin;
      const end = hh.endHour * 60 + hh.endMin;
      return totalMin >= start && totalMin < end;
    });
  }

  return NextResponse.json({
    active: active.multiplier > 1
      ? {
          multiplier: active.multiplier,
          label: active.label,
          endHour: activeEntry?.endHour ?? null,
          endMin: activeEntry?.endMin ?? null,
        }
      : null,
    schedule: all,
  });
}

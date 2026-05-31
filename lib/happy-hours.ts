import { prisma } from "./db";

export async function getActiveMultiplier(): Promise<{ multiplier: number; label: string | null }> {
  const now = new Date();
  const day = now.getDay(); // 0=Sun … 6=Sat
  const hour = now.getHours();
  const min = now.getMinutes();
  const totalMin = hour * 60 + min;

  const happyHours = await prisma.happyHour.findMany({ where: { isActive: true } });

  for (const hh of happyHours) {
    const applies = hh.dayOfWeek === -1 || hh.dayOfWeek === day;
    if (!applies) continue;

    const start = hh.startHour * 60 + hh.startMin;
    const end = hh.endHour * 60 + hh.endMin;
    if (totalMin >= start && totalMin < end) {
      return { multiplier: hh.multiplier, label: hh.label };
    }
  }

  return { multiplier: 1, label: null };
}

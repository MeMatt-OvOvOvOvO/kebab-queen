import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });

  const sp = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(sp.get("page") ?? "1", 10));
  const limit = Math.min(
    50,
    Math.max(1, parseInt(sp.get("limit") ?? "20", 10)),
  );
  const skip = (page - 1) * limit;

  const [total, items] = await Promise.all([
    prisma.transaction.count({ where: { userId: session.userId } }),
    prisma.transaction.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
  ]);

  return NextResponse.json({ total, page, limit, items });
}

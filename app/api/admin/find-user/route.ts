import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/admin/find-user?phone=123456789
export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get("phone")?.replace(/\s/g, "");

  if (!phone || phone.length < 9) {
    return NextResponse.json({ error: "Podaj numer telefonu" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { phone },
      include: { loyaltyAccount: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Nie znaleziono użytkownika" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      phone: user.phone,
      name: user.name,
      balance: user.loyaltyAccount?.balance ?? 0,
      tier: user.loyaltyAccount?.tier ?? 1,
    });
  } catch (err) {
    console.error("[GET /api/admin/find-user]", err);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const phone = (body.phone ?? "").replace(/\s/g, "");

  if (!phone || phone.length < 9) {
    return NextResponse.json({ error: "Podaj poprawny numer telefonu" }, { status: 400 });
  }

  let user = await prisma.user.findUnique({ where: { phone } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        phone,
        loyaltyAccount: { create: { balance: 0, tier: 1 } },
      },
    });
  }

  await createSession(user.id);

  return NextResponse.json({ id: user.id, phone: user.phone, name: user.name });
}

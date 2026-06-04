import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/session";

const REFERRAL_BONUS = 20;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = (body.phone ?? "").replace(/\s/g, "");

    if (!phone || phone.length < 9) {
      return NextResponse.json({ error: "Podaj poprawny numer telefonu" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { phone } });
    const isNewUser = !existingUser;

    let user = existingUser;

    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          loyaltyAccount: { create: { balance: 0, tier: 1 } },
        },
      });
    }

    // Obsługa referral — tylko dla nowych użytkowników
    if (isNewUser) {
      const cookieStore = await cookies();
      const refId = cookieStore.get("kq_ref")?.value;

      if (refId && refId !== user.id) {
        const referrer = await prisma.user.findUnique({
          where: { id: refId },
          include: { loyaltyAccount: true },
        });

        if (referrer?.loyaltyAccount) {
          await prisma.$transaction([
            // +20 KM dla zapraszającego
            prisma.transaction.create({
              data: {
                userId: referrer.id,
                points: REFERRAL_BONUS,
                type: "REFERRAL",
                description: `Zaproszenie: ${phone}`,
              },
            }),
            prisma.loyaltyAccount.update({
              where: { userId: referrer.id },
              data: { balance: { increment: REFERRAL_BONUS } },
            }),
            // +20 KM dla nowego użytkownika
            prisma.transaction.create({
              data: {
                userId: user.id,
                points: REFERRAL_BONUS,
                type: "REFERRAL",
                description: "Bonus za dołączenie przez zaproszenie",
              },
            }),
            prisma.loyaltyAccount.update({
              where: { userId: user.id },
              data: { balance: { increment: REFERRAL_BONUS } },
            }),
          ]);

          // Usuń cookie referralowe
          cookieStore.delete("kq_ref");
        }
      }
    }

    await createSession(user.id);

    return NextResponse.json({ id: user.id, phone: user.phone, name: user.name });
  } catch (err) {
    console.error("[POST /api/auth/login]", err);
    const message = err instanceof Error ? err.message : "Nieznany błąd";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

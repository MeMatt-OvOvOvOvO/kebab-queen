import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: `file:${path.resolve("prisma/dev.db")}`,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Products
  const products = [
    {
      name: "Kebab klasyczny",
      description:
        "Soczyste mięso z kurczaka, sałata, pomidor, ogórek, sos czosnkowy w cieście pita.",
      price: 22.0,
      calories: 580,
      tags: JSON.stringify([]),
      imageUrl: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&q=80",
    },
    {
      name: "Kebab wege",
      description:
        "Grillowane warzywa, hummus, rukola, pomidor, sos tahini w cieście pita.",
      price: 20.0,
      calories: 420,
      tags: JSON.stringify(["WEGE"]),
      imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    },
    {
      name: "Kebab ostry",
      description:
        "Mięso z kurczaka, papryczka chilli, jalapeño, ostry sos harissa.",
      price: 23.0,
      calories: 610,
      tags: JSON.stringify(["OSTRE"]),
      imageUrl: "https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=600&q=80",
    },
    {
      name: "Kebab bezglutenowy",
      description:
        "Mięso z kurczaka w ryżowej tortilli, sałata, pomidor, sos jogurtowy.",
      price: 24.0,
      calories: 490,
      tags: JSON.stringify(["BEZ_GLUTENU"]),
      imageUrl: "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=600&q=80",
    },
    {
      name: "Kebab amerykański",
      description:
        "Klasyczny kebab w zestawie z frytkami posypanymi stopionym serem cheddar.",
      price: 30.0,
      calories: 950,
      tags: JSON.stringify(["FRYTKI_Z_SEREM"]),
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
    },
    {
      name: "Duży Kebab Queen",
      description:
        "Podwójna porcja mięsa, podwójna porcja wszystkiego — dla prawdziwej królowej.",
      price: 34.0,
      calories: 1100,
      tags: JSON.stringify([]),
      imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80",
    },
    {
      name: "Kebab wegostry",
      description: "Warzywa z grilla, tofu w marynacie chilli, sos sriracha.",
      price: 22.0,
      calories: 460,
      tags: JSON.stringify(["WEGE", "OSTRE"]),
      imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80",
    },
    {
      name: "Pita klasyczna",
      description: "Lekka wersja — kurczak, sałata, pomidor, sos czosnkowy.",
      price: 19.0,
      calories: 380,
      tags: JSON.stringify([]),
      imageUrl: "https://images.unsplash.com/photo-1606755456206-b25206cde27e?w=600&q=80",
    },
    {
      name: "Pita wege",
      description: "Hummus, warzywa sezonowe, oliwa z oliwek, zioła.",
      price: 17.0,
      calories: 310,
      tags: JSON.stringify(["WEGE"]),
      imageUrl: "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=600&q=80",
    },
    {
      name: "Frytki z serem",
      description:
        "Duża porcja frytek pod warstwą roztopionego sera i sosu czosnkowego.",
      price: 14.0,
      calories: 720,
      tags: JSON.stringify(["WEGE", "FRYTKI_Z_SEREM"]),
      imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80",
    },
  ];

  for (const p of products) {
    const existing = await prisma.product.findFirst({
      where: { name: p.name },
    });
    if (!existing) await prisma.product.create({ data: p });
  }

  // Rewards
  const rewards = [
    {
      name: "Darmowy Kebab klasyczny",
      description: "Wymień Kule Mocy na ulubiony klasyk.",
      pointsCost: 500,
    },
    {
      name: "Darmowe frytki z serem",
      description: "Box frytek z serem na koszt Kebab Queen.",
      pointsCost: 150,
    },
    {
      name: "Duży napój",
      description: "Cola, Sprite lub woda — Twój wybór.",
      pointsCost: 100,
    },
    {
      name: "Zestaw Premium",
      description: "Duży Kebab Queen + Frytki z Serem + Napój.",
      pointsCost: 800,
    },
  ];

  for (const r of rewards) {
    const existing = await prisma.reward.findFirst({ where: { name: r.name } });
    if (!existing) await prisma.reward.create({ data: r });
  }

  // Happy Hours
  const hhCount = await prisma.happyHour.count();
  if (hhCount === 0) {
    await prisma.happyHour.createMany({
      data: [
        {
          dayOfWeek: -1,
          startHour: 12,
          startMin: 0,
          endHour: 14,
          endMin: 0,
          multiplier: 2.0,
          label: "Lunch Queen: każdy dzień 12-14, 2x punkty",
        },
        {
          dayOfWeek: 5,
          startHour: 20,
          startMin: 0,
          endHour: 23,
          endMin: 0,
          multiplier: 3.0,
          label: "Piątkowe szaleństwo: 20-23, 3x punkty",
        },
      ],
    });
  }

  // Demo user
  const demoUser = await prisma.user.upsert({
    where: { phone: "123456789" },
    update: {},
    create: {
      phone: "123456789",
      name: "Demo Queen",
      loyaltyAccount: {
        create: { balance: 350, tier: 3 },
      },
    },
  });

  // Seed transactions only if none exist
  const txCount = await prisma.transaction.count({
    where: { userId: demoUser.id },
  });
  if (txCount === 0) {
    const now = new Date();
    const txDefs = [
      {
        points: 120,
        type: "EARN",
        description: "Zakup: Kebab klasyczny",
        daysAgo: 30,
      },
      {
        points: 60,
        type: "EARN",
        description: "Zakup: Pita wege",
        daysAgo: 25,
      },
      {
        points: -100,
        type: "REDEEM",
        description: "Nagroda: Duży napój",
        daysAgo: 20,
      },
      {
        points: 150,
        type: "EARN",
        description: "Zakup: Kebab amerykański (Happy Hour 2×)",
        daysAgo: 14,
      },
      {
        points: 20,
        type: "REFERRAL",
        description: "Polecenie: Marta K.",
        daysAgo: 10,
      },
      {
        points: 100,
        type: "EARN",
        description: "Zakup: Duży Kebab Queen",
        daysAgo: 5,
      },
    ];

    for (const tx of txDefs) {
      const date = new Date(now);
      date.setDate(date.getDate() - tx.daysAgo);
      await prisma.transaction.create({
        data: {
          userId: demoUser.id,
          points: tx.points,
          type: tx.type,
          description: tx.description,
          createdAt: date,
        },
      });
    }
  }

  console.log("Seed OK — user:", demoUser.phone, "/ id:", demoUser.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

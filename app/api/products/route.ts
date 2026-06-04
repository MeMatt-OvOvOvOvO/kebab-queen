import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const tags = sp.getAll("tag"); // ?tag=WEGE&tag=OSTRE

  const all = await prisma.product.findMany({
    where: { isAvailable: true },
    orderBy: { name: "asc" },
  });

  type ProductWithTags = Omit<(typeof all)[0], "tags"> & { tags: string[] };

  const products = all
    .map((p): ProductWithTags => ({ ...p, tags: JSON.parse(p.tags) as string[] }))
    .filter((p: ProductWithTags) => tags.length === 0 || tags.every((t: string) => p.tags.includes(t)));

  return NextResponse.json(products);
}

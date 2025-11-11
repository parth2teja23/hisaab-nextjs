import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, description, price, quantity, storeId } = await req.json();

  if (!name || !price || !quantity || !storeId)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  // Check if store belongs to logged-in user
  const store = await prisma.store.findFirst({
    where: {
      id: storeId,
      owner: { email: session.user.email },
    },
  });
  if (!store)
    return NextResponse.json({ error: "Store not found or unauthorized" }, { status: 404 });

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      quantity,
      storeId,
    },
  });

  return NextResponse.json(product, { status: 201 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const storeId = searchParams.get("storeId");

  if (!storeId)
    return NextResponse.json({ error: "Store ID required" }, { status: 400 });

  const products = await prisma.product.findMany({
    where: { storeId },
  });

  return NextResponse.json(products);
}

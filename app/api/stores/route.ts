import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();
  if (!name)
    return NextResponse.json({ error: "Store name is required" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const store = await prisma.store.create({
    data: {
      name,
      ownerId: user.id,
    },
  });

  return NextResponse.json(store, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { stores: true },
  });

  return NextResponse.json(user?.stores || []);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { storeId } = await req.json();
  if (!storeId)
    return NextResponse.json({ error: "Store ID required" }, { status: 400 });

  await prisma.store.delete({
    where: { id: storeId },
  });

  return NextResponse.json({ message: "Store deleted" }, { status: 200 });
}

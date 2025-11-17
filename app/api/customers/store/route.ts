import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, email, phone, storeId } = await req.json();

    if (!name || !phone || !storeId)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Step 1: Upsert global customer
    const customer = await prisma.customer.upsert({
      where: { phone },
      update: { name, email },
      create: {
        name,
        email,
        phone,
        userId: user.id
      }
    });

    // Step 2: Connect customer to this store
    await prisma.customerStore.upsert({
      where: {
        customerId_storeId: {
          customerId: customer.id,
          storeId
        }
      },
      update: { attendedAt: new Date() },
      create: { customerId: customer.id, storeId }
    });

    return NextResponse.json(customer);
  } catch (err) {
    console.error("Error adding store customer:", err);
    return NextResponse.json(
      { error: "Failed to add customer" },
      { status: 500 }
    );
  }
}

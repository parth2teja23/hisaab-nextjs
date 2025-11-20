import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// ---------------------------
// POST /api/customers
// Global customer creation (NO STORE)
// ---------------------------
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, email, phone } = await req.json();
    if (!name || !phone)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Create or update global customer (not store specific)
    const customer = await prisma.customer.upsert({
      where: { phone },
      update: {
        name,
        email,
      },
      create: {
        name,
        email,
        phone,
        userId: user.id,
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error("POST /api/customers error:", error);
    return NextResponse.json(
      { error: "Something went wrong while creating customer." },
      { status: 500 }
    );
  }
}

// ---------------------------
// GET /api/customers
// Supports 2 modes:
// 1. Global CRM (no storeId)
// 2. Store-specific customers (storeId provided)
// ---------------------------
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId");

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // -------------------------------------
    // 🎯 STORE MODE
    // -------------------------------------
    if (storeId) {
      const customers = await prisma.customerStore.findMany({
        where: { storeId },
        include: { customer: true },
        orderBy: { attendedAt: "desc" },
      });

      const formatted = customers.map((c) => ({
        id: c.customer.id,
        name: c.customer.name,
        email: c.customer.email,
        phone: c.customer.phone,
        attendedAt: c.attendedAt,
      }));

      return NextResponse.json(formatted);
    }

    // -------------------------------------
    // 🌍 GLOBAL MODE
    // -------------------------------------
    const customers = await prisma.customer.findMany({
      where: { userId: user.id },
      include: {
        stores: { include: { store: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("GET /api/customers error:", error);
    return NextResponse.json(
      { error: "Something went wrong while fetching customers." },
      { status: 500 }
    );
  }
}

// ---------------------------
// DELETE /api/customers?id=...
// ---------------------------
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json(
        { error: "Customer ID required" },
        { status: 400 }
      );

    await prisma.customer.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Customer deleted successfully." });
  } catch (error) {
    console.error("DELETE /api/customers error:", error);
    return NextResponse.json(
      { error: "Failed to delete customer." },
      { status: 500 }
    );
  }
}


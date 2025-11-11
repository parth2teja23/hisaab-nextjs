
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * POST /api/customers
 * Create or update a global customer for the logged-in user.
 */
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

    // Get the logged-in user (owner)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Find or create customer (unique by phone)
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

/**
 * GET /api/customers
 * Returns:
 *  - All customers of logged-in user (global CRM)
 *  - Or customers for a specific store if `storeId` is passed in query
 */
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId");

    // Fetch user (owner)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (storeId) {
      // 🎯 Fetch customers linked to a specific store
      const customers = await prisma.customerStore.findMany({
        where: { storeId },
        include: { customer: true },
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

    // 🌍 Fetch all customers under this user (global view)
    const customers = await prisma.customer.findMany({
      where: { userId: user.id },
      include: {
        stores: {
          include: { store: true },
        },
      },
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


/**
 * DELETE /api/customers?id=<customerId>
 * Removes a customer (and their store links)
 */
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "Customer ID required" }, { status: 400 });

    // Delete customer and cascade customerStore entries
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

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { storeId, customerPhone, items } = await req.json();

    if (!storeId || !customerPhone || !Array.isArray(items) || items.length === 0)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const customer = await prisma.customer.findUnique({
      where: { phone: customerPhone },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found. Please create them first." },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // ⭐ Auto-link customer to this store (core logic)
    // --------------------------------------------------
    await prisma.customerStore.upsert({
      where: {
        customerId_storeId: {
          customerId: customer.id,
          storeId,
        },
      },
      update: { attendedAt: new Date() },
      create: { customerId: customer.id, storeId },
    });

    // Fetch all products used in invoice
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let totalAmount = 0;
    const invoiceItems = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product)
        return NextResponse.json(
          { error: `Product ${item.productId} not found.` },
          { status: 404 }
        );

      if (product.quantity < item.quantity)
        return NextResponse.json(
          { error: `Not enough stock for ${product.name}.` },
          { status: 400 }
        );

      totalAmount += product.price * item.quantity;

      invoiceItems.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
      });
    }

    // --------------------------------------------------
    // ⭐ Create invoice + update product stock
    // --------------------------------------------------
    const invoice = await prisma.$transaction(async (tx) => {
      const newInvoice = await tx.invoice.create({
        data: {
          storeId,
          customerId: customer.id,
          totalAmount,
          items: {
            create: invoiceItems,
          },
        },
        include: {
          customer: true,          // ⭐ important fix
          items: { include: { product: true } },
        },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      return newInvoice;
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("POST /api/invoices error:", error);
    return NextResponse.json(
      { error: "Something went wrong while creating invoice." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId");

    if (!storeId)
      return NextResponse.json(
        { error: "Store ID required" },
        { status: 400 }
      );

    const invoices = await prisma.invoice.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
      include: {
        customer: true,
        items: { include: { product: true } }
      }
    });

    return NextResponse.json(invoices, { status: 200 });
  } catch (err) {
    console.error("GET /api/invoices error:", err);
    return NextResponse.json(
      { error: "Something went wrong while fetching invoices." },
      { status: 500 }
    );
  }
}

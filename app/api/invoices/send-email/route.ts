import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendInvoiceEmail } from "@/lib/mail-service";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { invoiceId } = await req.json();
    if (!invoiceId)
      return NextResponse.json({ error: "Invoice ID required" }, { status: 400 });

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { customer: true, items: { include: { product: true } }, store: true },
    });

    if (!invoice)
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

    if (!invoice.customer?.email)
      return NextResponse.json({ error: "Customer has no email address" }, { status: 400 });

    const ok = await sendInvoiceEmail(invoice.customer.email, invoice as any);
    if (!ok)
      return NextResponse.json({ error: "Email failed to send" }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/invoices/send-email error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

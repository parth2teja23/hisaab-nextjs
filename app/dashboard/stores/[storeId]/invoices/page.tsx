"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import jsPDF from "jspdf";

interface Customer {
  id: string;
  name: string;
  phone: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface InvoiceItemInput {
  productId: string;
  quantity: number;
}

export default function StoreInvoicesPage() {
  const params = useParams();
  const storeId = params.storeId as string;

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItemInput[]>([]);
  const [form, setForm] = useState({ customerPhone: "" });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);

  const total = Array.isArray(products)
    ? invoiceItems.reduce((sum, i) => {
        const product = products.find((p) => p.id === i.productId);
        return sum + (product ? product.price * i.quantity : 0);
      }, 0)
    : 0;

  // Fetch customers, products, and invoices for this store
  useEffect(() => {
    if (!storeId) return;

    fetch(`/api/customers/store/`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCustomers(data);
        else if (Array.isArray(data.customers)) setCustomers(data.customers);
      });

    fetch(`/api/products?storeId=${storeId}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
        else if (Array.isArray(data.products)) setProducts(data.products);
      });

    fetch(`/api/invoices?storeId=${storeId}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setInvoices(data);
      });
  }, [storeId]);

  const handleAddItem = () => {
    setInvoiceItems([...invoiceItems, { productId: "", quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  async function handleCreateInvoice(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customerPhone || invoiceItems.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId,
          customerPhone: form.customerPhone,
          items: invoiceItems,
        }),
      });

      if (res.ok) {
        const newInvoice = await res.json();
        setInvoices((prev) => [newInvoice, ...prev]);
        setOpen(false);
        setForm({ customerPhone: "" });
        setInvoiceItems([]);
      }
    } finally {
      setLoading(false);
    }
  }

  // PDF generator for a single invoice
  function generatePdf(inv: any) {
    const doc = new jsPDF({
      unit: "pt",
      format: "a4",
    });

    const marginLeft = 40;
    let cursorY = 50;

    // Header
    doc.setFontSize(18);
    doc.text(`Invoice #${inv.invoiceNumber}`, marginLeft, cursorY);
    doc.setFontSize(11);
    cursorY += 22;
    doc.text(`Date: ${inv.date ? new Date(inv.date).toLocaleDateString() : ""}`, marginLeft, cursorY);
    cursorY += 18;

    // Store / Customer block
    doc.setFontSize(12);
    cursorY += 6;
    doc.text("Customer:", marginLeft, cursorY);
    doc.setFontSize(11);
    doc.text(`${inv.customer?.name ?? "—"}`, marginLeft + 70, cursorY);
    cursorY += 16;
    doc.text(`Phone: ${inv.customer?.phone ?? "—"}`, marginLeft + 70, cursorY);
    cursorY += 24;

    // Table header
    doc.setFontSize(12);
    doc.text("Item", marginLeft, cursorY);
    doc.text("Qty", marginLeft + 280, cursorY);
    doc.text("Unit", marginLeft + 340, cursorY);
    doc.text("Total", marginLeft + 430, cursorY);
    cursorY += 8;
    doc.setLineWidth(0.5);
    doc.line(marginLeft, cursorY, 560, cursorY);
    cursorY += 14;

    // Items
    doc.setFontSize(11);
    (inv.items ?? []).forEach((item: any, idx: number) => {
      const name = item.product?.name ?? "Unknown";
      const qty = item.quantity ?? 0;
      const unitPrice = item.unitPrice ?? 0;
      const lineTotal = (qty * unitPrice) || 0;

      // Wrap long product names if needed
      const maxNameWidth = 260;
      const splitName = doc.splitTextToSize(name, maxNameWidth);
      doc.text(splitName, marginLeft, cursorY);
      // write the rest of columns on same baseline
      doc.text(String(qty), marginLeft + 280, cursorY);
      doc.text(`₹${unitPrice.toFixed(2)}`, marginLeft + 340, cursorY);
      doc.text(`₹${lineTotal.toFixed(2)}`, marginLeft + 430, cursorY);

      // move cursor down by number of wrapped lines
      cursorY += 14 * splitName.length;

      // If page overflow, add page
      if (cursorY > 720) {
        doc.addPage();
        cursorY = 50;
      }
    });

    cursorY += 12;
    doc.line(marginLeft, cursorY, 560, cursorY);
    cursorY += 18;

    // Totals
    const totalAmount = inv.totalAmount ?? (inv.items ?? []).reduce((s: number, it: any) => s + (it.unitPrice * it.quantity), 0);
    doc.setFontSize(12);
    doc.text(`Total: ₹${Number(totalAmount).toFixed(2)}`, marginLeft + 300, cursorY);

    // Save file
    const filename = `invoice-${inv.invoiceNumber ?? inv.id}.pdf`;
    doc.save(filename);
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Invoices</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create Invoice</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>New Invoice</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreateInvoice} className="space-y-4 mt-4">
              {/* Customer */}
              <div>
                <Label>Customer</Label>
                <Select
                  value={form.customerPhone}
                  onValueChange={(value) =>
                    setForm({ ...form, customerPhone: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.phone}>
                        {c.name} ({c.phone})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Products */}
              <div className="space-y-2">
                <Label>Products</Label>
                {invoiceItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 border rounded-md p-2"
                  >
                    <Select
                      value={item.productId}
                      onValueChange={(value) => {
                        const updated = [...invoiceItems];
                        updated[index].productId = value;
                        setInvoiceItems(updated);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name} (₹{p.price})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const updated = [...invoiceItems];
                        updated[index].quantity = parseInt(e.target.value);
                        setInvoiceItems(updated);
                      }}
                      className="w-24"
                    />

                    <Button
                      variant="destructive"
                      size="sm"
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddItem}
                  className="w-full"
                >
                  + Add Product
                </Button>
              </div>

              <div className="text-right font-semibold text-lg">
                Total: ₹{total.toFixed(2)}
              </div>

              <Button type="submit" disabled={loading} className="w-full mt-2">
                {loading ? "Creating..." : "Create Invoice"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {invoices.length === 0 ? (
        <p className="text-gray-500">No invoices for this store yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {invoices.map((inv) => (
            <Card key={inv.id} className="p-4 relative">
              {/* PDF icon top-left */}
              <button
                title="Download PDF"
                onClick={() => generatePdf(inv)}
                className="absolute right-3 top-3 p-1 rounded hover:bg-gray-100"
                aria-label={`Download invoice ${inv.invoiceNumber} as PDF`}
              >
                {/* simple pdf svg icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 18H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 14H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <h2 className="font-semibold text-lg">
                Invoice #{inv.invoiceNumber}
              </h2>
              <p className="text-sm text-gray-600">
                Customer: {inv.customer?.name || "—"}
              </p>
              <ul className="text-sm text-gray-700 mt-2">
                {inv.items?.map((item: any) => (
                  <li key={item.id}>
                    {item.product?.name} × {item.quantity} = ₹
                    {(item.unitPrice * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
              <div className="mt-2 font-semibold text-right">
                Total: ₹{inv.totalAmount.toFixed(2)}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

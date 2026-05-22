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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, Download, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import type { Invoice } from "@/lib/types";

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
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [fetching, setFetching] = useState(true);

  const total = invoiceItems.reduce((sum, i) => {
    const product = products.find((p) => p.id === i.productId);
    return sum + (product ? product.price * i.quantity : 0);
  }, 0);

  useEffect(() => {
    if (!storeId) return;

    fetch(`/api/customers/store?storeId=${storeId}`)
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
      })
      .finally(() => setFetching(false));
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
        toast.success(`Invoice #${newInvoice.invoiceNumber} created`, {
          description: `₹${Number(newInvoice.totalAmount).toLocaleString("en-IN")} — PDF ready to download.`,
        });
      } else {
        toast.error("Failed to create invoice.");
      }
    } finally {
      setLoading(false);
    }
  }

  function generatePdf(inv: Invoice) {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const marginLeft = 40;
    let y = 50;

    doc.setFontSize(18);
    doc.text(`Invoice #${inv.invoiceNumber}`, marginLeft, y);
    doc.setFontSize(11);
    y += 22;
    doc.text(
      `Date: ${inv.createdAt ? new Date(inv.createdAt).toLocaleDateString("en-IN") : ""}`,
      marginLeft,
      y
    );
    y += 24;

    doc.setFontSize(12);
    doc.text("Customer:", marginLeft, y);
    doc.setFontSize(11);
    doc.text(`${inv.customer?.name ?? "—"}`, marginLeft + 70, y);
    y += 16;
    doc.text(`Phone: ${inv.customer?.phone ?? "—"}`, marginLeft + 70, y);
    y += 24;

    doc.setFontSize(12);
    doc.text("Item", marginLeft, y);
    doc.text("Qty", marginLeft + 280, y);
    doc.text("Unit", marginLeft + 340, y);
    doc.text("Total", marginLeft + 430, y);
    y += 8;
    doc.setLineWidth(0.5);
    doc.line(marginLeft, y, 560, y);
    y += 14;

    doc.setFontSize(11);
    (inv.items ?? []).forEach((item) => {
      const name = item.product?.name ?? "Unknown";
      const qty = item.quantity ?? 0;
      const unitPrice = item.unitPrice ?? 0;
      const lineTotal = qty * unitPrice;
      const splitName = doc.splitTextToSize(name, 260);
      doc.text(splitName, marginLeft, y);
      doc.text(String(qty), marginLeft + 280, y);
      doc.text(`₹${unitPrice.toFixed(2)}`, marginLeft + 340, y);
      doc.text(`₹${lineTotal.toFixed(2)}`, marginLeft + 430, y);
      y += 14 * splitName.length;
      if (y > 720) {
        doc.addPage();
        y = 50;
      }
    });

    y += 12;
    doc.line(marginLeft, y, 560, y);
    y += 18;

    const totalAmount =
      inv.totalAmount ??
      (inv.items ?? []).reduce((s, it) => s + it.unitPrice * it.quantity, 0);
    doc.setFontSize(12);
    doc.text(
      `Total: ₹${Number(totalAmount).toFixed(2)}`,
      marginLeft + 300,
      y
    );

    doc.save(`invoice-${inv.invoiceNumber ?? inv.id}.pdf`);
    toast.success(`Invoice #${inv.invoiceNumber} downloaded`);
  }

  const sortedInvoices = [...invoices].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {fetching
                ? "Loading…"
                : `${invoices.length} invoice${invoices.length !== 1 ? "s" : ""} total`}
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-slate-950 hover:bg-slate-800 rounded-lg text-sm">
                <Plus size={15} />
                New Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Invoice</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreateInvoice} className="space-y-5 mt-2">
                {/* Customer select */}
                <div className="space-y-1.5">
                  <Label>Customer</Label>
                  <Select
                    value={form.customerPhone}
                    onValueChange={(value) =>
                      setForm({ ...form, customerPhone: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a customer" />
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
                  <Label>Line Items</Label>
                  {invoiceItems.length === 0 && (
                    <p className="text-xs text-slate-400">
                      Add at least one product.
                    </p>
                  )}
                  {invoiceItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2"
                    >
                      <Select
                        value={item.productId}
                        onValueChange={(value) => {
                          const updated = [...invoiceItems];
                          updated[index].productId = value;
                          setInvoiceItems(updated);
                        }}
                      >
                        <SelectTrigger className="flex-1 bg-white text-sm h-9">
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name} — ₹{p.price}
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
                          updated[index].quantity = parseInt(e.target.value) || 1;
                          setInvoiceItems(updated);
                        }}
                        className="w-20 h-9 text-sm text-center bg-white"
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddItem}
                    className="w-full h-9 text-sm border-dashed"
                  >
                    <Plus size={13} className="mr-1" />
                    Add product
                  </Button>
                </div>

                {/* Total */}
                {total > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">
                      Total
                    </span>
                    <span className="text-lg font-bold text-slate-900">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-950 hover:bg-slate-800"
                >
                  {loading ? "Creating…" : "Create Invoice"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Invoices table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {fetching ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-slate-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : sortedInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-14 w-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <FileText className="h-7 w-7 text-slate-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-1">
                No invoices yet
              </h3>
              <p className="text-slate-500 text-sm max-w-xs mb-5 leading-relaxed">
                Create your first invoice to start tracking sales for this store.
              </p>
              <Button
                onClick={() => setOpen(true)}
                className="gap-2 bg-slate-950 hover:bg-slate-800 text-sm"
              >
                <Plus size={14} />
                Create invoice
              </Button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    PDF
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      #{inv.invoiceNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {inv.customer?.name || "—"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {inv.customer?.phone || ""}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 hidden md:table-cell">
                      {(inv.items ?? []).length} item
                      {(inv.items ?? []).length !== 1 ? "s" : ""}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 hidden sm:table-cell">
                      {inv.createdAt
                        ? new Date(inv.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 text-right">
                      ₹{Number(inv.totalAmount).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => generatePdf(inv)}
                        title="Download PDF"
                        className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        aria-label={`Download invoice ${inv.invoiceNumber} as PDF`}
                      >
                        <Download size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

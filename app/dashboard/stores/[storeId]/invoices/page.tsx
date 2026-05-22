"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus, Download, FileText, Trash2, Mail, CheckCircle, Clock, AlertCircle, Search, X } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import type { Invoice, InvoiceStatus } from "@/lib/types";

interface Customer { id: string; name: string; phone: string; }
interface Product { id: string; name: string; price: number; quantity: number; }
interface InvoiceItemInput { productId: string; quantity: number; }

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; color: string; icon: React.ElementType }> = {
  PAID:    { label: "Paid",    color: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", icon: CheckCircle },
  PENDING: { label: "Pending", color: "bg-amber-50 text-amber-700 ring-amber-600/20",       icon: Clock },
  OVERDUE: { label: "Overdue", color: "bg-red-50 text-red-600 ring-red-600/20",             icon: AlertCircle },
};

export default function StoreInvoicesPage() {
  const { storeId } = useParams();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItemInput[]>([]);
  const [form, setForm] = useState({ customerPhone: "" });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "ALL">("ALL");
  const [emailingId, setEmailingId] = useState<string | null>(null);

  const total = invoiceItems.reduce((sum, i) => {
    const p = products.find((p) => p.id === i.productId);
    return sum + (p ? p.price * i.quantity : 0);
  }, 0);

  useEffect(() => {
    if (!storeId) return;
    fetch(`/api/customers/store?storeId=${storeId}`).then(r => r.json()).then(d => setCustomers(Array.isArray(d) ? d : []));
    fetch(`/api/products?storeId=${storeId}`).then(r => r.json()).then(d => setProducts(Array.isArray(d) ? d : []));
    fetch(`/api/invoices?storeId=${storeId}`).then(r => r.json()).then(d => setInvoices(Array.isArray(d) ? d : [])).finally(() => setFetching(false));
  }, [storeId]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return invoices
      .filter(inv => statusFilter === "ALL" || inv.status === statusFilter)
      .filter(inv => !q || inv.customer?.name?.toLowerCase().includes(q) || String(inv.invoiceNumber).includes(q))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [invoices, search, statusFilter]);

  async function handleCreateInvoice(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customerPhone || invoiceItems.length === 0) return;
    setLoading(true);
    // Optimistic update
    const optimistic = { id: `tmp-${Date.now()}`, invoiceNumber: 0, status: "PENDING" as InvoiceStatus, customer: customers.find(c => c.phone === form.customerPhone) as any, items: [], totalAmount: total, createdAt: new Date(), customerId: "", storeId: storeId as string };
    setInvoices(prev => [optimistic, ...prev]);
    try {
      const res = await fetch("/api/invoices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ storeId, customerPhone: form.customerPhone, items: invoiceItems }) });
      if (res.ok) {
        const inv = await res.json();
        setInvoices(prev => [inv, ...prev.filter(i => i.id !== optimistic.id)]);
        setOpen(false); setForm({ customerPhone: "" }); setInvoiceItems([]);
        toast.success(`Invoice #${inv.invoiceNumber} created`, { description: `₹${Number(inv.totalAmount).toLocaleString("en-IN")} · PDF ready to download` });
      } else {
        setInvoices(prev => prev.filter(i => i.id !== optimistic.id));
        toast.error("Failed to create invoice.");
      }
    } finally { setLoading(false); }
  }

  async function markStatus(inv: Invoice, status: InvoiceStatus) {
    const prev = inv.status;
    setInvoices(list => list.map(i => i.id === inv.id ? { ...i, status } : i));
    const res = await fetch("/api/invoices", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: inv.id, status }) });
    if (res.ok) {
      toast.success(`Invoice #${inv.invoiceNumber} marked as ${STATUS_CONFIG[status].label}`);
    } else {
      setInvoices(list => list.map(i => i.id === inv.id ? { ...i, status: prev } : i));
      toast.error("Failed to update status.");
    }
  }

  async function sendEmail(inv: Invoice) {
    if (!inv.customer?.email) { toast.error("No email on file for this customer."); return; }
    setEmailingId(inv.id);
    const toastId = toast.loading(`Sending invoice to ${inv.customer.email}…`);
    const res = await fetch("/api/invoices/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ invoiceId: inv.id }) });
    toast.dismiss(toastId);
    if (res.ok) toast.success("Invoice emailed!", { description: `Sent to ${inv.customer.email}` });
    else toast.error("Email failed — check SMTP config.");
    setEmailingId(null);
  }

  function generatePdf(inv: Invoice) {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const L = 40; let y = 50;
    const gst = Number(inv.totalAmount) * 0.18;
    const base = Number(inv.totalAmount) - gst;

    doc.setFontSize(20); doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 300, y, { align: "center" });
    doc.setFontSize(11); doc.setFont("helvetica", "normal");
    y += 24; doc.text(`Invoice #${inv.invoiceNumber}  |  Date: ${inv.createdAt ? new Date(inv.createdAt).toLocaleDateString("en-IN") : ""}`, L, y);
    y += 16; doc.text(`Customer: ${inv.customer?.name ?? "—"}  |  Phone: ${inv.customer?.phone ?? "—"}`, L, y);
    if (inv.customer?.email) { y += 16; doc.text(`Email: ${inv.customer.email}`, L, y); }
    y += 24;
    doc.setFont("helvetica", "bold");
    doc.text("Item", L, y); doc.text("Qty", L + 270, y); doc.text("Unit Price", L + 330, y); doc.text("Total", L + 430, y);
    y += 8; doc.setLineWidth(0.5); doc.line(L, y, 560, y); y += 14;
    doc.setFont("helvetica", "normal");
    (inv.items ?? []).forEach(item => {
      const name = item.product?.name ?? "Unknown"; const qty = item.quantity ?? 0; const unit = item.unitPrice ?? 0;
      const split = doc.splitTextToSize(name, 260);
      doc.text(split, L, y); doc.text(String(qty), L + 270, y); doc.text(`₹${unit.toFixed(2)}`, L + 330, y); doc.text(`₹${(qty * unit).toFixed(2)}`, L + 430, y);
      y += 14 * split.length; if (y > 720) { doc.addPage(); y = 50; }
    });
    y += 12; doc.line(L, y, 560, y); y += 18;
    doc.text(`Base Amount:`, L + 280, y); doc.text(`₹${base.toFixed(2)}`, L + 430, y); y += 16;
    doc.text(`CGST (9%):`, L + 280, y); doc.text(`₹${(gst / 2).toFixed(2)}`, L + 430, y); y += 16;
    doc.text(`SGST (9%):`, L + 280, y); doc.text(`₹${(gst / 2).toFixed(2)}`, L + 430, y); y += 16;
    doc.setFont("helvetica", "bold");
    doc.text(`Total (incl. GST):`, L + 280, y); doc.text(`₹${Number(inv.totalAmount).toFixed(2)}`, L + 430, y);
    doc.save(`invoice-${inv.invoiceNumber ?? inv.id}.pdf`);
    toast.success(`Invoice #${inv.invoiceNumber} downloaded`);
  }

  const totals = { all: invoices.length, paid: invoices.filter(i => i.status === "PAID").length, pending: invoices.filter(i => i.status === "PENDING").length, overdue: invoices.filter(i => i.status === "OVERDUE").length };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
            <p className="text-slate-500 text-sm mt-0.5">{fetching ? "Loading…" : `${totals.all} total · ${totals.paid} paid · ${totals.pending} pending · ${totals.overdue} overdue`}</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-slate-950 hover:bg-slate-800 rounded-lg text-sm"><Plus size={15} />New Invoice</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Create Invoice</DialogTitle></DialogHeader>
              <form onSubmit={handleCreateInvoice} className="space-y-5 mt-2">
                <div className="space-y-1.5">
                  <Label>Customer</Label>
                  <Select value={form.customerPhone} onValueChange={v => setForm({ customerPhone: v })}>
                    <SelectTrigger><SelectValue placeholder="Select a customer" /></SelectTrigger>
                    <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.phone}>{c.name} ({c.phone})</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Line Items</Label>
                  {invoiceItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2">
                      <Select value={item.productId} onValueChange={v => { const u = [...invoiceItems]; u[idx].productId = v; setInvoiceItems(u); }}>
                        <SelectTrigger className="flex-1 bg-white text-sm h-9"><SelectValue placeholder="Product" /></SelectTrigger>
                        <SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id}>{p.name} — ₹{p.price}</SelectItem>)}</SelectContent>
                      </Select>
                      <Input type="number" min="1" value={item.quantity} onChange={e => { const u = [...invoiceItems]; u[idx].quantity = parseInt(e.target.value) || 1; setInvoiceItems(u); }} className="w-20 h-9 text-sm text-center bg-white" />
                      <button type="button" onClick={() => setInvoiceItems(invoiceItems.filter((_, i) => i !== idx))} className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={() => setInvoiceItems([...invoiceItems, { productId: "", quantity: 1 }])} className="w-full h-9 text-sm border-dashed"><Plus size={13} className="mr-1" />Add product</Button>
                </div>
                {total > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 space-y-1">
                    <div className="flex justify-between text-xs text-slate-500"><span>Base</span><span>₹{(total / 1.18).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span></div>
                    <div className="flex justify-between text-xs text-slate-500"><span>GST (18%)</span><span>₹{(total - total / 1.18).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span></div>
                    <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200"><span>Total</span><span>₹{total.toLocaleString("en-IN")}</span></div>
                  </div>
                )}
                <Button type="submit" disabled={loading} className="w-full bg-slate-950 hover:bg-slate-800">{loading ? "Creating…" : "Create Invoice"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Status tabs + search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
            {(["ALL", "PENDING", "PAID", "OVERDUE"] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${statusFilter === s ? "bg-slate-950 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"}`}>
                {s === "ALL" ? `All (${totals.all})` : s === "PAID" ? `Paid (${totals.paid})` : s === "PENDING" ? `Pending (${totals.pending})` : `Overdue (${totals.overdue})`}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by customer or #…" className="w-full pl-8 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent" />
            {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={13} /></button>}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          {fetching ? (
            <div className="p-6 space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-14 w-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4"><FileText className="h-7 w-7 text-slate-400" /></div>
              <h3 className="text-base font-semibold text-slate-900 mb-1">{search || statusFilter !== "ALL" ? "No matching invoices" : "No invoices yet"}</h3>
              <p className="text-slate-500 text-sm max-w-xs">{search || statusFilter !== "ALL" ? "Try clearing the filter." : "Create your first invoice to get started."}</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(inv => {
                  const st = STATUS_CONFIG[inv.status ?? "PENDING"];
                  const StIcon = st.icon;
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-5 py-4 text-sm font-bold text-slate-900">#{inv.invoiceNumber || "—"}</td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-800">{inv.customer?.name || "—"}</p>
                        <p className="text-xs text-slate-400">{inv.customer?.phone || ""}</p>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-400 hidden sm:table-cell">
                        {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <Select value={inv.status ?? "PENDING"} onValueChange={v => markStatus(inv, v as InvoiceStatus)}>
                          <SelectTrigger className={`h-7 w-28 text-xs font-semibold rounded-full border-0 ring-1 ring-inset ${st.color} focus:ring-2 focus:ring-slate-900 px-2.5 gap-1`}>
                            <StIcon size={11} /><SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="PAID">Paid</SelectItem>
                            <SelectItem value="OVERDUE">Overdue</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-slate-900 text-right">₹{Number(inv.totalAmount).toLocaleString("en-IN")}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => sendEmail(inv)} disabled={emailingId === inv.id} title="Email invoice" className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-40">
                            <Mail size={14} />
                          </button>
                          <button onClick={() => generatePdf(inv)} title="Download PDF" className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                            <Download size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

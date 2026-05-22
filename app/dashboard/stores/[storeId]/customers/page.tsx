"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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
import { Plus, Users, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

type Customer = {
  id: string;
  name: string;
  email?: string;
  phone: string;
};

export default function StoreCustomersPage() {
  const { storeId } = useParams();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (!storeId) return;
    fetch(`/api/customers/store?storeId=${storeId}`)
      .then((res) => res.json())
      .then((data) => setCustomers(Array.isArray(data) ? data : []))
      .finally(() => setFetching(false));
  }, [storeId]);

  async function handleAddCustomer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setLoading(true);

    const res = await fetch("/api/customers/store", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, storeId }),
    });

    if (res.ok) {
      const newCust: Customer = await res.json();
      setCustomers((prev) => [...prev, newCust]);
      setForm({ name: "", email: "", phone: "" });
      setOpen(false);
      toast.success(`${newCust.name} added`, { description: "Customer linked to this store." });
    } else {
      toast.error("Failed to add customer.");
    }

    setLoading(false);
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  const AVATAR_COLORS = [
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-violet-100 text-violet-700",
    "bg-orange-100 text-orange-700",
    "bg-rose-100 text-rose-700",
    "bg-cyan-100 text-cyan-700",
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {fetching
                ? "Loading…"
                : `${customers.length} customer${customers.length !== 1 ? "s" : ""} in this store`}
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-slate-950 hover:bg-slate-800 rounded-lg text-sm">
                <Plus size={15} />
                Add Customer
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Customer</DialogTitle>
              </DialogHeader>

              <form
                onSubmit={handleAddCustomer}
                className="space-y-4 mt-4"
              >
                <div className="space-y-1.5">
                  <Label>Full Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., Amit Kumar"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Email address</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="amit@example.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone number</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-950 hover:bg-slate-800"
                >
                  {loading ? "Adding…" : "Add Customer"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Customers table / empty state */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {fetching ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-14 bg-slate-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-14 w-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-slate-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-1">
                No customers yet
              </h3>
              <p className="text-slate-500 text-sm max-w-xs mb-5 leading-relaxed">
                Add customers to this store so you can create invoices for them.
              </p>
              <Button
                onClick={() => setOpen(true)}
                className="gap-2 bg-slate-950 hover:bg-slate-800 text-sm"
              >
                <Plus size={14} />
                Add your first customer
              </Button>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Phone
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c, index) => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                            AVATAR_COLORS[index % AVATAR_COLORS.length]
                          }`}
                        >
                          {getInitials(c.name)}
                        </div>
                        <span className="text-sm font-medium text-slate-900">
                          {c.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      {c.email ? (
                        <span className="flex items-center gap-1.5 text-sm text-slate-500">
                          <Mail size={13} />
                          {c.email}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Phone size={13} />
                        {c.phone}
                      </span>
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

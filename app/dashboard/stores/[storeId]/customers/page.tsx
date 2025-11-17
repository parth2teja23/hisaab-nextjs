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
import { Card } from "@/components/ui/card";

export default function StoreCustomersPage() {
  const { storeId } = useParams();

  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  // Fetch store customers
  useEffect(() => {
    if (!storeId) return;

    fetch(`/api/customers?storeId=${storeId}`)
      .then(res => res.json())
      .then(data => setCustomers(Array.isArray(data) ? data : []));
  }, [storeId]);

  async function handleAddCustomer(e) {
    e.preventDefault();
    if (!form.name || !form.phone) return;

    setLoading(true);

    const res = await fetch("/api/customers/store", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, storeId })
    });

    if (res.ok) {
      const newCust = await res.json();
      setCustomers(prev => [...prev, newCust]);
      setForm({ name: "", email: "", phone: "" });
      setOpen(false);
    }

    setLoading(false);
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Store Customers</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Customer</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Customer to Store</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddCustomer} className="space-y-4 mt-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Customer"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Customer List */}
      {customers.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {customers.map(c => (
            <Card key={c.id} className="p-4">
              <h2 className="font-semibold text-lg">{c.name}</h2>
              <p className="text-gray-500">{c.email || "—"}</p>
              <p className="mt-1">📞 {c.phone}</p>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No customers in this store yet.</p>
      )}
    </div>
  );
}

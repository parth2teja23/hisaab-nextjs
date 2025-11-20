"use client";

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

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // 🧠 Fetch all customers (global)
  useEffect(() => {
    fetch("/api/customers/store")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setCustomers(data);
        else setCustomers([]);
      })
      .catch(() => setCustomers([]));
  }, []);

  async function handleAddCustomer(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone) return;

    setLoading(true);

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // 👈 no storeId here
      });

      if (res.ok) {
        const newCustomer = await res.json();
        setCustomers((prev) => [...prev, newCustomer]);
        setForm({ name: "", email: "", phone: "" });
        setOpen(false);
      }
    } catch (err) {
      console.error("Error adding customer:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Customers</h1>

        {/* Add Customer Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Customer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddCustomer} className="space-y-4 mt-4">
              <div>
                <Label>Name</Label>
                <Input
                  placeholder="Customer name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  placeholder="Customer email (optional)"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  placeholder="Customer phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
      {Array.isArray(customers) && customers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {customers.map((c) => (
            <Card key={c.id} className="p-4 hover:shadow-md transition">
              <h2 className="font-medium text-lg">{c.name}</h2>
              <p className="text-gray-500 text-sm">{c.email || "—"}</p>
              <p className="text-gray-700 text-sm mt-1">📞 {c.phone}</p>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No customers added yet.</p>
      )}
    </div>
  );
}

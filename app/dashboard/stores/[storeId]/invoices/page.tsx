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
            <Card key={inv.id} className="p-4">
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

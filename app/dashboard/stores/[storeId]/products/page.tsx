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

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
}

export default function ProductsPage() {
  const params = useParams();
  const storeId = params.storeId as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });

  // Fetch products on load
  useEffect(() => {
    if (!storeId) return;
    fetch(`/api/products?storeId=${storeId}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error loading products", err));
  }, [storeId]);

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.quantity) return;

    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity),
          storeId,
        }),
      });

      if (res.ok) {
        const newProduct = await res.json();
        setProducts((prev) => [...prev, newProduct]);
        setForm({ name: "", description: "", price: "", quantity: "" });
        setOpen(false);
      }
    } catch (err) {
      console.error("Error adding product:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Inventory</h1>
          <p className="text-gray-500">Store ID: {storeId}</p>
        </div>

        {/* Create Product Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new product</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddProduct} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Silk Kurti"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Short description"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm({ ...form, quantity: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Product"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <p className="text-gray-500">No products added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <Card
              key={p.id}
              className="p-4 hover:shadow-md transition cursor-pointer"
            >
              <h2 className="font-medium text-lg">{p.name}</h2>
              <p className="text-sm text-gray-500">{p.description}</p>
              <div className="mt-2 flex justify-between text-sm">
                <span>₹{p.price}</span>
                <span className="text-gray-500">Qty: {p.quantity}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

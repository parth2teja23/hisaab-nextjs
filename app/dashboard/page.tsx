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
import { Plus, Store, ArrowRight, Package, FileText, Users } from "lucide-react";
import { toast } from "sonner";

interface StoreType {
  id: string;
  name: string;
}

const STORE_COLORS = [
  { iconBg: "bg-blue-100", iconText: "text-blue-700" },
  { iconBg: "bg-violet-100", iconText: "text-violet-700" },
  { iconBg: "bg-emerald-100", iconText: "text-emerald-700" },
  { iconBg: "bg-orange-100", iconText: "text-orange-700" },
  { iconBg: "bg-rose-100", iconText: "text-rose-700" },
  { iconBg: "bg-cyan-100", iconText: "text-cyan-700" },
];

export default function StoresPage() {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch("/api/stores")
      .then((res) => res.json())
      .then((data) => setStores(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error loading stores", err))
      .finally(() => setFetching(false));
  }, []);

  async function handleCreateStore(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const newStore = await res.json();
        setStores((prev) => [...prev, newStore]);
        setName("");
        setOpen(false);
        toast.success("Store created!", { description: `"${newStore.name}" is ready to use.` });
      } else {
        toast.error("Failed to create store.");
      }
    } catch (err) {
      console.error("Error creating store:", err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Stores</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {fetching
                ? "Loading…"
                : stores.length > 0
                ? `${stores.length} store${stores.length !== 1 ? "s" : ""} — click to manage`
                : "Create your first store to get started"}
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-slate-950 hover:bg-slate-800 rounded-lg text-sm">
                <Plus size={15} />
                New Store
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Store</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateStore} className="space-y-4 mt-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Store Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Pakeeza Women Wear"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-950 hover:bg-slate-800"
                >
                  {loading ? "Creating…" : "Create Store"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Loading skeleton */}
        {fetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-36 bg-white border border-slate-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : stores.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-5">
              <Store className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No stores yet</h3>
            <p className="text-slate-500 text-sm max-w-xs mb-6 leading-relaxed">
              Create your first store to start managing inventory, invoices, and customers.
            </p>
            <Button
              onClick={() => setOpen(true)}
              className="gap-2 bg-slate-950 hover:bg-slate-800"
            >
              <Plus size={15} />
              Create your first store
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {stores.map((store, index) => {
              const color = STORE_COLORS[index % STORE_COLORS.length];
              return (
                <div
                  key={store.id}
                  onClick={() =>
                    (window.location.href = `/dashboard/stores/${store.id}`)
                  }
                  className="group bg-white border border-slate-200 rounded-xl p-5 cursor-pointer hover:border-slate-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className={`h-10 w-10 ${color.iconBg} ${color.iconText} rounded-xl flex items-center justify-center font-bold text-lg`}
                    >
                      {store.name[0].toUpperCase()}
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <h2 className="font-semibold text-slate-900 text-base leading-tight mb-1">
                    {store.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Package size={11} /> Inventory
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText size={11} /> Invoices
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={11} /> Customers
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
